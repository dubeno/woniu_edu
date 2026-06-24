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

  return (
    <div className="min-h-full bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">个人中心</h1>
        <p className="mt-2 text-sm text-gray-500">{brand.name}</p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">用户名</dt>
            <dd className="font-medium text-gray-900">{userInfo.username || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">角色</dt>
            <dd className="font-medium text-gray-900">{userInfo.role || 'student'}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/courses"
            className="rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-500"
          >
            浏览课程
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-gray-300 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}
