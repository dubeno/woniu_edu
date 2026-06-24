import { blogPosts } from '~/data/blog'
import { courses } from '~/data/courses'

const SITE_URL = 'https://woniu-ai.dev'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  const urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }> = [
    { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: 1 },
    { loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/courses`, changefreq: 'weekly', priority: 0.9 },
  ]

  for (const post of blogPosts) {
    urls.push({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: post.publishedAt,
      changefreq: 'monthly',
      priority: 0.8,
    })
  }

  for (const course of courses) {
    urls.push({
      loc: `${SITE_URL}/courses/${course.slug}`,
      changefreq: 'monthly',
      priority: 0.7,
    })
    if (course.freeLessonId) {
      urls.push({
        loc: `${SITE_URL}/courses/${course.slug}/learn/${course.freeLessonId}`,
        priority: 0.6,
      })
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ''}${u.priority ? `\n    <priority>${u.priority}</priority>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>`

  return body
})
