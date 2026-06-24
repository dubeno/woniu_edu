import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Course, CoursePlan } from '~/types/course'
import { formatCoursePrice } from '~/config/brand'
import { WechatConsultModal } from '~/components/WechatConsultModal'

interface PurchaseActionsProps {
  course: Course
  plan: CoursePlan
  compact?: boolean
}

export function PurchaseActions({ course, plan, compact }: PurchaseActionsProps) {
  const [consultOpen, setConsultOpen] = useState(false)

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => setConsultOpen(true)}
          className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
        >
          微信咨询
        </button>
        <WechatConsultModal
          open={consultOpen}
          onClose={() => setConsultOpen(false)}
          courseSlug={course.slug}
          courseTitle={course.title}
          trigger="purchase"
        />
      </>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setConsultOpen(true)}
          className="w-full rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          微信扫码咨询
          {formatCoursePrice(plan.price)}
        </button>
        <Link
          to="/courses/$slug/learn/$lessonId"
          params={{ slug: course.slug, lessonId: course.freeLessonId }}
          className="block w-full rounded-full border border-indigo-600 py-3 text-center text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          免费领取 Markdown 讲义
        </Link>
      </div>
      <WechatConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        courseSlug={course.slug}
        courseTitle={course.title}
        trigger="purchase"
      />
    </>
  )
}

interface PurchaseCardProps {
  course: Course
}

export function PurchaseCard({ course }: PurchaseCardProps) {
  const plan = course.plans[0]!

  return (
    <aside className="hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:block">
      <img src={course.coverImage} alt={course.title} className="mb-4 w-full rounded-xl object-cover" />
      <h4 className="font-semibold text-gray-900">本课程包含：</h4>
      <ul className="mt-3 space-y-2">
        {course.includes.map(item => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-indigo-600">✓</span>
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-gray-100 pt-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{formatCoursePrice(plan.price)}</span>
          {plan.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatCoursePrice(plan.originalPrice)}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">扫码咨询报名 · 免费领取资料</p>
        <div className="mt-4">
          <PurchaseActions course={course} plan={plan} />
        </div>
      </div>
    </aside>
  )
}

export function MobilePurchaseBar({ course }: PurchaseCardProps) {
  const plan = course.plans[0]!

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-4 shadow-lg lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xl font-bold text-gray-900">{formatCoursePrice(plan.price)}</p>
          {plan.originalPrice && (
            <p className="text-sm text-gray-400 line-through">{formatCoursePrice(plan.originalPrice)}</p>
          )}
        </div>
        <PurchaseActions course={course} plan={plan} compact />
      </div>
    </div>
  )
}
