import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { testimonials } from "~/data/testimonials"

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

interface Category {
  id: string
  name: string
  icon: string
  description: string
}

function HomePage() {
  const navigate = useNavigate()
  const [scenes, setScenes] = useState<Scene[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch("/api/scenes")
      .then(res => res.json())
      .then(data => {
        setScenes(data.scenes || [])
        setCategories(data.categories || [])
      })
      .catch(err => console.error("Failed to load data:", err))
  }, [])

  const getScenesByCategory = (categoryId: string) => {
    return scenes.filter(s => s.category === categoryId)
  }

  return (
    <div className="h-full bg-white overflow-y-auto overflow-x-hidden">
      {/* Hero Section - 雷军式营销 */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b border-gray-100">
        {/* 装饰性背景元素 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* 主标题 - Wow. 重新定义影像创作 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight tracking-tight animate-fade-in" itemProp="headline">
              Wow.
              <br />
              <span className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 bg-clip-text text-transparent">重新定义影像创作</span>
            </h1>
            
            {/* 副标题 - 价值主张 */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4 font-medium" itemProp="description">
              10秒出图 · 4K输出 · 商业级品质
            </p>

            {/* 数字化卖点 - 雷军式数字展示 */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">10秒</div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">极速出图</div>
                <div className="mt-2 mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">4K</div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">超清输出</div>
                <div className="mt-2 mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">99%</div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">用户满意</div>
                <div className="mt-2 mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* CTA按钮 */}
            <button
              onClick={() => {
                const firstScene = scenes[0]
                if (firstScene) {
                  navigate({ to: "/scene/$sceneId", params: { sceneId: firstScene.id } })
                }
              }}
              className="px-8 sm:px-12 py-3.5 sm:py-4 bg-gray-900 hover:bg-gray-800 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              立即体验
            </button>
          </div>
        </div>
      </section>

      {/* 核心优势 - 雷军式对比展示 */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
            为什么选择 Wow？
          </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              专业级AI影像处理，让每一张照片都成为艺术品
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {/* 优势1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl hover:border-gray-300 transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-full h-full text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">极速处理</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                10秒出图，比传统修图快<span className="font-semibold text-gray-900">100倍</span>
              </p>
            </div>

            {/* 优势2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl hover:border-gray-300 transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-full h-full text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">商业级品质</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                4K超清输出，满足<span className="font-semibold text-gray-900">专业摄影</span>需求
              </p>
            </div>

            {/* 优势3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl hover:border-gray-300 transition-all sm:col-span-2 lg:col-span-1 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-full h-full text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">极致性价比</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                专业效果，<span className="font-semibold text-gray-900">1/10</span>的价格
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 用户故事与评价 - SEO优化 */}
      <section className="bg-white border-t border-gray-100 py-8 md:py-12 lg:py-16" itemScope itemType="https://schema.org/ItemList">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3" itemProp="name">
              用户故事与评价
            </h2>
            <p className="text-sm sm:text-base text-gray-600 px-4" itemProp="description">
              真实用户的使用体验，见证Wow如何改变他们的工作方式
            </p>
          </div>

          {/* 用户评价网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" itemScope itemType="https://schema.org/Review">
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all"
                itemScope
                itemType="https://schema.org/Review"
              >
                {/* 评分 */}
                <div className="flex items-center gap-1 mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                  <meta itemProp="bestRating" content="5" />
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* 评价内容 */}
                <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed" itemProp="reviewBody">
                  "{testimonial.content}"
                </p>

                {/* 用户信息 */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-medium text-sm">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <span itemProp="name">{testimonial.name}</span>
                    </div>
                    <div className="text-xs text-gray-500" itemProp="jobTitle">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                {/* 使用场景（隐藏，用于SEO） */}
                {testimonial.scene && (
                  <meta itemProp="itemReviewed" itemType="https://schema.org/Product" content={testimonial.scene} />
                )}
                <meta itemProp="datePublished" content={testimonial.date} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 产品场景 - 保留但简化展示 */}
      <section className="bg-gray-50 border-t border-gray-100 py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
              核心功能
            </h2>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              11个核心场景，覆盖电商、婚礼、自媒体三大垂直领域
            </p>
          </div>

          {/* 按分类展示所有场景 - 极简设计，无二级分类 */}
          <div className="space-y-12 md:space-y-16">
            {categories.map((category) => {
              const categoryScenes = getScenesByCategory(category.id)
              if (categoryScenes.length === 0) return null
              
              return (
                <div key={category.id} className="space-y-4 md:space-y-6">
                  {/* 分类标题 - 视觉分组，但不点击 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl md:text-3xl">{category.icon}</div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* 场景卡片网格 - 直接可点击 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {categoryScenes.map((scene) => (
                      <div
                        key={scene.id}
                        onClick={() => navigate({ to: "/scene/$sceneId", params: { sceneId: scene.id } })}
                        className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 transition-all cursor-pointer group"
                      >
                        <div className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {scene.icon}
                        </div>
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 group-hover:text-gray-700">
                          {scene.name}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                          {scene.description}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm md:text-base font-bold text-gray-900">
                            {scene.pricing.display}{scene.pricing.unit}
                          </span>
                          <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 用户价值主张 */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 text-center text-white max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3">
              让每一张照片，都值得被珍藏
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-4 md:mb-6 max-w-2xl mx-auto">
              无论是修复珍贵的回忆，还是创造惊艳的作品，Wow 让每一刻都成为 Wow 时刻
            </p>
            <button
              onClick={() => {
                const firstScene = scenes[0]
                if (firstScene) {
                  navigate({ to: "/scene/$sceneId", params: { sceneId: firstScene.id } })
                }
              }}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-gray-900 text-base sm:text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              免费开始体验
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 品牌信息 */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Wow.</h3>
              <p className="text-sm text-gray-400 mb-4">
                重新定义影像创作
              </p>
              <p className="text-xs text-gray-500">
                10秒出图 · 4K输出 · 商业级品质
              </p>
            </div>

            {/* 快速链接 */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => navigate({ to: "/" })}
                    className="hover:text-white transition-colors"
                  >
                    首页
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const firstScene = scenes[0]
                      if (firstScene) {
                        navigate({ to: "/scene/$sceneId", params: { sceneId: firstScene.id } })
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    开始使用
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate({ to: "/categories" })}
                    className="hover:text-white transition-colors"
                  >
                    所有场景
                  </button>
                </li>
              </ul>
            </div>

            {/* 联系信息 */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">关于我们</h4>
              <p className="text-sm text-gray-400 mb-2">
                专业的AI影像处理平台
              </p>
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Wow. All rights reserved.
              </p>
            </div>
          </div>

          {/* 底部版权 */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            <p>Powered by AI · Built with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
