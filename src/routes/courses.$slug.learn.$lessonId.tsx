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
      <div className="min-h-full bg-white px-4 py-16 text-center text-gray-500">
        资料不存在
        <div className="mt-4">
          <Link to="/courses" className="text-indigo-600 hover:underline">
            返回课程列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/courses/$slug"
          params={{ slug }}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← 返回课程
        </Link>
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <span className="rounded-md bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">免费资料</span>
          <MarkdownContent markdown={markdown} className="mt-6" />
        </div>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setConsultOpen(true)}
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
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
