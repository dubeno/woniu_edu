import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense, use, useEffect, useState } from 'react'
import { blogPostBySlug, type BlogPost } from '~/data/blog'
import { getBlogMarkdown } from '~/data/blog/markdown'
import { useSeo, articleJsonLd, faqJsonLd, breadcrumbJsonLd } from '~/lib/seo'
import { MarkdownContent } from '~/components/MarkdownContent'
import { WechatConsultModal } from '~/components/WechatConsultModal'
import { trackEvent } from '~/lib/analytics'

export const Route = createFileRoute('/blog/$postId')({
  component: BlogPostPage,
})

function BlogPostPage() {
  const { postId } = Route.useParams()
  const post = blogPostBySlug[postId]
  const [consultOpen, setConsultOpen] = useState(false)

  useEffect(() => {
    if (!post) return
    trackEvent({
      type: 'blog_post_view',
      postSlug: post.slug,
      courseSlug: post.courseSlug,
    })
  }, [post])

  useSeo(
    post
      ? {
          title: `${post.title} · AI 求职经验 · 蜗牛AI`,
          description: post.description,
          keywords: post.searchKeywords,
          path: `/blog/${post.slug}`,
          type: 'article',
          publishedTime: post.publishedAt,
          modifiedTime: post.publishedAt,
          jsonLd: [
            articleJsonLd(post),
            faqJsonLd(post.painPoints.map(p => ({
              question: p,
              answer: `本文针对「${p}」给出解法与对应免费讲义。详见蜗牛AI 求职专栏 https://woniu-ai.dev/blog/${post.slug}`,
            }))),
            breadcrumbJsonLd([
              { name: '蜗牛AI', path: '/' },
              { name: '求职专栏', path: '/blog' },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ],
        }
      : null,
  )

  if (!post) {
    return (
      <div className="min-h-full bg-[#0a0e1a] px-4 py-16 text-center font-mono text-xs text-slate-500">
        ! post_not_found
        <div className="mt-4">
          <Link to="/blog" className="text-emerald-400 underline underline-offset-4">
            $ cd /blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#0a0e1a] font-mono text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/blog" className="text-xs text-emerald-400 underline-offset-4 hover:underline">
          $ cd /blog
        </Link>

        <header className="mt-6 border-b border-emerald-500/20 pb-6">
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
            <span className="text-emerald-400">{post.category}</span>
            <span className="text-slate-700">·</span>
            <span>{post.readMinutes} min</span>
            <span className="text-slate-700">·</span>
            <time>{post.publishedAt}</time>
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{post.description}</p>
        </header>

        <section className="mt-6 border border-emerald-500/30 bg-[#0d1220] p-5">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.3em] text-emerald-400">
            // job_seeker_pain_points
          </h2>
          <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-300">
            {post.painPoints.map(p => (
              <li key={p} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-emerald-500/70" />
                {p}
              </li>
            ))}
          </ul>
        </section>

        <article className="mt-8">
          <Suspense fallback={<ArticleSkeleton />}>
            <ArticleBody post={post} />
          </Suspense>
        </article>

        <section className="mt-10 flex flex-wrap gap-2">
          {post.searchKeywords.map(k => (
            <span
              key={k}
              className="border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-300"
            >
              {k}
            </span>
          ))}
        </section>

        <section className="mt-12 border-t border-emerald-500/20 pt-8 text-center">
          <h3 className="text-lg font-semibold text-slate-100">{post.cta.wechatTitle}</h3>
          <p className="mt-2 text-xs text-slate-400">
            <span className="text-slate-500">$</span> 或先{" "}
            <Link
              to="/courses/$slug/learn/$lessonId"
              params={{ slug: post.cta.freeLessonSlug, lessonId: post.cta.freeLessonId }}
              className="font-medium text-emerald-400 underline underline-offset-4"
            >
              ./read-free-lesson
            </Link>{" "}
            相关讲义
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="border border-emerald-500 bg-emerald-500/15 px-6 py-2.5 text-xs text-emerald-300 transition hover:bg-emerald-500/25"
            >
              <span className="text-emerald-500">▶</span> 微信咨询
            </button>
            <Link
              to="/courses/$slug"
              params={{ slug: post.courseSlug }}
              className="border border-slate-700 px-6 py-2.5 text-xs text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-400"
            >
              <span className="text-slate-500">$</span> view-course
            </Link>
          </div>
        </section>
      </div>

      <WechatConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        courseSlug={post.cta.freeLessonSlug}
        courseTitle={post.cta.wechatTitle}
        trigger="free_resource"
      />
    </div>
  )
}

function ArticleBody({ post }: { post: BlogPost }) {
  const markdown = use(getBlogMarkdown(post))
  return <MarkdownContent markdown={markdown} />
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-busy="true">
      <div className="h-5 w-full rounded bg-slate-200" />
      <div className="h-5 w-11/12 rounded bg-slate-200" />
      <div className="h-5 w-3/4 rounded bg-slate-200" />
      <div className="h-5 w-5/6 rounded bg-slate-200" />
      <div className="h-5 w-2/3 rounded bg-slate-200" />
    </div>
  )
}