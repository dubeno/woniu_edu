import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { brand, formatCoursePrice } from '~/config/brand'
import { courses } from '~/data/courses'
import { useSeo, KEYWORDS, courseListJsonLd, breadcrumbJsonLd } from '~/lib/seo'

export const Route = createFileRoute('/courses')({
  component: CourseCatalogPage,
})

function CourseCatalogPage() {
  useSeo({
    title: `AI 课程目录 · FDE / AI Infra / Agent 三大纵深实战课 · ${brand.name}`,
    description:
      'FDE 课程、AI Infra 课程、Agent 课程三大纵深体系。每门课配套简历三件套、POC 模板、AI 模拟面试清单、免费 AI 项目讲义，配套 1v1 AI 求职陪跑。',
    keywords: KEYWORDS.courses,
    path: '/courses',
    jsonLd: [
      courseListJsonLd(courses.map(c => ({
        title: c.title,
        description: c.description,
        slug: c.slug,
        price: c.plans[0]?.price ?? 0,
      }))),
      breadcrumbJsonLd([
        { name: '蜗牛AI', path: '/' },
        { name: '课程目录', path: '/courses' },
      ]),
    ],
  })

  useEffect(() => {
    document.title = `全部课程 · ${brand.name}`
  }, [])

  return (
    <div className="relative bg-[#07060a] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <div className="relative">
        <section className="px-4 pb-16 pt-20 sm:pt-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">Course Catalog</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                三门垂直纵深课程
              </h1>
              <p className="mt-5 text-sm leading-relaxed text-white/55 sm:text-base">
                {brand.tagline}。选一门做透，比泛学 10 门更有效。
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24">
          <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-3">
            {courses.map(c => (
                <article
                  key={c.slug}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-violet-400/40 hover:bg-white/[0.05]"
                >
                  <Link to="/courses/$slug" params={{ slug: c.slug }} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={c.coverImage}
                        alt={c.title}
                        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07060a] via-transparent to-transparent" />
                      {c.badge && (
                        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur">
                          {c.badge}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-semibold leading-snug">
                      <Link to="/courses/$slug" params={{ slug: c.slug }} className="hover:text-violet-200">
                        {c.title}
                      </Link>
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-white/55">
                      {c.description}
                    </p>

                    {/* 课程只以 bundle 出售 —— 显示学习路径关键词，不显示价格 */}
                    <div className="mt-6 border-t border-white/5 pt-5 text-xs text-white/40">
                      课程 + 1 年求职陪跑 · <Link to="/services" className="text-violet-300 underline-offset-4 hover:underline">查看套餐</Link>
                    </div>

                    <Link
                      to="/courses/$slug"
                      params={{ slug: c.slug }}
                      className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium transition hover:border-violet-300/50 hover:bg-violet-500/10"
                    >
                      查看课程大纲 <span>→</span>
                    </Link>
                  </div>
                </article>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  )
}