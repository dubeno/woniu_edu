import { writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { randomUUID } from "uncrypto"
import { projectDir } from "@shared/dir"

// 本地存储配置
const UPLOAD_DIR = join(projectDir, "uploads")
const PHOTOS_DIR = join(UPLOAD_DIR, "photos")
const THUMBNAILS_DIR = join(UPLOAD_DIR, "thumbnails")

// 确保目录存在
export async function ensureUploadDirs() {
  try {
    await mkdir(PHOTOS_DIR, { recursive: true })
    await mkdir(THUMBNAILS_DIR, { recursive: true })
    logger.success("Upload directories created")
  } catch (error) {
    logger.error("Failed to create upload directories", error)
  }
}

// 保存上传的照片
export async function saveUploadedPhoto(file: File | Buffer, originalName?: string): Promise<{ url: string; filename: string }> {
  await ensureUploadDirs()
  
  const ext = originalName ? originalName.split(".").pop() : "jpg"
  const filename = `${randomUUID()}.${ext}`
  const filepath = join(PHOTOS_DIR, filename)
  
  let buffer: Buffer
  if (file instanceof Buffer) {
    buffer = file
  } else {
    buffer = Buffer.from(await file.arrayBuffer())
  }
  
  await writeFile(filepath, buffer)
  
  return {
    url: `/uploads/photos/${filename}`,
    filename,
  }
}

// 保存缩略图
export async function saveThumbnail(buffer: Buffer, originalFilename: string): Promise<string> {
  await ensureUploadDirs()
  
  const ext = originalFilename.split(".").pop()
  const filename = `thumb_${randomUUID()}.${ext}`
  const filepath = join(THUMBNAILS_DIR, filename)
  
  await writeFile(filepath, buffer)
  
  return `/uploads/thumbnails/${filename}`
}

// 获取本地文件路径
export function getLocalFilePath(url: string): string {
  if (url.startsWith("/uploads/")) {
    return join(projectDir, url)
  }
  return url
}

// 别名：getPhotoPath
export const getPhotoPath = getLocalFilePath

// 保存base64图片
export async function saveBase64Image(base64Data: string, prefix: string = "processed"): Promise<string> {
  await ensureUploadDirs()
  
  const buffer = Buffer.from(base64Data, "base64")
  const filename = `${prefix}_${randomUUID()}.jpg`
  const filepath = join(PHOTOS_DIR, filename)
  
  await writeFile(filepath, buffer)
  
  return `/uploads/photos/${filename}`
}
