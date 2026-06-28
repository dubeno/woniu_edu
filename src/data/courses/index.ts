import type { Course } from '~/types/course'
import { aiAgentCourse } from './ai-agent'
import { aiInfraCourse } from './ai-infra'
import { fdeCourse } from './fde'

// 三门纵深课程：FDE · AI 应用（Agent）· AI Infra
export const courses: Course[] = [fdeCourse, aiInfraCourse, aiAgentCourse]

const courseRegistry: Record<string, Course> = Object.fromEntries(
  courses.map((c) => [c.slug, c]),
)

export function getCourseBySlug(slug: string): Course | undefined {
  return courseRegistry[slug]
}

export function toCourseListItem(c: Course) {
  const plan = c.plans[0]
  return {
    slug: c.slug,
    title: c.title,
    cover_image: c.coverImage,
    badge: c.badge,
    price: plan?.price ?? 0,
    original_price: plan?.originalPrice,
    lesson_count: c.lectureCount,
    total_duration: c.totalDuration,
  }
}

export const fallbackCourseList = courses.map(toCourseListItem)

/** 全部课程（含暂未上架） */
export const allCourses: Course[] = [fdeCourse, aiInfraCourse, aiAgentCourse]
