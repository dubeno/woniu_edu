import type { Course } from '~/types/course'

interface PainPointsSectionProps {
  course: Course
}

export function PainPointsSection({ course }: PainPointsSectionProps) {
  if (!course.painPoints.length) return null

  return (
    <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
      <h2 className="text-xl font-bold text-gray-900">求职者常见痛点</h2>
      <p className="mt-1 text-sm text-gray-600">蜗牛AI 根据高频搜索与咨询整理 — 你的问题可能也在其中</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {course.painPoints.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm"
          >
            <span className="mt-0.5 text-indigo-500">?</span>
            {point}
          </li>
        ))}
      </ul>
      {course.seoKeywords.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {course.seoKeywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-500 ring-1 ring-gray-200"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
