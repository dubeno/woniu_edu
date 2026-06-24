export interface CourseLesson {
  id: string
  title: string
  duration?: string
  preview?: boolean
  /** Markdown 免费讲义课时 */
  freeMarkdown?: boolean
}

export interface CourseChapter {
  id: string
  title: string
  duration?: string
  lessons: CourseLesson[]
}

export interface CoursePlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  benefits: string[]
}

export interface CourseReview {
  id: string
  author: string
  date: string
  rating: number
  content: string
}

export interface CourseFAQ {
  question: string
  answer: string
}

export interface Instructor {
  name: string
  title: string
  highlights: string
  bio: string
  avatarUrl?: string
}

export interface Course {
  slug: string
  title: string
  seoTitle: string
  badge?: string
  coverImage: string
  description: string
  learningObjectives: string[]
  lectureCount: number
  totalDuration: string
  rating: number
  reviewCount: number
  instructor: Instructor
  chapters: CourseChapter[]
  plans: CoursePlan[]
  faqs: CourseFAQ[]
  reviews: CourseReview[]
  /** Sidebar / purchase card bullet points */
  includes: string[]
  /** SEO 搜索词 */
  seoKeywords: string[]
  /** 求职痛点（页面展示 + GEO） */
  painPoints: string[]
  /** 生成式搜索 / 摘要用一段话 */
  geoSummary: string
  /** 免费 Markdown 讲义 id */
  freeLessonId: string
}

export interface CartItem {
  courseSlug: string
  planId: string
  title: string
  planName: string
  price: number
}
