import { saveBase64Image } from "../../utils/storage"
import { colorizePhoto } from "../../services/volcengine"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      image: string // dataURL or base64
    }>(event)

    if (!body?.image) {
      throw createError({ statusCode: 400, message: "Missing image" })
    }

    // 提取纯 base64
    const base64 = body.image.includes(",") ? body.image.split(",")[1] : body.image

    // 保存到本地，获得可用的相对 URL
    const savedUrl = await saveBase64Image(base64, "colorize")

    // 调用火山方舟服务
    const result = await colorizePhoto(savedUrl)

    // 允许前端直接访问
    setResponseHeader(event, "Access-Control-Allow-Origin", "*")

    // 如果返回的是远程 URL，前端可选择再走 /api/image-proxy
    return {
      success: result.success,
      processed_url: result.processed_url,
      error: result.error,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Colorize failed",
    })
  }
})




