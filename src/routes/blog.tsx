import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/blog")({
  component: BlogPage,
})

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  image?: string
}

// 示例博客文章数据
const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "如何使用 DuckFish 修复老照片：完整指南",
    excerpt: "详细教程：从上传到修复，一步步教你使用 DuckFish AI 修复珍贵的老照片，让回忆重现光彩。",
    category: "教程",
    date: "2025-01-15",
    readTime: "5 分钟",
  },
  {
    id: "2",
    title: "AI 人像精修完整指南：从入门到精通",
    excerpt: "掌握 AI 人像精修的核心技巧，了解如何利用 Seedream 4.5 模型实现专业级人像处理效果。",
    category: "教程",
    date: "2025-01-12",
    readTime: "8 分钟",
  },
  {
    id: "3",
    title: "影楼如何用 DuckFish 提升 300% 工作效率",
    excerpt: "真实案例分享：某知名影楼通过 DuckFish AI 影像处理平台，大幅提升工作效率和客户满意度。",
    category: "案例",
    date: "2025-01-10",
    readTime: "6 分钟",
  },
  {
    id: "4",
    title: "2025 年 AI 影像处理行业趋势分析",
    excerpt: "深度分析 AI 影像处理行业的发展趋势，探讨技术革新对商业影像处理的影响。",
    category: "行业",
    date: "2025-01-08",
    readTime: "10 分钟",
  },
  {
    id: "5",
    title: "电商卖家必看：AI 图片优化提升转化率 40%",
    excerpt: "电商卖家如何利用 AI 图片处理工具优化商品图，提升店铺转化率和销售额。",
    category: "案例",
    date: "2025-01-05",
    readTime: "7 分钟",
  },
]

function BlogPage() {
  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DuckFish 博客</h1>
          <p className="text-gray-600">
            AI 影像处理教程、行业案例、技术深度文章
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg">
            全部
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
            教程
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
            案例
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
            行业
          </button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map(post => (
            <Link
              key={post.id}
              to="/blog/$postId"
              params={{ postId: post.id }}
              className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 hover:shadow-md transition-all group"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="text-xs text-gray-500">{post.date}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO Content Section */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">关于 DuckFish</h2>
          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="mb-4">
              <strong>DuckFish (DF)</strong> 是专业的 AI 影像处理平台，致力于让 AI 影像处理如鱼得水般自然流畅。
              我们集成 <strong>Seedream 4.5 旗舰模型</strong>，提供 <strong>4K 商业级输出</strong>和<strong>影楼级工作流</strong>。
            </p>
            <p className="mb-4">
              我们的核心优势包括：
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>极速处理</strong>：秒级处理，无需等待</li>
              <li><strong>专业品质</strong>：4K 输出，商业级标准</li>
              <li><strong>AI 智能</strong>：Seedream 4.5 旗舰模型，智能优化</li>
              <li><strong>极简设计</strong>：零学习成本，一键生成</li>
              <li><strong>超低成本</strong>：成本仅为竞品 2%</li>
            </ul>
            <p>
              无论您是<strong>影楼摄影师</strong>、<strong>电商卖家</strong>、<strong>设计师</strong>还是<strong>内容创作者</strong>，
              DuckFish 都能帮助您快速完成专业级的 AI 影像处理工作。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
