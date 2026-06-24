import { createFileRoute, Link } from '@tanstack/react-router'
import { brand, formatCoursePrice } from '~/config/brand'
import { courses } from '~/data/courses'

const path = [
  { step: '01', title: '免费读讲义', desc: 'Markdown 资料植入求职痛点与搜索词' },
  { step: '02', title: '微信咨询', desc: '扫码领取完整版 + 1v1 学习路径' },
  { step: '03', title: '正课交付', desc: '视频课 + 模板 + 答疑群' },
]

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-full bg-[#0c0f1a] text-white">
      <section className="relative overflow-hidden px-4 pb-20 pt-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.35)_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium tracking-wider text-indigo-300">蜗牛AI · 求职向 AI 实战</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            免费讲义引流
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-teal-300 bg-clip-text text-transparent">
              微信咨询转化
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            FDE 交付 · AI Infra 推理优化 · Agent 工程 — 覆盖转码、NG、大厂面试高频痛点
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/courses"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
            >
              免费领取讲义
            </Link>
            <Link
              to="/courses/$slug/learn/$lessonId"
              params={{ slug: 'fde', lessonId: 'free-intro' }}
              className="rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              直接试读 FDE 讲义
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#111827] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold">三门课</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {courses.map(c => {
              const plan = c.plans[0]
              return (
                <Link
                  key={c.slug}
                  to="/courses/$slug"
                  params={{ slug: c.slug }}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-indigo-500/40"
                >
                  <img src={c.coverImage} alt="" className="aspect-video w-full object-cover" />
                  <div className="p-5">
                    {c.badge && (
                      <span className="rounded-md bg-teal-500/20 px-2 py-0.5 text-xs text-teal-300">{c.badge}</span>
                    )}
                    <h3 className="mt-2 font-semibold leading-snug group-hover:text-indigo-300">{c.title}</h3>
                    <p className="mt-3 text-lg font-bold text-indigo-400">
                      {plan ? formatCoursePrice(plan.price) : '—'}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold">转化闭环</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {path.map(p => (
              <div key={p.step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="text-2xl font-bold text-indigo-500/50">{p.step}</span>
                <p className="mt-3 font-semibold">{p.title}</p>
                <p className="mt-2 text-sm text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">求职专栏</h2>
              <p className="mt-2 text-sm text-slate-400">
                常被搜的 AI 求职问题 + 痛点 + 解法 + 课程入口
              </p>
            </div>
            <Link to="/blog" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
              查看全部 →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {courses.slice(0, 3).map((c) => (
              <Link
                key={c.slug}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-500/40"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-indigo-300">
                  {c.badge || '课程'}
                </p>
                <h3 className="mt-2 font-semibold leading-snug">{c.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        {brand.name}
        {' '}
        —
        {brand.tagline}
      </footer>
    </div>
  )
}
