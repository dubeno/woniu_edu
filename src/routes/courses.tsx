import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { brand, formatCoursePrice } from '~/config/brand'
import { courses } from '~/data/courses'
import { useSeo } from '~/lib/seo'

export const Route = createFileRoute('/courses')({
  component: CourseCatalogPage,
})

function CourseCatalogPage() {
  useSeo({
    title: `全部课程 · ${brand.name}`,
    description: 'FDE · AI Infra · Agent — 蜗牛AI 三门垂直纵深课程，覆盖 2026 AI 大厂面试高频考点。',
    keywords: ['AI 课程', 'FDE 课程', 'AI Infra 课程', 'Agent 课程', 'AI 求职'],
    path: '/courses',
  })

  useEffect(() => {
    document.title = `全部课程 · ${brand.name}`
  }, [])

  return (
    <div className="min-h-full bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            All Courses
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            三门垂直纵深课程
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            {brand.tagline}
            。选一门做透，比泛学 10 门更有效。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(c => {
            const plan = c.plans[0]
            return (
              <article
                key={c.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <Link to="/courses/$slug" params={{ slug: c.slug }} className="block">
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  {c.badge && (
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      {c.badge}
                    </span>
                  )}
                  <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900">
                    <Link
                      to="/courses/$slug"
                      params={{ slug: c.slug }}
                      className="hover:underline"
                    >
                      {c.title}
                    </Link>
                  </h2>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {c.description}
                  </p>
                  <dl className="mt-6 flex items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <span>
                      {c.lectureCount}
                      {' '}
                      lessons
                    </span>
                    <span aria-hidden>·</span>
                    <span>{c.totalDuration}</span>
                    <span aria-hidden>·</span>
                    <span>
                      {c.rating.toFixed(1)}
                      {' '}
                      rating
                    </span>
                  </dl>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-slate-900">
                        {formatCoursePrice(plan?.price ?? 0)}
                      </span>
                      {plan?.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatCoursePrice(plan.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Link
                      to="/courses/$slug"
                      params={{ slug: c.slug }}
                      className="rounded-md border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-900 hover:text-white"
                    >
                      View course
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
