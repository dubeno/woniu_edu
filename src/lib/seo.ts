import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import type { BlogPost } from '~/data/blog'

const SITE_URL = 'https://woniu-ai.dev'
const SITE_NAME = '蜗牛AI'

interface SeoInput {
  title: string
  description: string
  keywords: string[]
  path: string
  image?: string
  jsonLd?: object
}

/** 通用页面 SEO：改写 <title>、<meta>、<link rel="canonical"> */
export function useSeo(input: SeoInput | null): void {
  useEffect(() => {
    if (!input) return

    document.title = input.title
    setMeta('description', input.description)
    setMeta('keywords', input.keywords.join(', '))
    setMeta('og:title', input.title, 'property')
    setMeta('og:description', input.description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:url', `${SITE_URL}${input.path}`, 'property')
    setMeta('og:image', input.image ?? `${SITE_URL}/og-default.png`, 'property')
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', input.title, 'name')
    setMeta('twitter:description', input.description, 'name')
    setLink('canonical', `${SITE_URL}${input.path}`)
  }, [input?.title, input?.description, input?.path])
}

export function useBlogSeo(input: Omit<SeoInput, 'image' | 'jsonLd'> | null): void {
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

/** 文章 JSON-LD（Article + FAQ Page）— 帮 Google / GPTBot / Perplexity 抓取 */
export function blogJsonLd(post: BlogPost): object {
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        keywords: post.searchKeywords.join(', '),
        articleSection: post.category,
      },
      {
        '@type': 'FAQPage',
        mainEntity: post.painPoints.map(q => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `本文针对「${q}」给出解法与对应免费讲义。详见蜗牛AI 求职专栏 ${url}`,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '蜗牛AI', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: '求职专栏', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  }
}

/** 课程 JSON-LD（Course） */
export function courseJsonLd(course: {
  title: string
  description: string
  seoKeywords: string[]
  slug: string
  price: number
}): object {
  const url = `${SITE_URL}/courses/${course.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: { '@type': 'Organization', name: SITE_NAME, sameAs: SITE_URL },
    url,
    keywords: course.seoKeywords.join(', '),
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
    },
  }
}
