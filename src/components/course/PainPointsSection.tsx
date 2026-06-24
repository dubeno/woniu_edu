import type { Course } from '~/types/course'

interface PainPointsSectionProps {
  course: Course
}

export function PainPointsSection({ course }: PainPointsSectionProps) {
  if (!course.painPoints.length) return null

  return (
    <section className="mt-10 border-l-2 border-slate-900 bg-slate-50 p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
        Job-seeker pain points
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        按高频搜索与咨询整理 — 你的问题可能也在其中
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {course.painPoints.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
          >
            <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            {point}
          </li>
        ))}
      </ul>
      {course.seoKeywords.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {course.seoKeywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
