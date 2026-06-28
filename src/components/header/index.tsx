import { Link, useNavigate } from "@tanstack/react-router"
import { useState, useRef, useEffect } from "react"
import { useLogin } from "~/hooks/useLogin"
import { brand } from "~/config/brand"

export function Header() {
  const navigate = useNavigate()
  const { loggedIn, userInfo, logout } = useLogin()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#07060a]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
            {brand.name[0]}
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            {brand.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link to="/courses" className="text-white/60 transition hover:text-white">课程</Link>
          <Link to="/services" className="text-white/60 transition hover:text-white">求职陪跑</Link>
          <Link to="/blog" className="text-white/60 transition hover:text-white">专栏</Link>
        </nav>
        <div className="flex items-center gap-2">
          {loggedIn
            ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-sm transition hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-semibold text-white">
                      {(userInfo.username || "U")[0]?.toUpperCase()}
                    </div>
                    <span className="hidden text-xs text-white/80 sm:block">
                      {userInfo.username || "user"}
                    </span>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0e0b14]/95 py-1 shadow-2xl backdrop-blur">
                      <Link
                        to="/profile"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                      >
                        个人中心
                      </Link>
                      {userInfo.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowMenu(false)}
                          className="block border-t border-white/5 px-4 py-2 text-sm text-amber-300 transition hover:bg-amber-500/10"
                        >
                          管理后台
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setShowMenu(false)
                        }}
                        className="w-full border-t border-white/5 px-4 py-2 text-left text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
                      >
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              )
            : (
              <>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/login" })}
                  className="rounded-full px-4 py-1.5 text-sm text-white/70 transition hover:text-white"
                >
                  登录
                </button>
                <Link
                  to="/courses"
                  className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-violet-100"
                >
                  开始学习
                </Link>
              </>
            )}
        </div>
      </div>
    </header>
  )
}