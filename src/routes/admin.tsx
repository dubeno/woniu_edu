import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

// Admin 后台体积最大（594 行），单独切 chunk；登录后按需加载
const AdminPage = lazy(() => import('./-admin-page'))

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})