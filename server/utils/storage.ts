import { writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { randomUUID } from "uncrypto"
import { projectDir } from "@shared/dir"
import process from "node:process"

// 检查是否在 Cloudflare Pages 环境
const isCloudflarePages = process.env.CF_PAGES === "1" || typeof process.env.CF_PAGES !== "undefined"

// 本地存储配置
const UPLOAD_DIR = join(projectDir, "uploads")
const PHOTOS_DIR = join(UPLOAD_DIR, "photos")
const THUMBNAILS_DIR = join(UPLOAD_DIR, "thumbnails")

// 确保目录存在
export async function ensureUploadDirs() {
  // Cloudflare Pages 环境不支持文件系统操作
  if (isCloudflarePages) {
    return
  }
  
  try {
    await mkdir(PHOTOS_DIR, { recursive: true })
    await mkdir(THUMBNAILS_DIR, { recursive: true })
    logger.success("Upload directories created")
  } catch (error) {
    logger.error("Failed to create upload directories", error)
  }
}

// 保存上传的照片
export async function saveUploadedPhoto(file: File | Buffer, originalName?: string): Promise<{ url: string; filename: string; localPath?: string }> {
  let buffer: Buffer
  if (file instanceof Buffer) {
    buffer = file
  } else if (file instanceof File) {
    buffer = Buffer.from(await file.arrayBuffer())
  } else {
    buffer = file as Buffer
  }

  const ext = originalName ? originalName.split(".").pop() : "jpg"
  const filename = `${randomUUID()}.${ext}`


  // Cloudflare Pages 环境不支持文件系统操作
  if (isCloudflarePages) {
    // 在 Cloudflare Pages 环境下，不存储任何数据到数据库的 original_url 字段
    // 因为处理时直接从 File 对象读取，不需要从数据库读取，只需要存储结果
    return {
      url: "", // 返回空字符串，不存储任何数据到数据库
      filename,
    }
  }
  
  // 本地文件系统存储
  await ensureUploadDirs()
  const filepath = join(PHOTOS_DIR, filename)
  await writeFile(filepath, buffer)
  
  return {
    url: `/uploads/photos/${filename}`,
    filename,
  }
}

// 保存缩略图
export async function saveThumbnail(buffer: Buffer, originalFilename: string): Promise<string> {
  // Cloudflare Pages 环境不支持文件系统操作
  if (isCloudflarePages) {
    // 转换为 base64 data URL
    const base64 = buffer.toString("base64")
    const mimeType = originalFilename.endsWith(".png") ? "image/png" : "image/jpeg"
    return `data:${mimeType};base64,${base64}`
  }
  
  await ensureUploadDirs()
  
  const ext = originalFilename.split(".").pop()
  const filename = `thumb_${randomUUID()}.${ext}`
  const filepath = join(THUMBNAILS_DIR, filename)
  
  await writeFile(filepath, buffer)
  
  return `/uploads/thumbnails/${filename}`
}

// 获取本地文件路径
export function getLocalFilePath(url: string): string {
  // 如果是 data URL 或标识符格式，直接返回（Cloudflare Pages 环境）
  if (url.startsWith("data:") || url.startsWith("uploaded:") || url.startsWith("processed:")) {
    return url
  }
  // 如果是 TOS URL（以 https:// 开头且包含 tos），直接返回
  if (url.startsWith("https://") && url.includes("tos")) {
    return url
  }
  // 本地文件路径
  if (url.startsWith("/uploads/")) {
    return join(projectDir, url)
  }
  return url
}

// 别名：getPhotoPath
export const getPhotoPath = getLocalFilePath

// 保存base64图片
export async function saveBase64Image(base64Data: string, prefix: string = "processed"): Promise<{ url: string; localPath?: string }> {
  const buffer = Buffer.from(base64Data, "base64")
  const filename = `${prefix}_${randomUUID()}.jpg`

  // Cloudflare Pages 环境下返回标识符（不存储文件，只保存短标识，防止数据过大）
  if (isCloudflarePages) {
    return `processed:${filename}`
  }
  // 本地文件系统存储（非 Cloudflare Pages 环境）
  await ensureUploadDirs()
  const filepath = join(PHOTOS_DIR, filename)
  await writeFile(filepath, buffer)
  return {
    url: `/uploads/photos/${filename}`,
    filename,
    localPath: filepath
  }
}
