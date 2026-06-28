import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useLogin } from '~/hooks/useLogin'
import { brand } from '~/config/brand'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const { loggedIn, userInfo, logout } = useLogin()

  useEffect(() => {
    if (!loggedIn) navigate({ to: '/login' })
  }, [loggedIn, navigate])

  if (!loggedIn) return null

  const initials = (userInfo.username || userInfo.email || "U").slice(0, 2).toUpperCase()
  const credits = userInfo.credits ?? 0
  const role = userInfo.role ?? "student"

  return (
    <div className="relative min-h-full bg-[#07060a] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-16">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl font-semibold">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">profile</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {userInfo.username ?? "woniu_user"}
            </h1>
            <p className="mt-1 text-sm text-white/50">{userInfo.email ?? "—"}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-3">
          <StatCell label="role" value={role} accent={role === "admin" ? "amber" : "violet"} />
          <StatCell label="credits" value={credits.toString()} accent="violet" />
          <StatCell label="joined" value="—" accent="violet" />
        </div>

        <div className="mt-10 space-y-2">
          <ActionRow href="/courses" label="查看课程目录" desc="三门垂直纵深课 + 1v1 陪跑" />
          <ActionRow href="/blog" label="阅读求职专栏" desc="高频搜索词 + 痛点 + 解法" />
          {role === "admin" && <ActionRow href="/admin" label="管理后台" desc="学员 / 积分 / 操作日志" accent="amber" />}
          <button
            type="button"
            onClick={logout}
            className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-red-400/40 hover:bg-red-500/5"
          >
            <div>
              <div className="text-sm font-medium text-white">退出登录</div>
              <div className="mt-0.5 text-xs text-white/40">清除本机 session</div>
            </div>
            <span className="text-xs text-white/40 group-hover:text-red-300">exit →</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCell({ label, value, accent }: { label: string; value: string; accent: "violet" | "amber" }) {
  const color = accent === "amber" ? "text-amber-300" : "text-violet-300"
  return (
    <div className="bg-[#07060a] px-5 py-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  )
}

function ActionRow({ href, label, desc, accent }: { href: string; label: string; desc: string; accent?: "amber" }) {
  const hoverBorder = accent === "amber" ? "hover:border-amber-400/40" : "hover:border-violet-400/40"
  const hoverText = accent === "amber" ? "group-hover:text-amber-300" : "group-hover:text-violet-300"
  return (
    <Link
      to={href}
      className={`group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition ${hoverBorder} hover:bg-white/[0.05]`}
    >
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="mt-0.5 text-xs text-white/40">{desc}</div>
      </div>
      <span className={`text-xs text-white/40 ${hoverText}`}>→</span>
    </Link>
  )
}