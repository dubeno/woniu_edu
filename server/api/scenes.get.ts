// 获取所有可用场景配置
import { getEnabledScenes } from "../../shared/scene-config"

export default defineEventHandler(async (event) => {
  const scenes = getEnabledScenes()
  
  return {
    scenes: scenes.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      icon: s.icon,
      category: s.category,
      page: s.page,
      pricing: {
        display: s.pricing.display,
        unit: s.pricing.unit
      }
    })),
    total: scenes.length
  }
})







