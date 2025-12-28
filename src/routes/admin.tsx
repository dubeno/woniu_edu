import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { jwtAtom } from "~/hooks/useLogin"
import { myFetch } from "~/utils"
import { InputModal, ConfirmModal } from "~/components/Modal"

export const Route = createFileRoute("/admin")({
  component: AdminPage,
})

function AdminPage() {
  const navigate = useNavigate()
  const [jwt] = useAtom(jwtAtom)
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "credits" | "credit-history" | "restorations">("dashboard")
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [restorations, setRestorations] = useState<any[]>([])
  const [creditHistory, setCreditHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
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

      const headers = {
        Authorization: `Bearer ${jwt}`
      }

      if (activeTab === "dashboard") {
        const statsData = await myFetch("/api/admin/stats", { headers })
        setStats(statsData)
      } else if (activeTab === "users") {
        const usersData = await myFetch("/api/admin/users", { headers })
        setUsers(usersData.users || [])
      } else if (activeTab === "credits") {
        const usersData = await myFetch("/api/admin/users", { headers })
        setUsers(usersData.users || [])
      } else if (activeTab === "credit-history") {
        const historyData = await myFetch("/api/admin/credit-history", { headers })
        setCreditHistory(historyData.history || [])
      } else if (activeTab === "restorations") {
        const restorationsData = await myFetch("/api/admin/restorations", { headers })
        setRestorations(restorationsData.restorations || [])
      }
    } catch (err: any) {
      if (err.statusCode === 403) {
        setError("您没有管理员权限")
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
      
      const actionText = action === "add" ? "充值" : action === "set" ? "设置" : "扣除"
      setSuccessMessage(`成功${actionText} ${amount} 积分！`)
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
    setInputModal({
      isOpen: true,
      title,
      message,
      placeholder,
      type,
      onConfirm,
      confirmColor,
    })
  }

  if (!jwt) {
    return null
  }

  if (error && error.includes("管理员权限")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">访问被拒绝</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">如何设置管理员？</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>注册一个账号（如果还没有）</li>
              <li>获取你的用户ID（从个人中心或注册响应中）</li>
              <li>在项目根目录的 <code className="bg-blue-100 px-1 rounded">.env</code> 文件中添加：<br/>
                <code className="bg-gray-100 px-2 py-1 rounded block mt-1">ADMIN_USERS=你的用户ID或用户名</code>
              </li>
              <li>重启服务器</li>
              <li>使用该账号登录后重新访问此页面</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              <strong>提示：</strong> 支持多个管理员，用逗号分隔，例如：<br/>
              <code>ADMIN_USERS=user-id-1,user-id-2,admin-username</code>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate({ to: "/login" })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              去登录/注册
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}
      
      {/* Input Modal */}
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
      
      {/* Confirm Modal */}
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
      
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">管理后台</h1>
            <button
              onClick={() => navigate({ to: "/" })}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              返回首页
            </button>
          </div>
          <nav className="flex space-x-1 p-1.5">
            {(["dashboard", "users", "credits", "credit-history", "restorations"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-md font-medium text-sm transition-all ${
                  activeTab === tab
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab === "dashboard" ? "仪表盘" : tab === "users" ? "用户管理" : tab === "credits" ? "积分管理" : tab === "credit-history" ? "积分记录" : "生成记录"}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            {error}
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">总用户数</h3>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">总生成数</h3>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalRestorations || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">已完成</h3>
                      <p className="text-3xl font-bold text-gray-900">{stats.completedRestorations || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">近7天新用户</h3>
                      <p className="text-3xl font-bold text-gray-900">{stats.newUsersLast7Days || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">近7天新生成</h3>
                      <p className="text-3xl font-bold text-gray-900">{stats.newRestorationsLast7Days || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                {users.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">暂无用户数据</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">积分</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username || "未设置"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || "未设置"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.credits || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.created ? new Date(user.created).toLocaleString("zh-CN") : "未知"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link
                                to="/admin"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setActiveTab("credits")
                                }}
                                className="text-gray-700 hover:text-gray-900 font-medium"
                              >
                                管理积分
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "credits" && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">积分管理</h2>
                  <p className="mt-1 text-sm text-gray-600">为用户充值、设置或扣除积分（目前未对接支付系统，仅支持手动操作）</p>
                </div>
                {users.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">暂无用户数据</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户名</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前积分</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username || "未设置"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || "未设置"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-lg font-bold text-gray-900">{user.credits || 0}</span>
                              <span className="text-sm text-gray-500 ml-1">积分</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    showInputModal(
                                      "充值积分",
                                      `为用户 ${user.username || user.email} 充值积分`,
                                      "请输入积分数量（正整数）",
                                      "number",
                                      (value) => {
                                        const amount = Number(value)
                                        if (amount > 0) {
                                          handleCreditsAction(user.id, "add", amount)
                                        }
                                      },
                                      "blue"
                                    )
                                  }}
                                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    充值
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    showInputModal(
                                      "设置积分",
                                      `设置用户 ${user.username || user.email} 的积分`,
                                      "请输入积分数量（非负整数）",
                                      "number",
                                      (value) => {
                                        const amount = Number(value)
                                        if (amount >= 0) {
                                          handleCreditsAction(user.id, "set", amount)
                                        }
                                      },
                                      "green"
                                    )
                                  }}
                                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    设置
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    showInputModal(
                                      "扣除积分",
                                      `扣除用户 ${user.username || user.email} 的积分`,
                                      "请输入积分数量（正整数）",
                                      "number",
                                      (value) => {
                                        const amount = Number(value)
                                        if (amount > 0) {
                                          handleCreditsAction(user.id, "deduct", amount)
                                        }
                                      },
                                      "red"
                                    )
                                  }}
                                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors shadow-sm hover:shadow-md"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                    扣除
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "credit-history" && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">积分变更记录</h2>
                  <p className="mt-1 text-sm text-gray-600">查看所有用户的积分变更历史，便于追踪和审计</p>
                </div>
                {creditHistory.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">暂无积分变更记录</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作类型</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变更金额</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变更前</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变更后</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">原因</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作人</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {creditHistory.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(record.created_at).toLocaleString("zh-CN")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono text-xs">
                              {record.user_id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                record.action === "add" ? "bg-gray-100 text-gray-700" :
                                record.action === "deduct" ? "bg-gray-200 text-gray-800" :
                                "bg-gray-300 text-gray-900"
                              }`}>
                                {record.action === "add" ? "充值" : record.action === "deduct" ? "扣除" : "设置"}
                              </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              record.action === "add" ? "text-gray-700" :
                              record.action === "deduct" ? "text-gray-600" :
                              "text-gray-800"
                            }`}>
                              {record.action === "add" ? "+" : record.action === "deduct" ? "-" : ""}{record.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.balance_before}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.balance_after}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{record.reason}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.operator_type === "admin" ? "管理员" : "系统"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "restorations" && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">场景</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {restorations.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{r.id.substring(0, 8)}...</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{r.user_id?.substring(0, 8) || "未登录"}...</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.scene_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              r.status === "completed" ? "bg-gray-100 text-gray-700" :
                              r.status === "processing" ? "bg-gray-200 text-gray-800" :
                              "bg-gray-300 text-gray-900"
                            }`}>
                              {r.status === "completed" ? "已完成" : r.status === "processing" ? "处理中" : "失败"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.price / 100}元</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(r.created_at).toLocaleString("zh-CN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  )
}
