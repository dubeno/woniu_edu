import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getMarkdownLesson } from '~/content/courses'
import { getCourseBySlug } from '~/data/courses'
import { MarkdownContent } from '~/components/MarkdownContent'
import { trackEvent } from '~/lib/analytics'
import { WechatConsultModal } from '~/components/WechatConsultModal'

export const Route = createFileRoute('/courses/$slug/learn/$lessonId')({
  component: MarkdownLessonPage,
})

function MarkdownLessonPage() {
  const { slug, lessonId } = Route.useParams()
  const course = getCourseBySlug(slug)
  const markdown = getMarkdownLesson(slug, lessonId)
  const [consultOpen, setConsultOpen] = useState(false)

  useEffect(() => {
    trackEvent({ type: 'free_resource_view', courseSlug: slug, lessonId })
  }, [slug, lessonId])

  if (!course || !markdown) {
    return (
      <div className="min-h-full bg-white px-4 py-16 text-center text-slate-500">
        资料不存在
        <div className="mt-4">
          <Link to="/courses" className="text-slate-900 underline underline-offset-4">
            返回课程列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/courses/$slug"
          params={{ slug }}
          className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
        >
          ← Back to course
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Free Lesson
          </span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {course.title}
          </h1>
          <div className="mt-6 border-t border-slate-100 pt-6">
            <MarkdownContent markdown={markdown} />
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setConsultOpen(true)}
            className="rounded-md bg-slate-900 px-8 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            扫码咨询 · 领取完整版
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
