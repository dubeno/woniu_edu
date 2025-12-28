import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { useLogin, jwtAtom } from "~/hooks/useLogin"
import { myFetch } from "~/utils"

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const { loggedIn, userInfo, logout, fetchUserInfo } = useLogin()
  const [jwt] = useAtom(jwtAtom) // 使用atom而不是直接从localStorage读取
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12 // 每页显示12条
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!loggedIn) {
      navigate({ to: "/login" })
      return
    }

    // 等待用户信息加载完成
    if (!userInfo?.id) {
      // 如果loggedIn为true但没有userInfo.id，可能是还在加载中
      // 设置一个超时，避免无限等待
      const timeout = setTimeout(() => {
        if (!userInfo?.id) {
          setError("用户信息加载失败，请重新登录")
          setLoading(false)
        }
      }, 3000)
      return () => clearTimeout(timeout)
    }

    // 获取历史记录
    const fetchHistory = async () => {
      try {
        setError(null)
        setLoading(true)
        // 使用atom中的jwt值，而不是直接从localStorage读取（避免JSON序列化问题）
        if (!jwt) {
          setError("未找到登录凭证，请重新登录")
          setLoading(false)
          return
        }
        
        console.log("获取历史记录，用户ID:", userInfo.id, "JWT存在:", !!jwt)
        const history = await myFetch("/api/history", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })
        console.log("历史记录响应:", history)
        setHistory(Array.isArray(history) ? history : [])
        setError(null) // 成功时清除错误
      } catch (error: any) {
        console.error("获取历史记录失败:", error)
        // 如果是401，可能是token过期，尝试重新获取用户信息
        if (error.statusCode === 401) {
          console.warn("历史记录API返回401，尝试重新验证token")
          // 触发重新验证token
          try {
            await fetchUserInfo()
            // 如果重新验证成功，重试获取历史记录
            const retryHistory = await myFetch("/api/history", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${jwt}`
              }
            })
            setHistory(Array.isArray(retryHistory) ? retryHistory : [])
            setError(null)
          } catch (retryError: any) {
            // 如果重新验证也失败，说明token确实过期了
            console.error("重新验证token失败:", retryError)
            setError("登录已过期，请重新登录")
          }
        } else {
          const errorMessage = error.data?.message || error.message || "获取历史记录失败，请稍后重试"
          setError(errorMessage)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [loggedIn, navigate, userInfo?.id])

  // 分页计算
  const totalPages = Math.ceil(history.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentHistory = history.slice(startIndex, endIndex)

  if (!loggedIn) {
    return null
  }

  return (
    <>
      {/* Lightbox for Image Preview */}
      {lightboxUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] group">
            <img
              src={lightboxUrl}
              alt="生成结果"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
          </div>
          
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">用户信息</h2>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">用户名：</span>
                    {userInfo.username || "未设置"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">邮箱：</span>
                    {userInfo.email || "未设置"}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium text-gray-700">积分：</span>
                    <span className="font-bold text-gray-900">{userInfo.credits ?? 0}</span>
                    <span className="text-gray-600 ml-2">积分</span>
                  </p>
                  {userInfo.role === "admin" && (
                    <p className="text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        管理员
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {userInfo.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    管理后台
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  退出登录
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">生成历史</h2>
                {history.length > 0 && (
                  <span className="text-sm text-gray-500">
                    共 {history.length} 条记录
                  </span>
                )}
              </div>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <p className="text-sm text-red-800">{error}</p>
                  {error.includes("登录") && (
                    <button
                      onClick={() => navigate({ to: "/login" })}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      去登录
                    </button>
                  )}
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">加载中...</div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>暂无历史记录</p>
                  <button
                    onClick={() => navigate({ to: "/" })}
                    className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    去生成图片
                  </button>
                </div>
              ) : (
                <>
                  {/* 表格布局 - 更紧凑，适合大量记录 */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预览</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">场景</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentHistory.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => navigate({ to: `/scene/${item.scene_id}` })}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                {(item.restored_url || (item.restored_urls && item.restored_urls.length > 0)) ? (
                                  <img
                                    src={item.restored_url || item.restored_urls[0]}
                                    alt="生成结果"
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setLightboxUrl(item.restored_url || item.restored_urls[0])
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs bg-gray-50">
                                    {item.status === "processing" ? "处理中" : "未完成"}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.scene_id}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {item.status === "completed" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  已完成
                                </span>
                              ) : item.status === "processing" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                  处理中
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-300 text-gray-900">
                                  未完成
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(item.created_at).toLocaleString("zh-CN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {(item.restored_url || (item.restored_urls && item.restored_urls.length > 0)) ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setLightboxUrl(item.restored_url || item.restored_urls[0])
                                  }}
                                  className="text-gray-700 hover:text-gray-900 font-medium"
                                >
                                  查看
                                </button>
                              ) : (
                                <span className="text-gray-500 text-sm">无结果</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 分页控件 */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        显示第 {startIndex + 1} - {Math.min(endIndex, history.length)} 条，共 {history.length} 条
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          上一页
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                              pageNum = i + 1
                            } else if (currentPage <= 3) {
                              pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i
                            } else {
                              pageNum = currentPage - 2 + i
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                  currentPage === pageNum
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          })}
                        </div>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          下一页
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
