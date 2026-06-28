import { useEffect } from 'react'
import type { BlogPost } from '~/data/blog'

const SITE_URL = 'https://woniu-ai.dev'
const SITE_NAME = '蜗牛AI'
const SITE_DESCRIPTION =
  '蜗牛AI · FDE / AI Infra / Agent 三大纵深实战课，配套项目植入、简历三件套、模拟面试与1v1求职陪跑，冲刺 AI 大厂与独角兽 Offer。'
const SITE_LOCALE = 'zh_CN'

export const SEO = {
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  siteDescription: SITE_DESCRIPTION,
  siteLocale: SITE_LOCALE,
  twitterHandle: '@woniu_ai',
  ogImage: `${SITE_URL}/og-default.png`,
} as const

export const KEYWORDS = {
  /** 首页 / 通用 — 命中"AI 课程/求职/面试/项目/面经"五大搜索簇 */
  home: [
    'AI 课程', 'AI 求职', 'AI 面试', 'AI 面经', 'AI 项目',
    'AI 工程师', 'AI 大厂面试', 'AI 培训', 'AI 系统设计',
    'FDE 课程', 'AI Infra 课程', 'Agent 课程',
    'FDE 求职', 'AI Infra 面试', 'Agent 工程师',
    '简历优化', '模拟面试', '1v1 求职陪跑',
    'OpenAI 面试', 'Anthropic 面试', '字节 AI 面试', '阿里 AI 面试', '腾讯 AI 面试',
  ],
  /** 课程目录页 */
  courses: [
    'FDE 课程', 'AI Infra 课程', 'Agent 课程', 'LLM 课程',
    'AI 工程师培训', 'AI 系统设计面试', 'AI 简历模板', 'AI 项目实战',
    'vLLM 教程', 'SGLang 教程', 'CUDA 算子开发', '推理优化',
    'RAG 实战', 'Function Calling 教程', 'Prompt Engineering 课程',
  ],
  /** 1v1 求职陪跑页 */
  services: [
    'AI 求职陪跑', '1v1 模拟面试', 'AI 简历优化', 'AI 简历模板',
    'AI 面试辅导', 'AI 大厂内推', 'AI 面试复盘', 'AI Offer 谈判',
    'AI 工程师求职规划', 'AI 跨岗跳槽',
    'AI 模拟面试服务', 'AI 求职教练',
  ],
  /** 课程详情（每门课细分） */
  courseDetail: {
    fde: [
      'FDE 实战', 'Forward Deployed Engineer 课程',
      'FDE 面试题', 'FDE 简历', 'FDE 客户叙事',
      'OpenAI FDE', 'Anthropic FDE', 'Palantir FDE',
      'POC 交付', 'Playbook', '客户对接',
    ],
    'ai-infra': [
      'AI Infra 实战', 'AI Infra 面试', 'AI Infra 简历',
      'vLLM 源码', 'SGLang 推理框架', 'CUDA 算子',
      '推理优化', 'LLM 推理工程师', '模型部署',
      'KV Cache 优化', 'DeepSeek 推理', '字节 AI Infra 面试',
    ],
    'ai-app': [
      'AI Agent 课程', 'AI 应用开发', 'LLM 应用工程师',
      'RAG 实战', 'Agent 编排', 'Function Calling',
      'MCP 协议', 'Prompt Engineering', 'LangChain 实战',
      'AI 应用面试', 'AI 应用简历',
    ],
  },
  /** 求职专栏 / 博客 */
  blog: [
    'AI 求职经验', 'AI 面试经验', 'AI 面经',
    'AI 工程师简历', 'AI 系统设计面经',
    'FDE 面经', 'AI Infra 面经', 'Agent 面经',
    'AI 大厂面试真题', 'AI 求职规划',
    'AI 转码', 'AI 跳槽', 'AI 求职时间线',
  ],
} as const

interface SeoInput {
  title: string
  description: string
  keywords: string[]
  path: string
  image?: string
  /** JSON-LD 结构化数据，可传单个或多个 */
  jsonLd?: object | object[]
  type?: 'website' | 'article' | 'product'
  /** 文章 published time (article type) */
  publishedTime?: string
  /** 文章 modified time */
  modifiedTime?: string
}

/** 通用页面 SEO：title / meta description / keywords / OG / Twitter / canonical / JSON-LD */
export function useSeo(input: SeoInput | null): void {
  useEffect(() => {
    if (!input) return

    const url = `${SEO.siteUrl}${input.path}`
    const image = input.image ?? SEO.ogImage
    const ogType = input.type ?? 'website'

    document.title = input.title

    setMeta('description', input.description)
    setMeta('keywords', input.keywords.join(', '))
    setMeta('author', SEO.siteName)

    // Open Graph
    setMeta('og:title', input.title, 'property')
    setMeta('og:description', input.description, 'property')
    setMeta('og:type', ogType, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:image', image, 'property')
    setMeta('og:site_name', SEO.siteName, 'property')
    setMeta('og:locale', SEO.siteLocale, 'property')
    if (input.publishedTime) setMeta('article:published_time', input.publishedTime, 'property')
    if (input.modifiedTime) setMeta('article:modified_time', input.modifiedTime, 'property')

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', input.title, 'name')
    setMeta('twitter:description', input.description, 'name')
    setMeta('twitter:image', image, 'name')
    setMeta('twitter:site', SEO.twitterHandle, 'name')

    setLink('canonical', url)

    // JSON-LD
    if (input.jsonLd) {
      const ldArray = Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd]
      setJsonLd(`seo-jsonld-${input.path}`, ldArray)
    } else {
      removeJsonLd(`seo-jsonld-${input.path}`)
    }
  }, [
    input?.title,
    input?.description,
    input?.path,
    input?.image,
    input?.type,
    input?.publishedTime,
    input?.modifiedTime,
  ])
}

export function useBlogSeo(input: Omit<SeoInput, 'image' | 'jsonLd' | 'type'> | null): void {
  useSeo(input ?? null)
}

export function useCourseSeo(course: {
  title: string
  description: string
  seoKeywords: string[]
  slug: string
}): void {
  useBlogSeo({
    title: `${course.title} · 蜗牛AI`,
    description: course.description,
    keywords: course.seoKeywords,
    path: `/courses/${course.slug}`,
  })
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name'): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const JSONLD_PREFIX = 'seo-jsonld-'
function setJsonLd(id: string, data: object[]): void {
  removeJsonLd(id)
  for (const d of data) {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.setAttribute('data-seo-id', id)
    s.text = JSON.stringify(d)
    document.head.appendChild(s)
  }
}
function removeJsonLd(id: string): void {
  document.head.querySelectorAll(`script[data-seo-id="${id}"]`).forEach(el => el.remove())
}

/* ───────────── JSON-LD 工厂 ───────────── */

export function organizationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SEO.siteName,
    url: SEO.siteUrl,
    description: SEO.siteDescription,
    inLanguage: 'zh-CN',
    sameAs: [],
  }
}

export function websiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO.siteName,
    url: SEO.siteUrl,
    description: SEO.siteDescription,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SEO.siteUrl}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function courseListJsonLd(courses: Array<{
  title: string
  description: string
  slug: string
  price: number
}>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SEO.siteName} 课程目录`,
    itemListElement: courses.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: courseJsonLd(c),
    })),
  }
}

export function courseJsonLd(course: {
  title: string
  description: string
  seoKeywords?: string[]
  slug: string
  price: number
}): object {
  const url = `${SEO.siteUrl}/courses/${course.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: { '@type': 'Organization', name: SEO.siteName, sameAs: SEO.siteUrl },
    url,
    keywords: course.seoKeywords?.join(', '),
    educationalCredentialAwarded: '结业证书（AI 大厂求职能力）',
    inLanguage: 'zh-CN',
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
      url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT12H',
      instructor: { '@type': 'Organization', name: SEO.siteName },
    },
  }
}

export function serviceJsonLd(service: {
  name: string
  description: string
  price: number
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    areaServed: { '@type': 'Country', name: 'CN' },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
    },
  }
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function articleJsonLd(post: BlogPost): object {
  const url = `${SEO.siteUrl}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    publisher: {
      '@type': 'Organization',
      name: SEO.siteName,
      logo: { '@type': 'ImageObject', url: `${SEO.siteUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.searchKeywords.join(', '),
    articleSection: post.category,
    inLanguage: 'zh-CN',
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SEO.siteUrl}${it.path}`,
    })),
  }
}