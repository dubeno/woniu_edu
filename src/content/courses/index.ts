import fdeFree from './fde/free-intro.md?raw'
import aiInfraFree from './ai-infra/free-intro.md?raw'
import aiAgentFree from './ai-agent/free-intro.md?raw'
import agentPart1 from './ai-agent/part1_foundation.md?raw'
import agentPart2 from './ai-agent/part2_reasoning.md?raw'
import agentPart3 from './ai-agent/part3_memory_tools_rag.md?raw'
import agentPart4 from './ai-agent/part4_multiagent_production_security.md?raw'

export const markdownLessons: Record<string, Record<string, string>> = {
  fde: { 'free-intro': fdeFree },
  'ai-infra': { 'free-intro': aiInfraFree },
  'ai-agent': {
    'free-intro': aiAgentFree,
    'agent-5-1': agentPart1,
    'agent-5-2': agentPart2,
    'agent-5-3': agentPart3,
    'agent-5-4': agentPart4,
  },
}

export function getMarkdownLesson(slug: string, lessonId: string): string | undefined {
  return markdownLessons[slug]?.[lessonId]
}

export function getFreeLessonId(_slug: string): string {
  return 'free-intro'
}
