import fdeFree from './fde/free-intro.md?raw'
import aiInfraFree from './ai-infra/free-intro.md?raw'
import aiAgentFree from './ai-agent/free-intro.md?raw'

export const markdownLessons: Record<string, Record<string, string>> = {
  fde: { 'free-intro': fdeFree },
  'ai-infra': { 'free-intro': aiInfraFree },
  'ai-agent': { 'free-intro': aiAgentFree },
}

export function getMarkdownLesson(slug: string, lessonId: string): string | undefined {
  return markdownLessons[slug]?.[lessonId]
}

export function getFreeLessonId(_slug: string): string {
  return 'free-intro'
}
