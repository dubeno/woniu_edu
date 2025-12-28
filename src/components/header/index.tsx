import { Link, useNavigate } from "@tanstack/react-router"
import { useState, useRef, useEffect } from "react"
import { useLogin } from "~/hooks/useLogin"

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
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center rounded-lg shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
            {/* Wow Logo - 惊叹波形 */}
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 40 40" fill="none">
              <path d="M20 5 L20 15 M20 25 L20 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M10 20 L15 20 L25 20 L30 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="2" fill="currentColor"/>
            </svg>
          </div>
          <div className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Wow</div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group"
          >
            工作台
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/blog" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group"
          >
            博客
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {loggedIn ? (
            <>
              {/* 积分显示 */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-blue-600">{userInfo.credits ?? 0}</span>
                <span className="text-xs text-blue-500">积分</span>
              </div>
              
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {userInfo.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt={userInfo.username || "用户"}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                      {userInfo.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm text-gray-700">
                    {userInfo.username || "用户"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${showMenu ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">积分余额</p>
                      <p className="text-lg font-bold text-blue-600">{userInfo.credits ?? 0} 积分</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        个人中心
                      </div>
                    </Link>
                    {userInfo.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium border-t border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          管理后台
                        </div>
                      </Link>
                    )}
                    <button
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
            </>
          ) : (
            <button
              onClick={() => navigate({ to: "/login" })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              登录
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
