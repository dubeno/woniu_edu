// 课程讲义按需加载：每个 .md 文件成为独立 chunk，仅在打开对应路由时下载
type MarkdownModule = { default: string }

const lessonGlob = import.meta.glob<MarkdownModule>(
  './*/*.md',
  { query: '?raw', import: 'default', eager: false },
)

export function getMarkdownLesson(slug: string, lessonId: string): Promise<string | undefined> {
  const loader = lessonGlob[`./${slug}/${lessonId}.md`]
  if (!loader) return Promise.resolve(undefined)
  return loader().then(mod => mod.default)
}

export function getFreeLessonId(_slug: string): string {
  return 'free-intro'
}