import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/category/$categoryId")({
  component: CategoryDetailPage,
})

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

interface Category {
  id: string
  name: string
  icon: string
  description: string
}

function CategoryDetailPage() {
  const { categoryId } = Route.useParams()
  const [scenes, setScenes] = useState<Scene[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/scenes")
      .then(res => res.json())
      .then(data => {
        const allScenes = data.scenes || []
        const allCategories = data.categories || []
        
        setCategory(allCategories.find((c: Category) => c.id === categoryId) || null)
        setScenes(allScenes.filter((s: Scene) => s.category === categoryId))
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load scenes:", err)
        setLoading(false)
      })
  }, [categoryId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <div className="text-xl text-gray-600 mb-4">未找到该分类</div>
          <Link to="/categories" className="text-blue-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/categories" className="text-blue-600 hover:underline">
            ← 返回分类
          </Link>
        </div>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600">
            {category.description}
          </p>
        </div>

        {/* Scenes Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenes.map(scene => (
              <Link
                key={scene.id}
                to="/scene/$sceneId"
                params={{ sceneId: scene.id }}
                className="block group"
              >
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="text-center">
                    <div className="text-5xl mb-4">{scene.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {scene.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {scene.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-lg font-bold text-blue-600">
                        {scene.pricing.display}{scene.pricing.unit}
                      </span>
                      <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                        开始使用 →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {scenes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-gray-600">该分类暂无可用场景</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
