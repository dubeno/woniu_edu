export interface BlogPost {
  slug: string
  title: string
  description: string
  category: '求职痛点' | 'FDE' | 'AI Infra' | 'AI Agent' | '面试指南' | '转码'
  tags: string[]
  /** 痛点/常被搜的问题 — 同时作为 FAQ 段落 */
  painPoints: string[]
  /** 常见搜索词（用于 SEO/GEO 关键词云） */
  searchKeywords: string[]
  /** 文章内可触发的 CTA：免费讲义 / 微信咨询 */
  cta: {
    freeLessonSlug: string
    freeLessonId: string
    wechatTitle: string
  }
  /** 关联正课 slug */
  courseSlug: string
  /** 发表日期（ISO） */
  publishedAt: string
  /** 阅读时长（分钟） */
  readMinutes: number
  /** Markdown 文件名（无扩展名，相对于 ./posts） */
  markdownFile: string
}
