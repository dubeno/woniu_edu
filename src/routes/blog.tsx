import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { blogPosts } from '~/data/blog'
import { useSeo, KEYWORDS, articleJsonLd, breadcrumbJsonLd } from '~/lib/seo'
import { trackEvent } from '~/lib/analytics'

export const Route = createFileRoute('/blog')({
  component: BlogListPage,
})

function BlogListPage() {
  useEffect(() => {
    document.title = '求职专栏 · 蜗牛AI · FDE · AI Infra · Agent'
  }, [])

  useSeo({
    title: 'AI 求职专栏 · 面经 · 简历 · 系统设计 · 模拟面试 · 蜗牛AI',
    description:
      '蜗牛AI 求职专栏：覆盖 2026 AI 工程师面试、FDE 面经、AI Infra 推理优化、AI Agent 工程师、AI 系统设计、AI 简历模板等高频话题，每篇对应一个真实 AI 求职搜索词。',
    keywords: KEYWORDS.blog,
    path: '/blog',
    type: 'article',
    jsonLd: [
      articleJsonLd(blogPosts[0] ?? {
        slug: 'index',
        title: 'AI 求职专栏',
        description: 'AI 求职经验、面经、简历、面试、模拟面试',
        category: 'AI 求职',
        tags: [],
        painPoints: [],
        searchKeywords: [],
        cta: { freeLessonSlug: '', freeLessonId: '', wechatTitle: '' },
        courseSlug: '',
        publishedAt: new Date().toISOString(),
        readMinutes: 0,
        markdownFile: '',
      }),
      breadcrumbJsonLd([
        { name: '蜗牛AI', path: '/' },
        { name: '求职专栏', path: '/blog' },
      ]),
    ],
  })

  useEffect(() => {
    trackEvent({ type: 'blog_list_view', count: blogPosts.length })
  }, [])

  const categories = Array.from(new Set(blogPosts.map(p => p.category)))

  return (
    <div className="relative bg-[#07060a] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <div className="relative">
        <section className="px-4 pb-16 pt-20 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">Career Notes</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              求职专栏
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-white/55 sm:text-base">
              高频 AI 求职问题 · 痛点 · 解法 · 课程入口 — 每篇对应一个搜索词。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2 text-xs">
            {categories.map(c => (
              <span
                key={c}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-white/60"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {blogPosts.map(post => (
              <Link
                key={post.slug}
                to="/blog/$postId"
                params={{ postId: post.slug }}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-violet-400/40 hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
                  <span className="text-violet-300/80">{post.category}</span>
                  <span className="text-white/20">·</span>
                  <span>{post.readMinutes} min</span>
                  <span className="text-white/20">·</span>
                  <time>{post.publishedAt}</time>
                </div>

                <h2 className="mt-4 text-lg font-semibold leading-snug transition group-hover:text-violet-200">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/55">
                  {post.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 4).map(t => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/50"
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
    </div>
  )
}