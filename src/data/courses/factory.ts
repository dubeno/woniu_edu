import type { Course, CourseChapter, CourseFAQ, CoursePlan, Instructor } from '~/types/course'

export function chapter(
  id: string,
  title: string,
  lessons: { title: string; duration?: string; preview?: boolean; freeMarkdown?: boolean; lessonId?: string }[],
  duration?: string,
): CourseChapter {
  return {
    id,
    title,
    duration,
    lessons: lessons.map((l, i) => ({
      id: l.lessonId ?? (l.freeMarkdown ? 'free-intro' : `${id}-${i + 1}`),
      title: l.title,
      duration: l.duration ?? '18m',
      preview: l.preview,
      freeMarkdown: l.freeMarkdown,
    })),
  }
}

export function countLessons(chapters: CourseChapter[]): number {
  return chapters.reduce((n, ch) => n + ch.lessons.length, 0)
}

export function estimateDuration(chapters: CourseChapter[]): string {
  const mins = chapters.reduce(
    (total, ch) =>
      total +
      ch.lessons.reduce((n, l) => {
        const m = l.duration?.match(/(\d+)/)
        return n + (m ? Number(m[1]) : 18)
      }, 0),
    0,
  )
  const hours = Math.floor(mins / 60)
  const rest = mins % 60
  if (hours === 0) return `${rest} 分钟`
  if (rest === 0) return `${hours} 小时`
  return `${hours} 小时 ${rest} 分钟`
}

export const instructor: Instructor = {
  name: '蜗牛AI',
  title: 'AI 工程 · 求职辅导',
  highlights: 'FDE 交付 · 推理优化 · Agent 实战 · 留学生/转码求职',
  bio: '蜗牛AI 专注 AI 工程能力与求职叙事：帮学员把项目经历讲成 Offer 故事，配套免费 Markdown 讲义与微信 1v1 咨询。',
}

export const defaultIncludes = ['完整视频课', 'Markdown 讲义', '微信答疑', '求职项目模板']

export function defaultFaqs(courseTitle: string): CourseFAQ[] {
  return [
    {
      question: `${courseTitle} 适合谁？`,
      answer:
        '适合有工程基础、希望系统补齐某一方向能力的开发者与 Tech Lead。需要能写代码、读文档，不要求算法博士背景。',
    },
    {
      question: '可以试看吗？',
      answer: '每门课均开放部分试看课时，可在课程大纲中直接播放，满意后再购买。',
    },
    {
      question: '如何报名？',
      answer: '点击「微信咨询」扫码添加助教，免费领取资料并咨询报名。确认后开通正课权限。',
    },
    {
      question: '支持退款吗？',
      answer: '未观看正课且未下载资料的情况下，7 天内可申请全额退款，请联系客服邮箱。',
    },
    {
      question: '找不到答案？',
      answer: '课程咨询请发邮件至 support@opcstore.dev，1–2 个工作日内回复。',
    },
  ]
}

export function defaultPlan(price: number, originalPrice?: number): CoursePlan {
  return {
    id: 'standard',
    name: '标准版',
    price,
    originalPrice,
    benefits: defaultIncludes,
  }
}

export interface BuildCourseInput {
  slug: string
  title: string
  seoTitle: string
  badge?: string
  coverImage: string
  description: string
  learningObjectives: string[]
  chapters: CourseChapter[]
  price: number
  originalPrice?: number
  reviews?: Course['reviews']
  seoKeywords: string[]
  painPoints: string[]
  geoSummary: string
  freeLessonId?: string
}

export function buildCourse(input: BuildCourseInput): Course {
  const lectureCount = countLessons(input.chapters)
  return {
    slug: input.slug,
    title: input.title,
    seoTitle: input.seoTitle,
    badge: input.badge,
    coverImage: input.coverImage,
    description: input.description,
    learningObjectives: input.learningObjectives,
    lectureCount,
    totalDuration: estimateDuration(input.chapters),
    rating: 5,
    reviewCount: input.reviews?.length ?? 12,
    instructor,
    chapters: input.chapters,
    plans: [defaultPlan(input.price, input.originalPrice)],
    includes: defaultIncludes,
    faqs: defaultFaqs(input.seoTitle),
    seoKeywords: input.seoKeywords,
    painPoints: input.painPoints,
    geoSummary: input.geoSummary,
    freeLessonId: input.freeLessonId ?? 'free-intro',
    reviews: input.reviews ?? [
      {
        id: '1',
        author: '陈工',
        date: '2026/03/10',
        rating: 5,
        content: '结构清晰，直接能带回团队落地。',
      },
      {
        id: '2',
        author: '王同学',
        date: '2026/03/05',
        rating: 5,
        content: '比碎片化博客系统很多，案例贴近真实交付。',
      },
    ],
  }
}
