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
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 flex-shrink-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-600 to-teal-500 text-white flex items-center justify-center rounded-lg shadow-md text-lg">
            🐌
          </div>
          <div className="leading-tight">
            <div className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">{brand.name}</div>
            <div className="hidden text-xs text-gray-500 sm:block">{brand.shortName} 实战课</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/courses" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            全部课程
          </Link>
          <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            专栏
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {loggedIn
            ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-medium">
                      {userInfo.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:block text-sm text-gray-700">{userInfo.username || "用户"}</span>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        个人中心
                      </Link>
                      {userInfo.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium border-t border-gray-100"
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
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                      >
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              )
            : (
                <button
                  type="button"
                  onClick={() => navigate({ to: "/login" })}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
                >
                  登录
                </button>
              )}
        </div>
      </div>
    </header>
  )
}
