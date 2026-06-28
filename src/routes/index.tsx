import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { brand } from '~/config/brand'
import { courses } from '~/data/courses'
import { bundles, servicePlan, homeFaqs } from '~/data/landing'
import {
  useSeo,
  KEYWORDS,
  organizationJsonLd,
  websiteJsonLd,
  courseListJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from '~/lib/seo'
import { useInView, useCountUp } from '~/hooks/useInView'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const TESTIMONIALS = [
  {
    quote: '12 周从转码到拿到 AI Infra 团队的面试。简历三件套 + POC 是杀手锏。',
    name: 'M. Chen',
    role: 'SDE → AI Infra Engineer',
    avatar: 'MC',
  },
  {
    quote: 'FDE 实战课里的客户叙事训练直接帮我过了 Anthropic 的 onsite。',
    name: 'L. Wang',
    role: 'Backend → Forward Deployed Engineer',
    avatar: 'LW',
  },
  {
    quote: '讲师都是一线在职，看问题的颗粒度跟外面 199 的录播课完全不是一个 level。',
    name: 'Z. Liu',
    role: 'MLE → Agent Engineer',
    avatar: 'ZL',
  },
]

const STATS = [
  { label: '上岸学员', value: 120, suffix: '+' },
  { label: '目标公司', value: 50, suffix: '+' },
  { label: '课程模块', value: 60, suffix: '+' },
  { label: '1v1 答疑', value: 365, suffix: ' 天' },
]

const COMPANY_LOGOS = [
  '字节跳动', '阿里巴巴', '腾讯', '百度', '美团',
  '快手', '小红书', '深度求索', '月之暗面', '智谱',
  'MiniMax', '阶跃星辰',
]

const PRICING = bundles.map((b) => ({
  name: b.name,
  tagline: b.tagline,
  badge: b.badge,
  price: b.price.toLocaleString('zh-CN'),
  suffix: '/ 年',
  features: [
    ...b.highlights,
    '课程文档 + 配套视频 + 日常答疑',
    '硬核项目 + 路线规划',
    '简历优化 + 表达技巧 + 模拟面试 + 面试复盘',
    '7 天无理由退款 · 老学员续费 5 折',
  ],
  cta: `了解 ${b.name}`,
  href: '/services',
  featured: b.slug === 'ai-infra',
}))

/** 滚动入场动画包装器 — 配合 useInView 用 */
function Reveal({
  children,
  className = '',
  delayMs = 0,
}: {
  children: React.ReactNode
  className?: string
  delayMs?: number
}) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const display = useCountUp(value, inView, 1400)
  return (
    <div ref={ref} className="bg-[#07060a] px-6 py-8 text-center">
      <div className="font-['Inter_Tight',system-ui,sans-serif] bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
        {display}{suffix}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">
        {/* 留空 */}
      </div>
    </div>
  )
}

function StatCell({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const display = useCountUp(value, inView, 1400)
  return (
    <div ref={ref} className="bg-[#07060a] px-6 py-8 text-center">
      <div className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
        {display}{suffix}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">{label}</div>
    </div>
  )
}

function HomePage() {
  useSeo({
    title: `${brand.name} · AI 大厂求职实战课`,
    description:
      'FDE · AI Infra · Agent 三门纵深实战课，1v1 陪跑上岸。',
    keywords: ['AI 求职', 'FDE 求职', 'AI Infra 面试', 'AI Agent 工程师'],
    path: '/',
  })

  useEffect(() => {
    document.title = `${brand.name} · AI 大厂求职实战课`
  }, [])

  return (
    <div className="relative bg-[#07060a] text-white antialiased" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* 全局渐变光晕背景 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[40%] right-0 h-[400px] w-[600px] rounded-full bg-fuchsia-600/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[500px] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      <div className="relative">
        {/* HERO */}
        <section className="px-4 pb-24 pt-20 sm:pb-32 sm:pt-28 lg:pt-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  2026 春季招生 · 首批 30 席
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <h1
                className="mx-auto mt-8 max-w-4xl text-center text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl"
                style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.04em" }}
              >
                上岸 AI 大厂
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                  你只差一套方法论。
                </span>
              </h1>
            </Reveal>

            <Reveal delayMs={240}>
              <p className="mx-auto mt-7 max-w-2xl text-center text-base leading-relaxed text-white/60 sm:text-lg">
                三门垂直纵深实战课（<span className="text-white">FDE</span> / <span className="text-white">AI Infra</span> / <span className="text-white">Agent</span>）
                <br className="hidden sm:block" />
                简历三件套 · POC 模板 · 模拟面试 · 一线专家 1v1 带教
              </p>
            </Reveal>

            <Reveal delayMs={360}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/courses"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-violet-100"
                >
                  浏览课程
                  <span className="transition group-hover:translate-x-0.5">→</span>
                </Link>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
                >
                  免费试读 6 篇
                </Link>
              </div>
            </Reveal>

            {/* 信任徽章 */}
            <Reveal delayMs={500}>
              <div className="mt-20">
                <p className="text-center text-xs uppercase tracking-[0.3em] text-white/30">
                  学员去向 · 持续更新
                </p>
                <div className="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-white/50">
                  {COMPANY_LOGOS.map(l => (
                    <span key={l} className="transition hover:text-white/80">{l}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* STATS — 滚动计数 */}
        <section className="border-y border-white/5 bg-white/[0.02] px-4 py-12">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
            {STATS.map(s => (
              <StatCell key={s.label} label={s.label} value={s.value} suffix={s.suffix} />
            ))}
          </div>
        </section>

        {/* COURSES — 三门课 */}
        <section className="px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
                  Course Catalog
                </p>
                <h2
                  className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.03em" }}
                >
                  三门纵深课程 · 选一门做透
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  每门课都配套 POC 模板、简历项目段公式、模拟面试清单。
                  实战，不是科普。
                </p>
              </div>
            </Reveal>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {courses.map((c, i) => (
                <Reveal key={c.slug} delayMs={i * 100}>
                  <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-violet-400/40 hover:bg-white/[0.05]">
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

                    <div className="p-6">
                      <h3 className="text-lg font-semibold leading-snug">
                        <Link to="/courses/$slug" params={{ slug: c.slug }} className="hover:text-violet-200">
                          {c.title}
                        </Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/55">
                        {c.description}
                      </p>

                      {/* 课程只以 bundle 出售 — 不显示时长/评分/单价 */}
                      <div className="mt-6 border-t border-white/5 pt-5 text-xs text-white/40">
                        课程 + 1 年求职陪跑 ·{" "}
                        <Link to="/services" className="text-violet-300 underline-offset-4 hover:underline">
                          查看套餐
                        </Link>
                      </div>

                      <div className="mt-5">
                        <Link
                          to="/courses/$slug"
                          params={{ slug: c.slug }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:border-violet-300/50 hover:bg-violet-500/10"
                        >
                          查看课程大纲 <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="border-y border-white/5 bg-white/[0.02] px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
                  Student Outcomes
                </p>
                <h2
                  className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.03em" }}
                >
                  真实学员 · 真实 offer
                </h2>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={i} delayMs={i * 120}>
                  <figure className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20">
                    <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
                      {t.avatar}
                    </div>
                    <blockquote className="text-sm leading-relaxed text-white/80">
                      <span className="mr-1 text-2xl leading-none text-violet-400/60">"</span>
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-5 border-t border-white/5 pt-4 text-xs">
                      <div className="font-medium text-white">{t.name}</div>
                      <div className="mt-0.5 text-white/50">{t.role}</div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 1v1 求职陪跑 — 价格卡 */}
        <section className="px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
                {/* 左：标题 + 卖点 */}
                <div className="lg:col-span-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
                    1v1 Coaching
                  </p>
                  <h2
                    className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
                    style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.035em" }}
                  >
                    AI Infra
                    <br />
                    <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                      求职陪跑
                    </span>
                  </h2>
                  <p className="mt-6 text-base leading-relaxed text-white/60">
                    一年制长程带教 · 一线在职专家亲带
                    <br />
                    从简历到 Offer 全流程 6 步法
                  </p>

                  <ul className="mt-9 space-y-3.5 text-sm text-white/75">
                    {[
                      '简历深度挖掘 · 项目段公式',
                      '定制求职规划 · 靶向投递',
                      'vLLM / SGLang / CUDA 硬核实操',
                      '每月 1 次直播 · 模拟面试',
                      '2v1 私教 · 群聊 / 语音 / Meeting',
                    ].map(f => (
                      <li key={f} className="flex items-start gap-3">
                        <svg className="mt-1 h-4 w-4 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-violet-100"
                    >
                      了解求职陪跑 <span>→</span>
                    </Link>
                    <Link
                      to="/blog/llm-inference-optimization-interview"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      学员上岸案例
                    </Link>
                  </div>
                </div>

                {/* 右：6 步卡片 */}
                <div className="lg:col-span-7">
                  <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
                    Six-Step Program
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {servicePlan.slice(0, 6).map((plan, i) => (
                      <Reveal key={plan.step} delayMs={i * 80}>
                        <article className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-400/40 hover:bg-white/[0.05]">
                          <div className="flex items-start justify-between">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30">
                              {plan.step}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 transition group-hover:text-violet-300/60">
                              phase
                            </span>
                          </div>
                          <h3 className="mt-5 text-base font-semibold text-white">{plan.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-white/55">
                            {plan.summary}
                          </p>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PRICING — 三档 */}
        <section className="px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
                  Pricing
                </p>
                <h2
                  className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.03em" }}
                >
                  三档 · 选适合自己的
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  所有课程 1 年内无限次回看 · 老学员续费长期 5 折
                </p>
              </div>
            </Reveal>

            <div className="mt-16 mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
              {PRICING.map((tier, i) => (
                <Reveal key={tier.name} delayMs={i * 100}>
                  <article
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition ${
                      tier.featured
                        ? 'border-violet-400/60 bg-gradient-to-br from-violet-500/[0.08] via-fuchsia-500/[0.04] to-transparent shadow-2xl shadow-violet-500/20'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    {/* 最受欢迎徽章 */}
                    {tier.featured && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 rounded-b-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                          <span>★</span> 学员首选
                        </span>
                      </div>
                    )}

                    {/* hover glow */}
                    {!tier.featured && (
                      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 opacity-0 transition group-hover:opacity-100 group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5" />
                    )}

                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-lg font-semibold text-white"
                          style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
                        >
                          {tier.name}
                        </h3>
                        {tier.featured && (
                          <span className="text-[10px] uppercase tracking-[0.2em] text-violet-300/70">
                            popular
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-white/50">{tier.tagline}</p>

                      <div className="mt-7 flex items-baseline gap-2">
                        <span className="text-sm text-white/40">¥</span>
                        <span
                          className="bg-gradient-to-br from-white to-white/70 bg-clip-text text-5xl font-semibold tracking-tight text-transparent"
                          style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
                        >
                          {tier.price}
                        </span>
                        <span className="text-sm text-white/40">{tier.suffix}</span>
                      </div>
                      {tier.original && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-white/40">
                          <span className="line-through">¥{tier.original}</span>
                          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                            {tier.suffix}
                          </span>
                        </div>
                      )}

                      <ul className="mt-7 space-y-3 text-sm text-white/75">
                        {tier.features.map(f => (
                          <li key={f} className="flex items-start gap-3">
                            <svg className={`mt-1 h-4 w-4 shrink-0 ${tier.featured ? 'text-violet-300' : 'text-violet-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                            </svg>
                            <span className="leading-relaxed">{f}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 pt-2">
                        <Link
                          to={tier.href}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition ${
                            tier.featured
                              ? 'bg-white text-black hover:bg-violet-100'
                              : 'border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10'
                          }`}
                        >
                          {tier.cta} <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delayMs={300}>
              <p className="mt-10 text-center text-xs text-white/40">
                所有价格含税 · 支持微信 / 支付宝 / Stripe（USD）
                <br />
                付款后 7 天内无理由全额退款
              </p>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/5 bg-white/[0.02] px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">FAQ</p>
                <h2
                  className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.03em" }}
                >
                  常见问题
                </h2>
              </div>
            </Reveal>

            <Reveal delayMs={150}>
              <div className="mt-12 divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.02]">
                {homeFaqs.map((f, i) => (
                  <FaqRow key={i} q={f.question} a={f.answer} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  )
}

function FaqRow({ q, a }: { q: string; a: string }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer items-start justify-between gap-6 px-6 py-5 text-left text-sm font-medium text-white transition hover:bg-white/[0.02] sm:px-8 sm:py-6 sm:text-base [&::-webkit-details-marker]:hidden list-none">
        <span>{q}</span>
        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition group-open:rotate-45 group-open:border-white/30">
          +
        </span>
      </summary>
      <div className="px-6 pb-6 text-sm leading-relaxed text-white/60 sm:px-8 sm:pb-7">
        {a}
      </div>
    </details>
  )
}