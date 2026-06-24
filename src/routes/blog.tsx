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
    document.title = '求职专栏 · 蜗牛AI · FDE · AI Infra · Agent'
  }, [])

  useBlogSeo({
    title: '求职专栏 · 蜗牛AI · AI Engineer Career Notes',
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
    <div className="min-h-full bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Career Notes
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            求职专栏
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            常被搜的 AI 求职问题 + 痛点 + 解法 + 课程入口 — 每篇对应一个高频搜索词。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="uppercase tracking-wider">Topics</span>
          {categories.map(c => (
            <span
              key={c}
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-600"
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
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-slate-400"
            >
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-medium uppercase tracking-wider text-slate-700">
                  {post.category}
                </span>
                <span aria-hidden>·</span>
                <span>
                  {post.readMinutes}
                  {' '}
                  min read
                </span>
                <span aria-hidden>·</span>
                <time>{post.publishedAt}</time>
              </div>

              <h2 className="mt-4 text-lg font-semibold leading-snug text-slate-900 group-hover:underline">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                {post.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 4).map(t => (
                  <span
                    key={t}
                    className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-600"
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
