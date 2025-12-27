import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/blog/$postId")({
  component: BlogPostPage,
})

function BlogPostPage() {
  const { postId } = Route.useParams()
  
  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          ← 返回博客
        </Link>
        
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">
                教程
              </span>
              <span className="text-sm text-gray-500">5 分钟阅读</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              如何使用 DuckFish 修复老照片：完整指南
            </h1>
            <div className="text-sm text-gray-500">
              发布于 2025-01-15
            </div>
          </header>

          <div className="h-64 bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg mb-8 flex items-center justify-center">
            <span className="text-6xl">📸</span>
          </div>

          <div className="text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed">
              老照片承载着珍贵的回忆，但时间的流逝让它们变得模糊、褪色。DuckFish AI 影像处理平台
              可以帮助您轻松修复这些珍贵的照片，让回忆重现光彩。
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">第一步：上传照片</h2>
            <p>
              打开 DuckFish 工作台，选择"老照片修复"场景。点击上传区域，选择您要修复的老照片。
              支持 JPG、PNG、WEBP 等常见格式。
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">第二步：AI 智能处理</h2>
            <p>
              DuckFish 集成的 Seedream 4.5 旗舰模型会自动分析照片，识别需要修复的区域，
              包括去噪、去模糊、色彩还原、细节增强等。
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">第三步：查看结果</h2>
            <p>
              处理完成后，您可以在预览区查看修复效果。DuckFish 提供 4K 商业级输出，
              确保照片质量达到专业标准。
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">专业技巧</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>上传清晰度尽可能高的原始照片</li>
              <li>对于严重损坏的照片，可以尝试多次处理</li>
              <li>使用高级设置调整处理参数，获得最佳效果</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">开始使用 DuckFish</h3>
              <p className="text-gray-700 mb-4">
                立即体验 DuckFish AI 影像处理平台，让您的照片重现光彩。
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                免费开始使用
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
