// 核心功能：场景化AI图像处理
// 支持多种场景：老照片修复、黑白上色、证件照优化等
// 使用火山方舟 Seededit 3.0 API
// 参考文档：https://www.volcengine.com/docs/82379/1824691

import { nanoid } from "nanoid"
import { getRestorationsTable } from "../database"
import { getSceneById, calculatePrice, type SceneConfig } from "../../shared/scene-config"

export default defineEventHandler(async (event) => {
  try {
    // 读取上传的文件和参数
    const form = await readFormData(event)
    
    // 主图和参考图
    const mainImage = form.get("main_image") as File || form.get("file") as File  // 兼容旧版
    const referenceImages = form.getAll("reference_images") as File[]
    
    // 场景和用户配置
    const sceneId = form.get("scene_id") as string || "old-photo-restoration"
    const userPrompt = form.get("prompt") as string || ""
    const negativePrompt = form.get("negative_prompt") as string || ""
    const guidanceScale = form.get("guidance_scale") as string
    const size = form.get("size") as string
    const enableOptimization = form.get("enable_optimization") === "true"
    
    // 自定义字段（标题、副标题等）
    const customFields: Record<string, string> = {}
    const customFieldKeys = [
      // 旧字段
      "main_title", "subtitle", "title_text", "subtitle_text", "product_name", "slogan", "topic", "key_points",
      // 新增字段
      "exhibition_title", "exhibition_info",
      "couple_names", "wedding_date",
      "festival_name", "greeting_text",
      "restaurant_name", "menu_items",
      "script_content", "product_type",
      "zodiac_name", "city_name",
      "manual_title", "manual_content",
      "material_desc",
      // 补全遗漏的字段
      "article_topic", "video_title", "quote_text", "author_name",
      "location_name", "zodiac_sign", "event_date", "exhibition_name"
    ]
    
    for (const key of customFieldKeys) {
      const value = form.get(key) as string
      if (value) {
        customFields[key] = value
      }
    }
    
    if (!mainImage) {
      throw createError({
        statusCode: 400,
        message: "No main image uploaded"
      })
    }

    // 获取场景配置
    const scene = getSceneById(sceneId)
    if (!scene) {
      throw createError({
        statusCode: 400,
        message: `Scene "${sceneId}" not found`
      })
    }

    if (!scene.enabled) {
      throw createError({
        statusCode: 400,
        message: `Scene "${sceneId}" is not enabled`
      })
    }

    // 保存原始文件
    const { saveUploadedPhoto } = await import("../utils/storage")
    const { url: originalUrl } = await saveUploadedPhoto(mainImage, mainImage.name)

    // 计算价格
    const price = calculatePrice(sceneId)

    // 创建修复记录
    const restoration = {
      id: nanoid(),
      user_id: event.context.user?.id,
      original_url: originalUrl,
      scene_id: sceneId,
      status: "processing" as const,
      payment_status: "unpaid" as const,
      price,
      created_at: Date.now()
    }

    const restorationsTable = getRestorationsTable()
    await restorationsTable.create(restoration)

    // 调用火山方舟API进行处理
    try {
      // 使用新的提示词合并逻辑
      const { mergePrompts, optimizePromptWithDoubao } = await import("../utils/prompt-optimizer")
      
      // 1. 先优化用户提示词（可选）
      let finalUserPrompt = userPrompt
      if (enableOptimization && userPrompt) {
        logger.info("🤖 使用豆包大模型优化提示词...")
        finalUserPrompt = await optimizePromptWithDoubao({
          userPrompt,
          sceneType: scene.name,
          apiKey: process.env.VOLCENGINE_API_KEY
        })
        logger.info(`📝 优化后: ${finalUserPrompt}`)
      }
      
      // 2. 合并提示词
      const systemPrompt = scene.ai.system_prompt || scene.ai.prompt || ""
      const template = scene.ai.prompt_merge_template || "{system_prompt}。{user_prompt}"
      const mergedPrompt = mergePrompts(systemPrompt, finalUserPrompt, template, customFields)
      
      logger.info(`🎯 最终提示词: ${mergedPrompt.substring(0, 100)}...`)
      
      // 合并用户配置和场景配置
      const config = {
        prompt: mergedPrompt,
        negative_prompt: negativePrompt || scene.ai.negative_prompt || "",
        guidance_scale: guidanceScale ? parseFloat(guidanceScale) : scene.ai.guidance_scale,
        size: size || scene.ai.size,
        watermark: scene.ai.watermark
      }
      
      const restoredUrls = await processWithAI(
        mainImage, 
        referenceImages, 
        scene, 
        config
      )
      
      // 更新记录 (暂时只存第一张，或存JSON)
      await restorationsTable.update(restoration.id, {
        restored_url: restoredUrls[0], // 兼容旧字段
        status: "completed",
        completed_at: Date.now()
      })

      logger.success(`✅ ${scene.name}完成，生成 ${restoredUrls.length} 张图`)

      return {
        id: restoration.id,
        scene_id: sceneId,
        original_url: originalUrl,
        restored_urls: restoredUrls, // 新增数组字段
        restored_url: restoredUrls[0], // 兼容
        status: "completed",
        payment_status: "unpaid",
        price
      }
    } catch (error: any) {
      // 失败时更新状态
      await restorationsTable.update(restoration.id, {
        status: "failed",
        error: error.message
      })
      
      // 但仍返回原图让用户看到界面（演示模式）
      logger.warn("⚠️  API调用失败，返回原图作为演示:", error.message)
      return {
        id: restoration.id,
        scene_id: sceneId,
        original_url: originalUrl,
        restored_urls: [originalUrl], // 失败时返回原图列表
        restored_url: originalUrl, // 失败时返回原图
        status: "completed",
        payment_status: "unpaid",
        price,
        demo_mode: true,
        error: error.message
      }
    }
  } catch (error: any) {
    logger.error("Failed to process photo:", error)
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to process photo"
    })
  }
})

/**
 * 调用火山方舟 Seedream 4.5 API 进行场景化AI处理
 * 文档：https://www.volcengine.com/docs/82379/1824121
 * 
 * 支持多图输入、用户自定义提示词和参数
 */
async function processWithAI(
  mainImage: File, 
  referenceImages: File[], 
  scene: SceneConfig,
  userConfig: {
    prompt: string
    negative_prompt: string
    guidance_scale: number
    size: string
    watermark: boolean
  }
): Promise<string[]> {
  const ARK_API_KEY = process.env.VOLCENGINE_API_KEY
  const BASE_URL = process.env.VOLCENGINE_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3"

  if (!ARK_API_KEY) {
    throw new Error("未配置 VOLCENGINE_API_KEY")
  }

  // 将主图转为base64
  const convertToBase64 = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const mimeType = file.type || "image/jpeg"
    return `data:${mimeType};base64,${base64}`
  }

  const mainImageBase64 = await convertToBase64(mainImage)
  
  // 将参考图也转为base64
  const referenceImagesBase64 = await Promise.all(
    referenceImages.map(img => convertToBase64(img))
  )

  // 组合：[主图, 参考图1, 参考图2, ...]
  const imageArray = [mainImageBase64, ...referenceImagesBase64]

  logger.info(`📤 调用火山方舟 ${scene.ai.model}（${scene.name}）...`)
  logger.info(`🎯 提示词: ${userConfig.prompt.substring(0, 50)}...`)
  logger.info(`📸 图片数量: 主图1张 + 参考图${referenceImages.length}张`)

  // 调用 Seedream 4.5 API，支持多图和完整配置
  const requestBody: any = {
    model: scene.ai.model,
    prompt: userConfig.prompt,
    guidance_scale: userConfig.guidance_scale,
    size: userConfig.size,
    watermark: userConfig.watermark
  }

  // 单图 vs 多图
  if (imageArray.length === 1) {
    requestBody.image = imageArray[0]
  } else {
    requestBody.image = imageArray  // Seedream 4.5 支持数组
  }

  // 负面提示词（可选）
  if (userConfig.negative_prompt) {
    requestBody.negative_prompt = userConfig.negative_prompt
  }

  // 设置60秒超时
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000)

  try {
    const response = await fetch(`${BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ARK_API_KEY}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      logger.error("🔴 火山方舟API错误:", response.status, errorText)
      throw new Error(`API调用失败 ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    logger.info("✅ 火山方舟API响应成功")
    
    const images = result.data || []
    if (images.length === 0) {
      throw new Error("API返回数据为空")
    }

    const urls = await Promise.all(images.map(async (img: any) => {
      if (img.url) {
        logger.info("📥 使用返回的图片URL")
        return img.url
      }
      if (img.b64_json) {
        logger.info("📥 保存base64图片")
        const { saveBase64Image } = await import("../utils/storage")
        return await saveBase64Image(img.b64_json, "restored")
      }
      return null
    }))

    return urls.filter(u => u !== null) as string[]
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error("API请求超时（60秒）")
    }
    throw error
  }
}