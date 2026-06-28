const SITE_URL = 'https://woniu-ai.dev'

export default defineEventHandler((event) => {
  const body = `# 蜗牛AI · robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /profile
Disallow: /login
Disallow: /api/

# 主流搜索引擎
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /profile

User-agent: Bingbot
Allow: /
Disallow: /admin

# AI 爬虫（GPTBot / PerplexityBot / ClaudeBot）— GEO 收录
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot-Extended
Allow: /

# sitemap
Sitemap: ${SITE_URL}/sitemap.xml
`
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  return body
})