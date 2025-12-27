import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/")({
  component: HomePage,
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

function HomePage() {
  const navigate = useNavigate()
  const [scenes, setScenes] = useState<Scene[]>([])

  useEffect(() => {
    fetch("/api/scenes")
      .then(res => res.json())
      .then(data => {
        setScenes(data.scenes || [])
      })
      .catch(err => console.error("Failed to load data:", err))
  }, [])

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            DuckFish AI 影像工作台
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto">
            AI影像，如鱼得水
          </p>
          <button
            onClick={() => {
              const firstScene = scenes[0]
              if (firstScene) {
                navigate({ to: "/scene/$sceneId", params: { sceneId: firstScene.id } })
              }
            }}
            className="px-10 py-4 bg-gray-900 text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            免费开始
          </button>
        </div>
      </div>
    </div>
  )
}
