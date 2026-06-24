import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getBlogMarkdown, blogPostBySlug } from '~/data/blog'
import { useBlogSeo, blogJsonLd } from '~/lib/seo'
import { MarkdownContent } from '~/components/MarkdownContent'
import { WechatConsultModal } from '~/components/WechatConsultModal'
import { trackEvent } from '~/lib/analytics'

export const Route = createFileRoute('/blog/$postId')({
  component: BlogPostPage,
})

function BlogPostPage() {
  const { postId } = Route.useParams()
  const post = blogPostBySlug[postId]
  const markdown = post ? getBlogMarkdown(post) : ''
  const [consultOpen, setConsultOpen] = useState(false)

  useEffect(() => {
    if (!post) return
    trackEvent({
      type: 'blog_post_view',
      postSlug: post.slug,
      courseSlug: post.courseSlug,
    })
  }, [post])

  useBlogSeo(
    post
      ? {
          title: post.title,
          description: post.description,
          keywords: post.searchKeywords,
          path: `/blog/${post.slug}`,
        }
      : null,
  )

  if (!post) {
    return (
      <div className="min-h-full bg-white px-4 py-16 text-center text-slate-500">
        文章不存在
        <div className="mt-4">
          <Link to="/blog" className="text-slate-900 underline underline-offset-4">
            返回专栏
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd(post)) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/blog" className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline">
          ← Back to career notes
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
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
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{post.description}</p>
        </header>

        <section className="mt-6 border-l-2 border-slate-900 bg-slate-50 p-5">
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-slate-700">
            Job-seeker pain points
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-800">
            {post.painPoints.map(p => (
              <li key={p} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                {p}
              </li>
            ))}
          </ul>
        </section>

        <article className="prose prose-slate mt-8 max-w-none prose-headings:text-slate-900 prose-a:text-slate-900 prose-a:underline prose-a:underline-offset-4">
          <MarkdownContent markdown={markdown} />
        </article>

        <section className="mt-10 flex flex-wrap gap-2">
          {post.searchKeywords.map(k => (
            <span
              key={k}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
            >
              {k}
            </span>
          ))}
        </section>

        <section className="mt-12 border-t border-slate-900 pt-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900">{post.cta.wechatTitle}</h3>
          <p className="mt-2 text-sm text-slate-600">
            或先
            <Link
              to="/courses/$slug/learn/$lessonId"
              params={{ slug: post.cta.freeLessonSlug, lessonId: post.cta.freeLessonId }}
              className="ml-1 font-medium text-slate-900 underline underline-offset-4"
            >
              免费试读
            </Link>
            相关讲义
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="rounded-md bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              微信咨询
            </button>
            <Link
              to="/courses/$slug"
              params={{ slug: post.courseSlug }}
              className="rounded-md border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-900 hover:border-slate-400"
            >
              查看完整课程
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
