import { allCourses } from '../../src/data/courses'
import { blogPosts } from '../../src/data/blog'

const SITE_URL = 'https://woniu-ai.dev'

export default defineEventHandler((event) => {
  const urls: Array<{ loc: string; lastmod?: string; priority: number; changefreq: string }> = []

  // 静态页
  urls.push({ loc: `${SITE_URL}/`, changefreq: 'weekly', priority: 1.0 })
  urls.push({ loc: `${SITE_URL}/courses`, changefreq: 'weekly', priority: 0.9 })
  urls.push({ loc: `${SITE_URL}/services`, changefreq: 'weekly', priority: 0.9 })
  urls.push({ loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: 0.9 })
  urls.push({ loc: `${SITE_URL}/login`, changefreq: 'monthly', priority: 0.3 })

  // 课程详情
  for (const c of allCourses) {
    urls.push({
      loc: `${SITE_URL}/courses/${c.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    })
    // 免费讲义
    if (c.freeLessonId) {
      urls.push({
        loc: `${SITE_URL}/courses/${c.slug}/learn/${c.freeLessonId}`,
        changefreq: 'monthly',
        priority: 0.7,
      })
    }
  }

  // 博客文章
  for (const p of blogPosts) {
    urls.push({
      loc: `${SITE_URL}/blog/${p.slug}`,
      lastmod: p.publishedAt,
      changefreq: 'monthly',
      priority: 0.7,
    })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return xml
})