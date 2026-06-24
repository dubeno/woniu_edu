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
          className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
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
          className="w-full rounded-md bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          微信扫码咨询 · {formatCoursePrice(plan.price)}
        </button>
        <Link
          to="/courses/$slug/learn/$lessonId"
          params={{ slug: course.slug, lessonId: course.freeLessonId }}
          className="block w-full rounded-md border border-slate-300 py-3 text-center text-sm font-medium text-slate-900 transition hover:border-slate-400"
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
    <aside className="hidden rounded-2xl border border-slate-200 bg-white p-6 lg:block">
      <img
        src={course.coverImage}
        alt={course.title}
        className="mb-5 w-full rounded-xl object-cover"
      />
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
        What's included
      </h4>
      <ul className="mt-3 space-y-2">
        {course.includes.map(item => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
            <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-slate-100 pt-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900">
            {formatCoursePrice(plan.price)}
          </span>
          {plan.originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              {formatCoursePrice(plan.originalPrice)}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">扫码咨询报名 · 免费领取资料</p>
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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-4 lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xl font-semibold text-slate-900">{formatCoursePrice(plan.price)}</p>
          {plan.originalPrice && (
            <p className="text-sm text-slate-400 line-through">
              {formatCoursePrice(plan.originalPrice)}
            </p>
          )}
        </div>
        <PurchaseActions course={course} plan={plan} compact />
      </div>
    </div>
  )
}
