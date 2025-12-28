// 场景配置类型定义和加载器
import restorationScenes from './scenes/restoration.json'
import ecommerceScenes from './scenes/ecommerce.json'
import creativeScenes from './scenes/creative.json'
import socialMediaScenes from './scenes/social-media.json'
import lifeTravelScenes from './scenes/life-travel.json'
import commercialScenes from './scenes/commercial.json'
import weddingScenes from './scenes/wedding.json'

export interface SceneConfig {
  id: string
  name: string
  description: string
  category: string
  enabled: boolean
  icon: string
  
  page: {
    title: string
    subtitle: string
    features: string[]
    uploadText: string
    uploadHint?: string
    processingText: string
    comparisonLabels?: {
      before: string
      after: string
    }
    stats?: {
      processed: string
      rating: string
      speed: string
    }
    customFields?: {
      key: string
      label: string
      type: "text" | "textarea"
      required: boolean
      placeholder?: string
    }[]
  }
  
  ai: {
    model: string
    prompt?: string
    system_prompt?: string
    user_prompt_placeholder?: string
    prompt_merge_template?: string
    guidance_scale: number
    size: string
    watermark: boolean
    negative_prompt?: string
    supports_multiple_images?: boolean
  }
  
  pricing: {
    base_price: number  // 以分为单位
    currency: string
    display: string
    unit: string
    discount?: {
      type: 'percentage' | 'fixed'
      value: number
      until: string
    } | null
  }
  
  business?: {
    cost_per_call: number  // 以分为单位
    target_margin: number  // 百分比
    estimated_time: string
  }
}

export interface CategoryConfig {
  id: string
  name: string
  icon: string
  description: string
}

export interface ScenesData {
  scenes: SceneConfig[]
  meta: {
    version: string
    last_updated: string
    default_scene: string
  }
  categories?: CategoryConfig[]
}

// 合并所有场景
const allScenes = [
  ...restorationScenes,
  ...ecommerceScenes,
  ...creativeScenes,
  ...socialMediaScenes,
  ...lifeTravelScenes,
  ...commercialScenes,
  ...weddingScenes
] as unknown as SceneConfig[]

const categories: CategoryConfig[] = [
  { id: "ecommerce", name: "电商设计", icon: "🛍️", description: "详情页、换装、海报设计" },
  { id: "wedding", name: "婚礼系列", icon: "💒", description: "官宣海报、迎宾海报设计" },
  { id: "social-media", name: "自媒体运营", icon: "📱", description: "封面、海报、IP设计" },
  { id: "creative", name: "实用工具", icon: "✨", description: "智能消除、完美合影" }
]

const scenes: ScenesData = {
  scenes: allScenes,
  meta: {
    version: "2.3.0",
    last_updated: "2025-12-07",
    default_scene: "old-photo-restoration"
  },
  categories: categories
}

/**
 * 获取所有场景配置
 */
export function getAllScenes(): SceneConfig[] {
  return scenes.scenes
}

/**
 * 获取所有分类
 */
export function getAllCategories(): CategoryConfig[] {
  return scenes.categories || []
}

/**
 * 获取所有已启用的场景
 */
export function getEnabledScenes(): SceneConfig[] {
  return scenes.scenes.filter(s => s.enabled)
}

/**
 * 根据ID获取场景配置
 */
export function getSceneById(id: string): SceneConfig | null {
  return scenes.scenes.find(s => s.id === id) || null
}

/**
 * 获取默认场景
 */
export function getDefaultScene(): SceneConfig {
  const defaultId = scenes.meta.default_scene
  const scene = getSceneById(defaultId)
  if (!scene) {
    throw new Error(`Default scene "${defaultId}" not found`)
  }
  return scene
}

/**
 * 根据分类获取场景
 */
export function getScenesByCategory(category: string): SceneConfig[] {
  return scenes.scenes.filter(s => s.category === category)
}

/**
 * 验证场景是否可用
 */
export function isSceneAvailable(id: string): boolean {
  const scene = getSceneById(id)
  return scene !== null && scene.enabled
}

/**
 * 获取场景的AI配置
 */
export function getSceneAIConfig(id: string) {
  const scene = getSceneById(id)
  if (!scene) {
    throw new Error(`Scene "${id}" not found`)
  }
  return scene.ai
}

/**
 * 获取场景的定价配置
 */
export function getScenePricing(id: string) {
  const scene = getSceneById(id)
  if (!scene) {
    throw new Error(`Scene "${id}" not found`)
  }
  return scene.pricing
}

/**
 * 计算实际价格（考虑折扣）
 */
export function calculatePrice(sceneId: string): number {
  const pricing = getScenePricing(sceneId)
  let price = pricing.base_price
  
  if (pricing.discount) {
    const now = new Date()
    const until = new Date(pricing.discount.until)
    
    if (now < until) {
      if (pricing.discount.type === 'percentage') {
        price = Math.floor(price * (100 - pricing.discount.value) / 100)
      } else {
        price = price - pricing.discount.value
      }
    }
  }
  
  return price
}

export default scenes
