import type { BlogPost } from './types'

import aiEngineerInterview from './posts/ai-engineer-interview-2026.md?raw'
import fdeJd from './posts/forward-deployed-engineer-job-description.md?raw'
import inferenceInterview from './posts/llm-inference-optimization-interview.md?raw'
import agentInterview from './posts/ai-agent-engineer-interview-mcp.md?raw'
import noInternship from './posts/no-internship-big-tech-ai.md?raw'
import systemDesign from './posts/ai-engineer-system-design-template.md?raw'

const markdownByFile: Record<string, string> = {
  'ai-engineer-interview-2026': aiEngineerInterview,
  'forward-deployed-engineer-job-description': fdeJd,
  'llm-inference-optimization-interview': inferenceInterview,
  'ai-agent-engineer-interview-mcp': agentInterview,
  'no-internship-big-tech-ai': noInternship,
  'ai-engineer-system-design-template': systemDesign,
}

export function getBlogMarkdown(post: BlogPost): string {
  return markdownByFile[post.markdownFile] ?? ''
}
