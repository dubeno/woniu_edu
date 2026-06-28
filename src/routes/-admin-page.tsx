import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { jwtAtom } from '~/hooks/useLogin'
import { myFetch } from '~/utils'
import { InputModal, ConfirmModal } from '~/components/Modal'

type Tab = "dashboard" | "users" | "credits" | "credit-history" | "restorations"

const TAB_LABELS: Record<Tab, string> = {
  "dashboard": "dashboard",
  "users": "users",
  "credits": "credits",
  "credit-history": "credit-history",
  "restorations": "restorations",
}

const TAB_COMMENTS: Record<Tab, string> = {
  "dashboard": "// 系统核心指标",
  "users": "// 学员账号管理",
  "credits": "// 积分充值 / 扣除 / 设置",
  "credit-history": "// 积分变更审计日志",
  "restorations": "// 修复任务流水",
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [jwt] = useAtom(jwtAtom)
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [restorations, setRestorations] = useState<any[]>([])
  const [creditHistory, setCreditHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [inputModal, setInputModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    placeholder: string
    type: "text" | "number"
    onConfirm: (value: string) => void
    confirmColor?: "blue" | "green" | "red"
  } | null>(null)

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    confirmColor?: "blue" | "green" | "red"
  } | null>(null)

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!jwt) {
      navigate({ to: "/login" })
      return
    }
    loadData()
  }, [jwt, activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const headers = { Authorization: `Bearer ${jwt}` }

      if (activeTab === "dashboard") {
        setStats(await myFetch("/api/admin/stats", { headers }))
      } else if (activeTab === "users" || activeTab === "credits") {
        const data = await myFetch("/api/admin/users", { headers })
        setUsers(data.users || [])
      } else if (activeTab === "credit-history") {
        const data = await myFetch("/api/admin/credit-history", { headers })
        setCreditHistory(data.history || [])
      } else if (activeTab === "restorations") {
        const data = await myFetch("/api/admin/restorations", { headers })
        setRestorations(data.restorations || [])
      }
    } catch (err: any) {
      if (err.statusCode === 403) {
        setError("403 · 您没有管理员权限")
      } else {
        setError(err.message || "加载数据失败")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreditsAction = async (userId: string, action: "add" | "set" | "deduct", amount: number) => {
    try {
      await myFetch(`/api/admin/users/${userId}/credits`, {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
        body: { action, amount }
      })
      await loadData()
      const verb = action === "add" ? "+" : action === "deduct" ? "-" : "="
      setSuccessMessage(`[ok] ${verb}${amount} credits applied to ${userId.slice(0, 8)}…`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setConfirmModal({
        isOpen: true,
        title: "操作失败",
        message: err.message || "操作失败，请稍后重试",
        onConfirm: () => {},
        confirmColor: "red",
      })
    }
  }

  const showInputModal = (
    title: string,
    message: string,
    placeholder: string,
    type: "text" | "number",
    onConfirm: (value: string) => void,
    confirmColor: "blue" | "green" | "red" = "blue"
  ) => {
    setInputModal({ isOpen: true, title, message, placeholder, type, onConfirm, confirmColor })
  }

  if (!jwt) return null

  if (error && error.includes("403")) {
    return (
      <div className="min-h-full bg-[#0a0e1a] font-mono text-slate-200">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
          <pre className="text-red-400 leading-tight">{`
   ___   ____
  / _ \\ / ___|
 | | | | |  _
 | |_| | |_| |
  \\___/ \\____|
`}</pre>
          <h1 className="mt-6 text-2xl font-semibold text-red-400">403 · Forbidden</h1>
          <p className="mt-2 text-xs text-slate-500">{error}</p>

          <div className="mt-8 w-full border border-emerald-500/20 bg-[#0d1220] p-6 text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500">// 提升为管理员</p>
            <ol className="mt-4 space-y-2 text-xs text-slate-300">
              <li><span className="text-emerald-500">$</span> 注册账号（如未注册）</li>
              <li><span className="text-emerald-500">$</span> 获取用户 ID（个人中心 / 注册响应中）</li>
              <li><span className="text-emerald-500">$</span> 编辑 <code className="bg-[#0a0f1c] px-1 text-emerald-400">.env.server</code>，加：</li>
              <li><code className="mt-1 block bg-[#0a0f1c] px-2 py-1 text-emerald-400">ADMIN_USERS=your-id-or-username</code></li>
              <li><span className="text-emerald-500">$</span> 重启 dev server</li>
            </ol>
          </div>

          <div className="mt-8 flex gap-2">
            <button
              onClick={() => navigate({ to: "/login" })}
              className="border border-emerald-500 bg-emerald-500/10 px-5 py-2 text-xs text-emerald-400 transition hover:bg-emerald-500/20"
            >
              ./login
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="border border-slate-700 px-5 py-2 text-xs text-slate-300 transition hover:bg-slate-800"
            >
              ./home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#0a0e1a] font-mono text-slate-200">
      {/* Top bar */}
      <header className="border-b border-emerald-500/20 bg-[#0d1220]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="uppercase tracking-[0.2em] text-emerald-400">woniu-ai · admin</span>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="text-xs text-slate-500 transition hover:text-emerald-400"
          >
            $ exit
          </button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-0 overflow-x-auto border-t border-emerald-500/10 px-2">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative whitespace-nowrap border-r border-emerald-500/10 px-4 py-2.5 text-xs transition ${
                activeTab === tab
                  ? "bg-[#0a0f1c] text-emerald-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="text-emerald-500/60">{activeTab === tab ? "▶" : " "}</span>{" "}
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Status line */}
        <div className="mb-6 flex items-center justify-between text-xs">
          <p className="text-slate-500">{TAB_COMMENTS[activeTab]}</p>
          {successMessage && (
            <span className="border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-400">
              {successMessage}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center border border-emerald-500/20 bg-[#0d1220] py-16 text-xs text-slate-500">
            <span className="mr-2 inline-block h-3 w-3 animate-spin border border-emerald-400 border-t-transparent" />
            loading…
          </div>
        ) : error ? (
          <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            ! {error}
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && stats && <DashboardView stats={stats} />}

            {activeTab === "users" && (
              <UsersTable
                users={users}
                onManageCredits={(user) => {
                  showInputModal(
                    "充值积分",
                    `为 ${user.username || user.email} 充值`,
                    "请输入积分数量（正整数）",
                    "number",
                    (value) => {
                      const amount = Number(value)
                      if (amount > 0) handleCreditsAction(user.id, "add", amount)
                    },
                    "blue"
                  )
                }}
              />
            )}

            {activeTab === "credits" && (
              <CreditsView
                users={users}
                onAction={(user, action) => {
                  const config = {
                    add: { title: "充值积分", placeholder: "请输入积分数量（正整数）", color: "blue" as const, validate: (n: number) => n > 0 },
                    set: { title: "设置积分", placeholder: "请输入积分数量（非负整数）", color: "green" as const, validate: (n: number) => n >= 0 },
                    deduct: { title: "扣除积分", placeholder: "请输入积分数量（正整数）", color: "red" as const, validate: (n: number) => n > 0 },
                  }[action]
                  showInputModal(
                    config.title,
                    `${action === "set" ? "设置" : action === "deduct" ? "扣除" : "为"} ${user.username || user.email} 的积分`,
                    config.placeholder,
                    "number",
                    (value) => {
                      const amount = Number(value)
                      if (config.validate(amount)) handleCreditsAction(user.id, action, amount)
                    },
                    config.color
                  )
                }}
              />
            )}

            {activeTab === "credit-history" && <CreditHistoryView history={creditHistory} />}

            {activeTab === "restorations" && <RestorationsView restorations={restorations} />}
          </>
        )}
      </main>

      {inputModal && (
        <InputModal
          isOpen={inputModal.isOpen}
          onClose={() => setInputModal(null)}
          onConfirm={inputModal.onConfirm}
          title={inputModal.title}
          message={inputModal.message}
          placeholder={inputModal.placeholder}
          type={inputModal.type}
          confirmColor={inputModal.confirmColor}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmColor={confirmModal.confirmColor}
        />
      )}
    </div>
  )
}

/* ── View: Dashboard ─────────────────────────────────────────── */

function DashboardView({ stats }: { stats: any }) {
  return (
    <div className="grid gap-px bg-emerald-500/10 sm:grid-cols-2 lg:grid-cols-3">
      <StatTile label="total_users" value={stats.totalUsers || 0} hint="总注册用户" />
      <StatTile label="total_restorations" value={stats.totalRestorations || 0} hint="总修复任务" />
      <StatTile label="completed" value={stats.completedRestorations || 0} hint="已完成" accent="amber" />
      <StatTile label="new_users_7d" value={stats.newUsersLast7Days || 0} hint="近 7 天新用户" />
      <StatTile label="new_jobs_7d" value={stats.newRestorationsLast7Days || 0} hint="近 7 天新任务" />
    </div>
  )
}

function StatTile({ label, value, hint, accent }: { label: string; value: number | string; hint: string; accent?: "amber" }) {
  const valueColor = accent === "amber" ? "text-amber-400" : "text-emerald-400"
  return (
    <div className="bg-[#0d1220] p-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className={`mt-3 text-4xl font-semibold ${valueColor}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-600"># {hint}</p>
    </div>
  )
}

/* ── View: Users ─────────────────────────────────────────────── */

function UsersTable({ users, onManageCredits }: { users: any[]; onManageCredits: (u: any) => void }) {
  return (
    <div className="border border-emerald-500/20 bg-[#0d1220]">
      <div className="flex items-center justify-between border-b border-emerald-500/20 bg-[#0a0f1c] px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-xs">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          <span className="ml-3 text-slate-500">~/admin/users.list --limit 20</span>
        </span>
        <span className="text-xs text-slate-500">{users.length} rows</span>
      </div>
      {users.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">// no users yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-emerald-500/10 text-left text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">username</th>
                <th className="px-4 py-3">email</th>
                <th className="px-4 py-3">credits</th>
                <th className="px-4 py-3">joined</th>
                <th className="px-4 py-3 text-right">action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-emerald-500/5 text-slate-300 transition hover:bg-emerald-500/5">
                  <td className="px-4 py-3 font-medium text-slate-100">{u.username || "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{u.email || "—"}</td>
                  <td className="px-4 py-3 text-emerald-400">{u.credits || 0}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {u.created ? new Date(u.created).toLocaleString("zh-CN") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onManageCredits(u)}
                      className="border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-400 transition hover:bg-emerald-500/20"
                    >
                      +credits
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ── View: Credits ───────────────────────────────────────────── */

function CreditsView({ users, onAction }: { users: any[]; onAction: (u: any, action: "add" | "set" | "deduct") => void }) {
  return (
    <div className="border border-emerald-500/20 bg-[#0d1220]">
      <div className="flex items-center justify-between border-b border-emerald-500/20 bg-[#0a0f1c] px-4 py-2.5">
        <span className="text-xs text-slate-500">~/admin/credits.sh --manage</span>
        <span className="text-xs text-slate-500">{users.length} accounts</span>
      </div>
      {users.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">// no users yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-emerald-500/10 text-left text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">username</th>
                <th className="px-4 py-3">email</th>
                <th className="px-4 py-3">balance</th>
                <th className="px-4 py-3 text-right">actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-emerald-500/5 text-slate-300 transition hover:bg-emerald-500/5">
                  <td className="px-4 py-3 font-medium text-slate-100">{u.username || "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{u.email || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-2xl font-semibold text-emerald-400">{u.credits || 0}</span>
                    <span className="ml-1 text-slate-600">cr</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => onAction(u, "add")} className="border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-emerald-400 hover:bg-emerald-500/20">+</button>
                      <button onClick={() => onAction(u, "set")} className="border border-slate-700 px-2.5 py-1 text-slate-300 hover:bg-slate-800">=</button>
                      <button onClick={() => onAction(u, "deduct")} className="border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-red-400 hover:bg-red-500/20">−</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ── View: Credit History ────────────────────────────────────── */

function CreditHistoryView({ history }: { history: any[] }) {
  return (
    <div className="border border-emerald-500/20 bg-[#0d1220]">
      <div className="flex items-center justify-between border-b border-emerald-500/20 bg-[#0a0f1c] px-4 py-2.5">
        <span className="text-xs text-slate-500">~/admin/credit-history.log --audit</span>
        <span className="text-xs text-slate-500">{history.length} events</span>
      </div>
      {history.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">// no events</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-emerald-500/10 text-left text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">time</th>
                <th className="px-4 py-3">user</th>
                <th className="px-4 py-3">action</th>
                <th className="px-4 py-3 text-right">delta</th>
                <th className="px-4 py-3 text-right">before</th>
                <th className="px-4 py-3 text-right">after</th>
                <th className="px-4 py-3">reason</th>
                <th className="px-4 py-3">by</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id} className="border-b border-emerald-500/5 text-slate-300 transition hover:bg-emerald-500/5">
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(r.created_at).toLocaleString("zh-CN")}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                    {r.user_id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3">
                    <ActionBadge action={r.action} />
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    r.action === "add" ? "text-emerald-400" :
                    r.action === "deduct" ? "text-red-400" :
                    "text-amber-400"
                  }`}>
                    {r.action === "add" ? "+" : r.action === "deduct" ? "-" : ""}{r.amount}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">{r.balance_before}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">{r.balance_after}</td>
                  <td className="px-4 py-3 text-slate-400">{r.reason}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {r.operator_type === "admin" ? "admin" : "system"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ActionBadge({ action }: { action: string }) {
  const styles = {
    add: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    deduct: "border-red-500/40 bg-red-500/10 text-red-400",
    set: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  }[action] || "border-slate-700 text-slate-400"

  const labels = { add: "ADD", deduct: "DEDUCT", set: "SET" } as Record<string, string>

  return (
    <span className={`inline-block border px-2 py-0.5 text-[10px] font-medium ${styles}`}>
      {labels[action] || action.toUpperCase()}
    </span>
  )
}

/* ── View: Restorations ──────────────────────────────────────── */

function RestorationsView({ restorations }: { restorations: any[] }) {
  return (
    <div className="border border-emerald-500/20 bg-[#0d1220]">
      <div className="flex items-center justify-between border-b border-emerald-500/20 bg-[#0a0f1c] px-4 py-2.5">
        <span className="text-xs text-slate-500">~/admin/restorations.queue</span>
        <span className="text-xs text-slate-500">{restorations.length} tasks</span>
      </div>
      {restorations.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">// no tasks</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-emerald-500/10 text-left text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">id</th>
                <th className="px-4 py-3">user</th>
                <th className="px-4 py-3">scene</th>
                <th className="px-4 py-3">status</th>
                <th className="px-4 py-3 text-right">price</th>
                <th className="px-4 py-3">created</th>
              </tr>
            </thead>
            <tbody>
              {restorations.map((r) => (
                <tr key={r.id} className="border-b border-emerald-500/5 text-slate-300 transition hover:bg-emerald-500/5">
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                    {r.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                    {r.user_id?.slice(0, 8) || "guest"}…
                  </td>
                  <td className="px-4 py-3 text-slate-400">{r.scene_id}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400">¥{(r.price / 100).toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(r.created_at).toLocaleString("zh-CN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    processing: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    failed: "border-red-500/40 bg-red-500/10 text-red-400",
  }[status] || "border-slate-700 text-slate-400"

  return (
    <span className={`inline-block border px-2 py-0.5 text-[10px] font-medium ${styles}`}>
      {status.toUpperCase()}
    </span>
  )
}