import { renderMarkdown } from '~/lib/markdown'

interface MarkdownContentProps {
  markdown: string
  className?: string
}

export function MarkdownContent({ markdown, className = '' }: MarkdownContentProps) {
  const html = renderMarkdown(markdown)
  return (
    <article
      className={`prose prose-slate max-w-none prose-headings:text-gray-900 prose-a:text-indigo-600 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
