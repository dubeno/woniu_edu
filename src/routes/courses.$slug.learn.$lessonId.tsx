import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense, use, useEffect, useState } from 'react'
import { getMarkdownLesson } from '~/content/courses'
import { getCourseBySlug } from '~/data/courses'
import { MarkdownContent } from '~/components/MarkdownContent'
import { trackEvent } from '~/lib/analytics'
import { WechatConsultModal } from '~/components/WechatConsultModal'
import { useSeo, courseJsonLd, breadcrumbJsonLd } from '~/lib/seo'

export const Route = createFileRoute('/courses/$slug/learn/$lessonId')({
  component: MarkdownLessonPage,
})

function MarkdownLessonPage() {
  const { slug, lessonId } = Route.useParams()
  const course = getCourseBySlug(slug)
  const [consultOpen, setConsultOpen] = useState(false)

  useEffect(() => {
    trackEvent({ type: 'free_resource_view', courseSlug: slug, lessonId })
  }, [slug, lessonId])

  useSeo(
    course
      ? {
          title: `${course.title} · 免费讲义 · 蜗牛AI`,
          description: `${course.title} 免费 Markdown 讲义 — AI 大厂求职实战内容，覆盖项目实战 / 简历项目段 / 模拟面试。`,
          keywords: [
            ...(course.seoKeywords ?? []),
            'AI 免费讲义',
            `${course.title} 课程`,
            'AI 求职 markdown',
          ],
          path: `/courses/${slug}/learn/${lessonId}`,
          type: 'article',
          jsonLd: [
            courseJsonLd({ ...course, price: course.plans[0]?.price ?? 0 }),
            breadcrumbJsonLd([
              { name: '蜗牛AI', path: '/' },
              { name: '课程目录', path: '/courses' },
              { name: course.title, path: `/courses/${slug}` },
              { name: '免费讲义', path: `/courses/${slug}/learn/${lessonId}` },
            ]),
          ],
        }
      : null,
  )

  if (!course) {
    return (
      <div className="min-h-full bg-[#0a0e1a] px-4 py-16 text-center font-mono text-xs text-slate-500">
        ! course_not_found
        <div className="mt-4">
          <Link to="/courses" className="text-emerald-400 underline underline-offset-4">
            $ cd /courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#0a0e1a] font-mono text-slate-200">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/courses/$slug"
          params={{ slug }}
          className="text-xs text-emerald-400 underline-offset-4 hover:underline"
        >
          $ cd /courses/{slug}
        </Link>

        <div className="mt-6 border border-emerald-500/20 bg-[#0d1220] p-6 sm:p-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400">
            // free_lesson
          </span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">
            {course.title}
          </h1>
          <div className="mt-6 border-t border-emerald-500/10 pt-6">
            <Suspense fallback={<LessonSkeleton />}>
              <LessonBody slug={slug} lessonId={lessonId} />
            </Suspense>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setConsultOpen(true)}
            className="border border-emerald-500 bg-emerald-500/15 px-8 py-3 text-xs text-emerald-300 transition hover:bg-emerald-500/25"
          >
            <span className="text-emerald-500">▶</span> 扫码咨询 · 领取完整版
          </button>
        </div>
      </div>

      <WechatConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        courseSlug={slug}
        courseTitle={course.title}
        trigger="free_resource"
      />
    </div>
  )
}

function LessonBody({ slug, lessonId }: { slug: string, lessonId: string }) {
  const markdown = use(getMarkdownLesson(slug, lessonId))
  if (!markdown) {
    return <p className="text-xs text-slate-500">! 资料不存在</p>
  }
  return <MarkdownContent markdown={markdown} />
}

function LessonSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-busy="true">
      <div className="h-3 w-3/4 bg-emerald-500/10" />
      <div className="h-3 w-full bg-emerald-500/10" />
      <div className="h-3 w-5/6 bg-emerald-500/10" />
      <div className="h-3 w-2/3 bg-emerald-500/10" />
    </div>
  )
}