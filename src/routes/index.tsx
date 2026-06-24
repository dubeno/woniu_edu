import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { brand, formatCoursePrice } from '~/config/brand'
import { courses } from '~/data/courses'
import { trustLogos, learningPath, valueProps, audienceMatch, servicePlan } from '~/data/landing'
import { useSeo } from '~/lib/seo'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  useSeo({
    title: `${brand.name} · AI Engineer Career Studio`,
    description:
      '蜗牛AI · FDE · AI Infra · Agent — 面向 OpenAI / Anthropic / Meta AI 等 AI 大厂的求职向实战课。',
    keywords: [
      'AI engineer interview',
      'FDE 求职',
      'AI Infra 面试',
      'AI Agent engineer',
      'OpenAI interview',
      'Anthropic interview',
      '北美 AI 求职',
      'AI 求职',
    ],
    path: '/',
  })

  useEffect(() => {
    document.title = `${brand.name} · AI Engineer Career Studio`
  }, [])

  return (
    <div className="min-h-full bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              WoniuAI · AI Engineer Career Studio
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Crack the AI Engineer Interview at
              <br />
              <span className="text-slate-900">OpenAI, Anthropic, Meta AI.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
              Three vertical tracks — FDE Delivery, AI Infra Inference, Agent Engineering —
              built for NG, career switchers, and senior engineers targeting AI-native teams in 2026.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Browse Courses
              </Link>
              <Link
                to="/blog"
                className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-900 hover:border-slate-400"
              >
                Read Free Career Notes
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            {courses[0] && (
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img
                  src={courses[0].coverImage}
                  alt={courses[0].title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-6">
                  {courses[0].badge && (
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      {courses[0].badge}
                    </span>
                  )}
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    <Link to="/courses/$slug" params={{ slug: courses[0].slug }} className="hover:underline">
                      {courses[0].title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {courses[0].description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs uppercase tracking-wider text-slate-500">
                      {courses[0].lectureCount}
                      {' '}
                      lessons · {courses[0].totalDuration}
                    </span>
                    <Link
                      to="/courses/$slug"
                      params={{ slug: courses[0].slug }}
                      className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
                    >
                      View course
                    </Link>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* 信任徽章 */}
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs uppercase tracking-[0.18em] text-slate-500">
            Target companies across our student outcomes
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-slate-700">
            {trustLogos.map(l => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 价值主张 + 适合谁：4 列价值 + 3 列卡片 */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((v, i) => (
              <div key={v.title} className="bg-white p-8">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  0
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {audienceMatch.map(a => (
              <Link
                key={a.title}
                to={a.href}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-slate-400"
              >
                <h3 className="text-base font-semibold text-slate-900">{a.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{a.desc}</p>
                <span className="mt-6 text-sm font-medium text-slate-900 underline-offset-4 group-hover:underline">
                  See the path
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 课程列表 */}
      <section className="border-y border-slate-200 bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Three vertical tracks.
            </h2>
            <Link to="/courses" className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">
              View all courses
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {courses.map(c => (
              <article
                key={c.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <Link to="/courses/$slug" params={{ slug: c.slug }} className="block">
                  <img src={c.coverImage} alt={c.title} className="aspect-[4/3] w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col p-7">
                  {c.badge && (
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      {c.badge}
                    </span>
                  )}
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">
                    <Link to="/courses/$slug" params={{ slug: c.slug }} className="hover:underline">
                      {c.title}
                    </Link>
                  </h3>
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
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-lg font-semibold text-slate-900">
                      {formatCoursePrice(c.plans[0]?.price ?? 0)}
                    </span>
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
            ))}
          </div>
        </div>
      </section>

      {/* AI Infra 求职陪跑 6 步法 */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                1v1 Coaching
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                AI Infra 求职陪跑
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                C9 博士后企业一线专家带教 · 服务周期一年 · 2v1 私教咨询（群聊 / 语音 / Meeting）
              </p>
            </div>
            <Link
              to="/services"
              className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              查看完整 6 步 →
            </Link>
          </div>

          <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
            {servicePlan.slice(0, 6).map(plan => (
              <li key={plan.step} className="bg-white p-7">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Phase
                  {plan.step}
                </span>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{plan.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {plan.summary}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 12 周路径 */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A 12-week path from reader to offer.
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {learningPath.map(p => (
              <li key={p.step}>
                <Link
                  to={p.href}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-slate-400"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Phase
                    {p.step}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-slate-500">
          <p>
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            {brand.name}
            {' '}
            ·
            {' '}
            {brand.tagline}
          </p>
          <p>{brand.supportEmail}</p>
        </div>
      </footer>
    </div>
  )
}
