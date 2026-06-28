import type { BlogPost } from './types'

// 求职专栏 Markdown 按需加载：每篇文章独立 chunk
type MarkdownModule = { default: string }

const postGlob = import.meta.glob<MarkdownModule>(
  './posts/*.md',
  { query: '?raw', import: 'default', eager: false },
)

export function getBlogMarkdown(post: BlogPost): Promise<string> {
  const loader = postGlob[`./posts/${post.markdownFile}.md`]
  if (!loader) return Promise.resolve('')
  return loader().then(mod => mod.default)
}