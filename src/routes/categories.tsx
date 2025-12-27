import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
})

interface Category {
  id: string
  name: string
  icon: string
  description: string
}

interface Scene {
  id: string
  name: string
  description: string
  icon: string
  category: string
  pricing: {
    display: string
    unit: string
  }
}

interface CategoryWithScenes extends Category {
  scenes: Scene[]
  count: number
}

function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithScenes[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/scenes").then(res => res.json()),
    ]).then(([scenesData]) => {
      const scenes = scenesData.scenes || []
      const cats = scenesData.categories || []
      
      // 按分类组织场景
      const categoriesMap = new Map<string, CategoryWithScenes>()
      
      cats.forEach((cat: Category) => {
        categoriesMap.set(cat.id, {
          ...cat,
          scenes: [],
          count: 0
        })
      })
      
      scenes.forEach((scene: Scene) => {
        const cat = categoriesMap.get(scene.category)
        if (cat) {
          cat.scenes.push(scene)
          cat.count++
        }
      })
      
      setCategories(Array.from(categoriesMap.values()).filter(c => c.count > 0))
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Lovart PortraitOS
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI 图像处理操作系统
          </p>
          <p className="text-gray-500">
            20+ 场景，覆盖照片修复、电商设计、自媒体运营等领域
          </p>
        </div>

        {/* Categories Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <Link
                key={category.id}
                to="/category/$categoryId"
                params={{ categoryId: category.id }}
                className="block group"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {category.count} 个场景
                        </span>
                        <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                          探索 →
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Scene Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {category.scenes.slice(0, 3).map(scene => (
                        <span
                          key={scene.id}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {scene.icon} {scene.name}
                        </span>
                      ))}
                      {category.scenes.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{category.scenes.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🔥 热门场景
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.flatMap(c => c.scenes).slice(0, 8).map(scene => (
              <Link
                key={scene.id}
                to="/scene/$sceneId"
                params={{ sceneId: scene.id }}
                className="bg-white rounded-xl p-4 hover:shadow-lg transition-all text-center group"
              >
                <div className="text-3xl mb-2">{scene.icon}</div>
                <div className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                  {scene.name}
                </div>
                <div className="text-xs text-blue-600 font-bold">
                  {scene.pricing.display}{scene.pricing.unit}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
