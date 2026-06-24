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
    <section className="py-8">
      <h2 className="text-xl font-bold text-gray-900">
        课程大纲
        <span className="text-base font-normal text-gray-500">
          共
          {lectureCount}
          {' '}
          课时 · 约
          {totalDuration}
        </span>
      </h2>

      <div className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200">
        {visibleChapters.map(chapter => {
          const isOpen = expanded.has(chapter.id)
          return (
            <div key={chapter.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                aria-expanded={isOpen}
                onClick={() => toggle(chapter.id)}
              >
                <span className="font-medium text-gray-900">{formatChapterLabel(chapter)}</span>
                <svg
                  className={`h-5 w-5 shrink-0 text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <ul className="space-y-1 px-4 pb-4">
                  {chapter.lessons.map(lesson => (
                    <li
                      key={lesson.id}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{lesson.title}</span>
                      <span className="flex shrink-0 items-center gap-2 text-gray-400">
                        {lesson.duration && lesson.duration !== '0m' && <span>{lesson.duration}</span>}
                        {lesson.freeMarkdown
                          ? (
                              <Link
                                to="/courses/$slug/learn/$lessonId"
                                params={{ slug: courseSlug, lessonId: lesson.id }}
                                className="rounded border border-indigo-500 px-2 py-0.5 text-xs font-medium text-indigo-600"
                                onClick={e => e.stopPropagation()}
                              >
                                免费读
                              </Link>
                            )
                          : lesson.preview
                            ? (
                                <span className="rounded border border-indigo-500 px-2 py-0.5 text-xs font-medium text-indigo-600">
                                  试看
                                </span>
                              )
                            : (
                                <span className="rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-600">
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
          className="mt-4 w-full rounded-full border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => setShowAll(true)}
        >
          展开全部章节（共
          {chapters.length}
          {' '}
          章）
        </button>
      )}
    </section>
  )
}
