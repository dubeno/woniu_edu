import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { brand } from '~/config/brand'
import { servicePlan } from '~/data/landing'
import { useSeo } from '~/lib/seo'

export const Route = createFileRoute('/services')({
  component: ServicesPage,
})

function ServicesPage() {
  useSeo({
    title: `AI Infra 求职陪跑 · C9 博士后企业一线专家 1v1 带教 · ${brand.name}`,
    description:
      '服务周期一年：简历深度挖掘、定制求职规划、硬核实操课程、模拟/面试辅导、1v1 私教咨询、2v1 服务形式。',
    keywords: ['AI Infra 求职陪跑', 'AI Infra 1v1 辅导', '大模型求职', '简历优化', '模拟面试'],
    path: '/services',
  })

  useEffect(() => {
    document.title = `AI Infra 求职陪跑 · ${brand.name}`
  }, [])

  return (
    <div className="min-h-full bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Service
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            AI Infra 求职陪跑
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            C9 博士后企业一线专家带教 · 服务周期一年
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/courses/ai-infra"
              className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              查看 AI Infra 课程
            </Link>
            <Link
              to="/blog"
              className="rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 hover:border-slate-400"
            >
              先读求职专栏
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          6 步陪跑路径
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          从简历到 Offer 全流程 — 一年制长期带教，老学员有效期内免费获取增值服务。
        </p>

        <ol className="mt-12 space-y-10">
          {servicePlan.map(plan => (
            <li
              key={plan.step}
              className="grid gap-6 border-b border-slate-200 pb-10 last:border-b-0 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Phase
                  {plan.step}
                </span>
                <h3 className="mt-3 text-xl font-semibold leading-snug text-slate-900">
                  {plan.title}
                </h3>
              </div>
              <div className="md:col-span-9">
                <p className="text-base leading-relaxed text-slate-700">{plan.summary}</p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                  {plan.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-400"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            准备好开始你的 1 年陪跑了？
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
            扫码咨询，发送「陪跑」即可加入排队咨询队列。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/courses/ai-infra"
              className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              了解 AI Infra 课程
            </Link>
            <Link
              to="/blog"
              className="rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 hover:border-slate-400"
            >
              先读求职专栏
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
