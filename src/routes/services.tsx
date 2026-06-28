import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { brand } from '~/config/brand'
import { bundles, servicePlan } from '~/data/landing'
import { useSeo, KEYWORDS, serviceJsonLd, faqJsonLd, breadcrumbJsonLd } from '~/lib/seo'

export const Route = createFileRoute('/services')({
  component: ServicesPage,
})

function ServicesPage() {
  useSeo({
    title: `AI 求职陪跑 · 1v1 模拟面试 + 简历优化 + Offer 谈判 · ${brand.name}`,
    description:
      '蜗牛AI 求职陪跑：1v1 模拟面试、AI 简历优化、AI 面试复盘、Offer 谈判。C9 博士后企业一线在职专家带教，三大产品包课程+陪跑，服务周期一年。',
    keywords: KEYWORDS.services,
    path: '/services',
    jsonLd: [
      ...bundles.map(b => serviceJsonLd({
        name: `${b.name} 求职陪跑`,
        description: b.pitch,
        price: b.price,
      })),
      faqJsonLd([
        {
          question: '求职陪跑包含哪些内容？',
          answer: '课程辅导（文档 + 答疑）、项目植入（硬核项目 + 路线规划）、求职辅导（简历优化 + 表达技巧 + 模拟面试 + 面试复盘），服务周期一年。',
        },
        {
          question: '一年服务期内能享受什么？',
          answer: '一年内不限次 1v1 咨询 + 2v1 私教（主讲 + 助教）+ 简历三件套 + 模拟面试 + 靶向投递 + Offer 谈判。',
        },
        {
          question: 'AI Infra 陪跑跟单买 AI Infra 课程有什么区别？',
          answer: '课程+陪跑包在一年内额外提供简历项目段公式、模拟面试清单、靶向投递策略、面试复盘、Offer 谈判等求职支持；单买课程仅含课程文档与日常答疑。',
        },
      ]),
      breadcrumbJsonLd([
        { name: '蜗牛AI', path: '/' },
        { name: '求职陪跑', path: '/services' },
      ]),
    ],
  })

  useEffect(() => {
    document.title = `课程 + 求职陪跑 · ${brand.name}`
  }, [])

  return (
    <div
      className="relative bg-[#07060a] text-white"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-fuchsia-600/15 blur-[100px]" />
      </div>

      <div className="relative">
        {/* Hero */}
        <section className="px-4 pb-12 pt-20 sm:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
              Coaching + Courses
            </p>
            <h1
              className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
              style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.035em" }}
            >
              两个产品包
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                课程 · 陪跑 · 一站到位
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/60 sm:text-lg">
              课程文档 + 视频 + 答疑 + 项目植入 + 模拟面试
              <br />
              服务周期一年
            </p>
          </div>
        </section>

        {/* 两张价目表 */}
        <section className="px-4 pb-24">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
            {bundles.map((bundle, idx) => {
              const isFeatured = bundle.slug === 'ai-infra'
              return (
              <article
                key={bundle.slug}
                className={`relative overflow-hidden rounded-2xl border p-7 transition ${
                  isFeatured
                    ? 'border-violet-400/60 bg-gradient-to-br from-violet-500/[0.08] via-fuchsia-500/[0.04] to-transparent shadow-2xl shadow-violet-500/20'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-b-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      <span>★</span> 高薪进阶
                    </span>
                  </div>
                )}

                {/* 表头 */}
                <div className="border-b border-white/10 pb-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-violet-300/70">
                    {bundle.badge}
                  </p>
                  <h2
                    className="mt-3 text-2xl font-semibold tracking-tight text-white"
                    style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.025em" }}
                  >
                    {bundle.name}
                  </h2>
                  <p className="mt-1 text-xs text-white/50">{bundle.tagline}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-sm text-white/40">¥</span>
                    <span
                      className="bg-gradient-to-br from-white to-white/70 bg-clip-text text-4xl font-semibold tracking-tight text-transparent"
                      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
                    >
                      {bundle.price.toLocaleString('zh-CN')}
                    </span>
                    <span className="ml-1 text-xs text-white/40">/ 年</span>
                  </div>
                  <p className="mt-1 text-xs text-white/40">服务时长 · {bundle.duration}</p>
                </div>

                {/* pitch */}
                <p className="mt-6 text-sm leading-relaxed text-white/70">
                  {bundle.pitch}
                </p>

                {/* ★ 课程模块 — 课程详情 */}
                <div className="mt-7">
                  <p
                    className="text-[10px] uppercase tracking-[0.25em] text-violet-300/70"
                    style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
                  >
                    // 课程模块
                  </p>
                  <ul className="mt-3 space-y-2">
                    {bundle.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-white/85"
                      >
                        <svg
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-violet-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                        </svg>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 陪跑权益表 */}
                <div className="mt-7 border-t border-white/5 pt-5">
                  <p
                    className="text-[10px] uppercase tracking-[0.25em] text-violet-300/70"
                    style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
                  >
                    // 陪跑权益
                  </p>
                </div>
                <ul className="divide-y divide-white/5">
                  {bundle.coaching.map((cat) => (
                    <li
                      key={cat.title}
                      className="grid grid-cols-12 gap-4 py-3.5 transition hover:bg-white/[0.02]"
                    >
                      <div className="col-span-4">
                        <span
                          className="text-sm font-medium text-white"
                          style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
                        >
                          {cat.title}
                        </span>
                      </div>
                      <div className="col-span-8">
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                          {cat.items.map((item, i) => (
                            <span key={item} className="inline-flex items-center gap-1.5 text-sm text-white/80">
                              <span className="text-violet-400/80">✓</span>
                              {item}
                              {i < cat.items.length - 1 && (
                                <span className="text-white/20">·</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-7">
                  <a
                    href="#consult"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition ${
                      isFeatured
                        ? 'bg-white text-black hover:bg-violet-100'
                        : 'border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    了解 {bundle.name} <span>→</span>
                  </a>
                </div>
              </article>
              )
            })}
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-white/40">
            所有价格含税 · 支持微信 / 支付宝 / Stripe（USD）
          </p>
        </section>

        {/* 6 步流程（求职陪跑流程） */}
        <section className="border-y border-white/5 bg-white/[0.02] px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
                Six-Step Program
              </p>
              <h2
                className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.03em" }}
              >
                两个产品包都包含 · 一年制陪跑流程
              </h2>
            </div>

            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {servicePlan.map(plan => (
                <li
                  key={plan.step}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-400/40 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30">
                      {plan.step}
                    </span>
                    <h3 className="text-base font-semibold">{plan.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/55">{plan.summary}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Final CTA */}
        <section id="consult" className="px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.025em" }}
            >
              选一个包，开始你的一年陪跑
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55">
              扫码加微信 · 发送「AI 应用」或「AI Infra」加入排队咨询队列，48 小时内回复。
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}