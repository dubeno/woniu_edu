import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { blogPosts } from '~/data/blog'
import { useBlogSeo } from '~/lib/seo'
import { trackEvent } from '~/lib/analytics'

export const Route = createFileRoute('/blog')({
  component: BlogListPage,
})

function BlogListPage() {
  useEffect(() => {
    document.title = '蜗牛AI 求职专栏 · FDE · AI Infra · Agent'
  }, [])

  useBlogSeo({
    title: '蜗牛AI 求职专栏 · AI 工程师面试 · FDE · 推理优化 · Agent',
    description:
      '蜗牛AI 求职专栏：覆盖 2026 AI 工程师面试、FDE 求职、LLM 推理优化、AI Agent 工程师等高频话题。',
    keywords: [
      'AI 求职',
      'AI 工程师面试',
      'FDE',
      'AI Infra',
      'AI Agent',
      'OpenAI 面试',
      'Anthropic 面试',
      '北美 AI 求职',
      '转码 AI',
    ],
    path: '/blog',
  })

  useEffect(() => {
    trackEvent({ type: 'blog_list_view', count: blogPosts.length })
  }, [])

  const categories = Array.from(new Set(blogPosts.map(p => p.category)))

  return (
    <div className="min-h-full bg-white">
      <section className="bg-gradient-to-b from-indigo-50 via-white to-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center">
          <p className="text-sm font-medium tracking-wider text-indigo-600">蜗牛AI · 求职专栏</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            AI 求职痛点 · 高频话题
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            每篇 = 一个常被搜的 AI 求职问题 + 痛点 + 解法 + 课程入口
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(c => (
            <span
              key={c}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {blogPosts.map(post => (
            <Link
              key={post.slug}
              to="/blog/$postId"
              params={{ postId: post.slug }}
              className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                  {post.category}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">
                  {post.readMinutes}
                  {' '}
                  分钟阅读
                </span>
                <span className="text-gray-400">·</span>
                <time className="text-gray-500">{post.publishedAt}</time>
              </div>

              <h2 className="mt-3 text-lg font-semibold leading-snug text-gray-900 group-hover:text-indigo-600">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 4).map(t => (
                  <span
                    key={t}
                    className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
