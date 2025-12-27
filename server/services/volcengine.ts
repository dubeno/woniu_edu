import process from "node:process"
import { readFile } from "node:fs/promises"
import { getPhotoPath } from "#/utils/storage"

const VOLCENGINE_API_KEY = process.env.VOLCENGINE_API_KEY
const VOLCENGINE_BASE_URL = process.env.VOLCENGINE_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3"

interface FaceDetectionResult {
  face_detected: boolean
  face_count: number
  faces?: Array<{
    bbox: [number, number, number, number]
    confidence: number
  }>
}

interface ImageProcessResult {
  success: boolean
  processed_url?: string
  error?: string
}

/**
 * 人脸检测（使用火山方舟 Vision API）
 */
export async function detectFaces(imageUrl: string): Promise<FaceDetectionResult> {
  try {
    // 读取图片文件并转换为 base64
    const imagePath = getPhotoPath(imageUrl)
    const imageBuffer = await readFile(imagePath)
    const base64Image = imageBuffer.toString("base64")

    // 调用火山方舟人脸检测 API
    const response = await fetch(`${VOLCENGINE_BASE_URL}/vision/face/detect`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VOLCENGINE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${base64Image}`,
      }),
    })

    if (!response.ok) {
      throw new Error(`Face detection failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      face_detected: data.faces && data.faces.length > 0,
      face_count: data.faces?.length || 0,
      faces: data.faces,
    }
  } catch (error: any) {
    logger.error("Face detection error:", error)
    return {
      face_detected: false,
      face_count: 0,
    }
  }
}

/**
 * 背景替换（使用火山方舟 Seedream API）
 */
export async function replaceBackground(
  imageUrl: string,
  backgroundColor: string = "#FFFFFF",
): Promise<ImageProcessResult> {
  try {
    const imagePath = getPhotoPath(imageUrl)
    const imageBuffer = await readFile(imagePath)
    const base64Image = imageBuffer.toString("base64")

    const response = await fetch(`${VOLCENGINE_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VOLCENGINE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "doubao-seedream-4.0",
        prompt: `Professional portrait photo with solid ${backgroundColor} background, high quality, studio lighting`,
        image: `data:image/jpeg;base64,${base64Image}`,
        n: 1,
        size: "1024x1024",
      }),
    })

    if (!response.ok) {
      throw new Error(`Background replacement failed: ${response.statusText}`)
    }

    const data = await response.json()
    const processedImage = data.data?.[0]?.b64_json || data.data?.[0]?.url

    if (!processedImage) {
      throw new Error("No processed image returned")
    }

    return {
      success: true,
      processed_url: processedImage,
    }
  } catch (error: any) {
    logger.error("Background replacement error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * 人像美化（磨皮、美白、提亮）
 */
export async function enhancePortrait(imageUrl: string): Promise<ImageProcessResult> {
  try {
    const imagePath = getPhotoPath(imageUrl)
    const imageBuffer = await readFile(imagePath)
    const base64Image = imageBuffer.toString("base64")

    const response = await fetch(`${VOLCENGINE_BASE_URL}/images/edits`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VOLCENGINE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "doubao-seededit-3.0",
        image: `data:image/jpeg;base64,${base64Image}`,
        prompt: "Enhance portrait: smooth skin, brighten eyes, whiten teeth, natural beauty, professional photo quality",
        n: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`Portrait enhancement failed: ${response.statusText}`)
    }

    const data = await response.json()
    const processedImage = data.data?.[0]?.b64_json || data.data?.[0]?.url

    if (!processedImage) {
      throw new Error("No processed image returned")
    }

    return {
      success: true,
      processed_url: processedImage,
    }
  } catch (error: any) {
    logger.error("Portrait enhancement error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * 老照片修复
 */
export async function restoreOldPhoto(imageUrl: string): Promise<ImageProcessResult> {
  try {
    const imagePath = getPhotoPath(imageUrl)
    const imageBuffer = await readFile(imagePath)
    const base64Image = imageBuffer.toString("base64")

    const response = await fetch(`${VOLCENGINE_BASE_URL}/images/edits`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VOLCENGINE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "doubao-seededit-3.0",
        image: `data:image/jpeg;base64,${base64Image}`,
        prompt: "Restore old photo: remove scratches, enhance clarity, fix colors, repair damages, high quality restoration",
        n: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`Photo restoration failed: ${response.statusText}`)
    }

    const data = await response.json()
    const processedImage = data.data?.[0]?.b64_json || data.data?.[0]?.url

    if (!processedImage) {
      throw new Error("No processed image returned")
    }

    return {
      success: true,
      processed_url: processedImage,
    }
  } catch (error: any) {
    logger.error("Photo restoration error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * 黑白照上色
 */
export async function colorizePhoto(imageUrl: string): Promise<ImageProcessResult> {
  try {
    const imagePath = getPhotoPath(imageUrl)
    const imageBuffer = await readFile(imagePath)
    const base64Image = imageBuffer.toString("base64")

    const response = await fetch(`${VOLCENGINE_BASE_URL}/images/edits`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VOLCENGINE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "doubao-seededit-3.0",
        image: `data:image/jpeg;base64,${base64Image}`,
        prompt: "Colorize black and white photo: add natural realistic colors, maintain original quality, professional colorization",
        n: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`Photo colorization failed: ${response.statusText}`)
    }

    const data = await response.json()
    const processedImage = data.data?.[0]?.b64_json || data.data?.[0]?.url

    if (!processedImage) {
      throw new Error("No processed image returned")
    }

    return {
      success: true,
      processed_url: processedImage,
    }
  } catch (error: any) {
    logger.error("Photo colorization error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

