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
      <div className="min-h-full bg-white px-4 py-16 text-center text-gray-500">
        文章不存在
        <div className="mt-4">
          <Link to="/blog" className="text-indigo-600 hover:underline">
            返回专栏
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd(post)) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/blog" className="text-sm text-indigo-600 hover:underline">
          ← 返回专栏
        </Link>

        <header className="mt-6 border-b border-gray-200 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
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
          <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900">
            {post.title}
          </h1>
          <p className="mt-3 text-base text-gray-600">{post.description}</p>
        </header>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <h2 className="text-sm font-semibold text-amber-900">求职者常见痛点</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-amber-900">
            {post.painPoints.map(p => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-0.5 text-amber-500">?</span>
                {p}
              </li>
            ))}
          </ul>
        </section>

        <article className="prose prose-slate mt-8 max-w-none prose-headings:text-gray-900 prose-a:text-indigo-600">
          <MarkdownContent markdown={markdown} />
        </article>

        <section className="mt-10 flex flex-wrap gap-2">
          {post.searchKeywords.map(k => (
            <span
              key={k}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
            >
              {k}
            </span>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-center">
          <h3 className="text-lg font-bold text-indigo-900">{post.cta.wechatTitle}</h3>
          <p className="mt-2 text-sm text-indigo-700">
            或先
            <Link
              to="/courses/$slug/learn/$lessonId"
              params={{ slug: post.cta.freeLessonSlug, lessonId: post.cta.freeLessonId }}
              className="ml-1 font-medium underline"
            >
              免费试读
            </Link>
            相关讲义
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              微信咨询
            </button>
            <Link
              to="/courses/$slug"
              params={{ slug: post.courseSlug }}
              className="rounded-full border border-indigo-600 px-6 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
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
