import process from "node:process"

// 火山方舟图片生成/编辑 API 封装
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" })
  }

  const apiKey = process.env.VOLCENGINE_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, message: "Volcengine API key not configured" })
  }

  const body = await readBody(event) as {
    action: "generate" | "edit" | "replace_background"
    prompt?: string
    image_url?: string
    template?: any
  }

  const baseUrl = process.env.VOLCENGINE_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3"

  try {
    let response
    if (body.action === "replace_background" && body.image_url) {
      // 背景替换
      response = await fetch(`${baseUrl}/images/generations`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "doubao-seedream-4.0",
          prompt: body.prompt || "Professional portrait with solid color background",
          image: body.image_url,
          n: 1,
          size: "1024x1024",
        }),
      })
    } else if (body.action === "edit" && body.image_url) {
      // 图片编辑（美化）
      response = await fetch(`${baseUrl}/images/edits`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "doubao-seededit-3.0",
          image: body.image_url,
          prompt: body.prompt || "Enhance portrait quality, improve skin tone, brighten eyes",
          n: 1,
        }),
      })
    } else {
      throw createError({ statusCode: 400, message: "Invalid action or missing parameters" })
    }

    const data = await response.json()
    if (!response.ok) {
      throw createError({ statusCode: response.status, message: data.error?.message || "API request failed" })
    }

    return data
  } catch (error: any) {
    logger.error("Volcengine API error:", error)
    throw createError({ statusCode: 500, message: error.message || "Failed to process image" })
  }
})

