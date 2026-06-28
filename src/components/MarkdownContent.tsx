import { renderMarkdown } from '~/lib/markdown'

interface MarkdownContentProps {
  markdown: string
  className?: string
}

export function MarkdownContent({ markdown, className = '' }: MarkdownContentProps) {
  const html = renderMarkdown(markdown)
  return (
    <article
      className={`prose prose-invert prose-emerald max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-a:text-emerald-400 prose-strong:text-slate-100 prose-li:text-slate-300 prose-code:text-emerald-400 prose-code:bg-emerald-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0a0f1c] prose-pre:border prose-pre:border-emerald-500/20 prose-blockquote:border-emerald-500/40 prose-blockquote:text-slate-400 prose-hr:border-emerald-500/10 prose-table:text-sm prose-th:text-slate-100 prose-td:text-slate-300 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}