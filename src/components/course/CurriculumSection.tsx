import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { CourseChapter } from '~/types/course'

interface CurriculumSectionProps {
  courseSlug: string
  chapters: CourseChapter[]
  lectureCount: number
  totalDuration: string
}

function formatChapterLabel(chapter: CourseChapter) {
  const duration = chapter.duration ? ` · ${chapter.duration}` : ''
  return `${chapter.title}（${chapter.lessons.length} 课时${duration}）`
}

export function CurriculumSection({ courseSlug, chapters, lectureCount, totalDuration }: CurriculumSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(chapters.slice(0, 2).map(c => c.id)))

  const initialVisible = 4
  const visibleChapters = showAll ? chapters : chapters.slice(0, initialVisible)

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="mt-6 border border-white/10 bg-[#0d1220] p-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2
            className="text-xl font-semibold text-slate-100"
            style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", letterSpacing: "-0.02em" }}
          >
            课程大纲
          </h2>
          <p className="mt-1 text-xs text-white/40">
            共 {lectureCount} 课时 · 约 {totalDuration} · 点击章节展开课时
          </p>
        </div>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-300">
          curriculum
        </span>
      </div>

      <div className="mt-4 divide-y divide-white/5">
        {visibleChapters.map((chapter, idx) => {
          const isOpen = expanded.has(chapter.id)
          const order = String(chapters.indexOf(chapter) + 1).padStart(2, '0')
          return (
            <div key={chapter.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-2 py-4 text-left transition hover:bg-white/[0.02]"
                aria-expanded={isOpen}
                onClick={() => toggle(chapter.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-[10px] font-medium text-violet-200 ring-1 ring-violet-400/30">
                    {order}
                  </span>
                  <span className="text-sm font-medium text-slate-100">{formatChapterLabel(chapter)}</span>
                </div>
                <svg
                  className={`h-4 w-4 shrink-0 text-white/40 transition ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <ul className="space-y-1 px-2 pb-4">
                  {chapter.lessons.map(lesson => (
                    <li
                      key={lesson.id}
                      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/[0.03]"
                    >
                      <span className="text-slate-300">{lesson.title}</span>
                      <span className="flex shrink-0 items-center gap-2 text-white/40">
                        {lesson.duration && lesson.duration !== '0m' && <span className="text-xs">{lesson.duration}</span>}
                        {lesson.freeMarkdown
                          ? (
                              <Link
                                to="/courses/$slug/learn/$lessonId"
                                params={{ slug: courseSlug, lessonId: lesson.id }}
                                className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20"
                                onClick={e => e.stopPropagation()}
                              >
                                免费读
                              </Link>
                            )
                          : lesson.preview
                            ? (
                                <span className="rounded border border-violet-500/40 bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-300">
                                  试看
                                </span>
                              )
                            : (
                                <span className="rounded border border-white/15 px-2 py-0.5 text-xs text-white/50">
                                  正课
                                </span>
                              )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {!showAll && chapters.length > initialVisible && (
        <button
          type="button"
          className="mt-5 w-full rounded-full border border-white/15 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:bg-white/5"
          onClick={() => setShowAll(true)}
        >
          展开全部章节（共 {chapters.length} 章）
        </button>
      )}
    </section>
  )
}