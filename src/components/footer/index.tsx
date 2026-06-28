import { brand } from "~/config/brand"

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#07060a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold">
                {brand.name[0]}
              </div>
              <span className="text-base font-semibold">{brand.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              FDE · AI Infra · Agent
              <br />
              AI 大厂求职实战课
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">课程</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/50">
              <li><a href="/courses" className="transition hover:text-white">FDE 实战课</a></li>
              <li><a href="/courses" className="transition hover:text-white">AI Infra 实战课</a></li>
              <li><a href="/courses" className="transition hover:text-white">Agent 实战课</a></li>
              <li><a href="/services" className="transition hover:text-white">1v1 求职陪跑</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">资源</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/50">
              <li><a href="/blog" className="transition hover:text-white">求职专栏</a></li>
              <li><a href="/blog" className="transition hover:text-white">免费讲义</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">联系</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/50">
              <li>微信：扫码咨询（右下角）</li>
              <li>
                <a href={`mailto:${brand.supportEmail}`} className="transition hover:text-white">
                  {brand.supportEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {brand.name}</p>
          <p>部署于 Cloudflare Pages</p>
        </div>
      </div>
    </footer>
  )
}