import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useLogin } from "~/hooks/useLogin"
import { brand } from "~/config/brand"

export const Route = createFileRoute("/login")({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { loginWithPassword, register } = useLogin()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let result
      if (isRegister) {
        if (!email) {
          setError("请输入邮箱")
          setLoading(false)
          return
        }
        result = await register(username, email, password)
      } else {
        result = await loginWithPassword(username, password)
      }

      if (result.success) {
        navigate({ to: "/" })
      } else {
        setError(result.message || "操作失败")
      }
    } catch (err: any) {
      setError(err.message || "操作失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-[#07060a] px-4 py-16 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold">
              {brand.name[0]}
            </span>
            {brand.name}
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">
            {isRegister ? "创建账号" : "欢迎回来"}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {isRegister
              ? "几秒钟开通，解锁课程目录与学习进度同步"
              : "登录后访问已购课程与个人学习中心"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}

            <Field
              label="用户名"
              value={username}
              onChange={setUsername}
              placeholder={isRegister ? "woniu_2026" : "用户名或邮箱"}
              hint={isRegister ? "3-20 个字符" : undefined}
              autoComplete="username"
            />

            {isRegister && (
              <Field
                label="邮箱"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                autoComplete="email"
              />
            )}

            <Field
              label="密码"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              hint={isRegister ? "至少 6 个字符" : undefined}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
              ) : (
                <span>{isRegister ? "创建账号" : "登录"}</span>
              )}
              <span>→</span>
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/50">
            {isRegister ? (
              <>
                已有账号？{" "}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError("") }}
                  className="text-violet-300 transition hover:text-violet-200"
                >
                  直接登录
                </button>
              </>
            ) : (
              <>
                还没账号？{" "}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError("") }}
                  className="text-violet-300 transition hover:text-violet-200"
                >
                  创建一个
                </button>
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
          session jwt · expires 60d
        </p>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  hint?: string
  autoComplete?: string
}

function Field({ label, value, onChange, type = "text", placeholder, hint, autoComplete }: FieldProps) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-xs text-white/60">
        <span>{label}</span>
        {hint && <span className="text-white/30">{hint}</span>}
      </div>
      <input
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05]"
      />
    </label>
  )
}