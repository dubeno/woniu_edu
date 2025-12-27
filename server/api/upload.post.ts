// 简化版上传接口
import { saveUploadedPhoto, ensureUploadDirs } from "#/utils/storage"

export default defineEventHandler(async (event) => {
  try {
    // 确保上传目录存在
    await ensureUploadDirs()
    
    // 读取表单数据
    const form = await readFormData(event)
    const file = form.get("file") as File
    
    if (!file) {
      throw createError({
        statusCode: 400,
        message: "No file uploaded"
      })
    }
    
    // 保存文件
    const { url, filename } = await saveUploadedPhoto(file, file.name)
    
    return {
      success: true,
      url,
      filename
    }
  } catch (error: any) {
    logger.error("Upload failed:", error)
    throw createError({
      statusCode: 500,
      message: error.message || "Upload failed"
    })
  }
})
