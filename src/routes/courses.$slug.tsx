import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

// 课程详情页：拖入 7 个课程子组件，按路由切 chunk
const CoursePage = lazy(() => import('./-course-detail-page'))

export const Route = createFileRoute('/courses/$slug')({
  component: CoursePage,
})