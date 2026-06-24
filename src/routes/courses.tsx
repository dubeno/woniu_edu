import { createFileRoute, Link } from '@tanstack/react-router'
import { brand, formatCoursePrice } from '~/config/brand'
import { courses } from '~/data/courses'

export const Route = createFileRoute('/courses')({
  component: CourseCatalogPage,
})

function CourseCatalogPage() {
  return (
    <div className="min-h-full bg-gradient-to-b from-indigo-50/80 via-white to-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-teal-600 p-8 text-white shadow-lg">
          <p className="text-sm font-medium text-indigo-100">{brand.name}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">三门实战课，从交付到推理到 Agent</h1>
          <p className="mt-2 max-w-xl text-indigo-100">{brand.tagline}</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(c => {
            const plan = c.plans[0]
            return (
              <Link
                key={c.slug}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <img
                  src={c.coverImage}
                  alt=""
                  className="aspect-video w-full object-cover transition group-hover:scale-[1.02]"
                />
                <div className="p-4">
                  {c.badge && (
                    <span className="rounded-md bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
                      {c.badge}
                    </span>
                  )}
                  <h2 className="mt-2 line-clamp-2 font-semibold leading-snug text-slate-900">{c.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {c.lectureCount}
                    {' '}
                    课时 ·
                    {c.totalDuration}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-indigo-600">{formatCoursePrice(plan?.price ?? 0)}</span>
                    {plan?.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatCoursePrice(plan.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
