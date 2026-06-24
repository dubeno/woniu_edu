import { useState } from 'react'
import type { CourseReview, Instructor } from '~/types/course'

export function InstructorSection({ instructor }: { instructor: Instructor }) {
  return (
    <section className="border-t border-slate-200 py-10">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">关于讲师</h2>
      <div className="mt-5 flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-900 text-base font-semibold text-white">
          W
        </div>
        <div>
          <h5 className="text-base font-semibold text-slate-900">{instructor.name}</h5>
          <p className="text-sm text-slate-500">{instructor.title}</p>
          <p className="mt-2 text-sm text-slate-700">{instructor.highlights}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{instructor.bio}</p>
        </div>
      </div>
    </section>
  )
}

interface ReviewsSectionProps {
  rating: number
  reviewCount: number
  reviews: CourseReview[]
}

export function ReviewsSection({ rating, reviewCount, reviews }: ReviewsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(8)
  const visible = reviews.slice(0, visibleCount)

  return (
    <section className="border-t border-slate-200 py-10">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">学员评价</h2>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-2xl font-semibold text-slate-900">{rating.toFixed(1)}</span>
        <span className="text-sm text-slate-500">
          / 5 · {reviewCount}
          {' '}
          reviews
        </span>
      </div>

      <ul className="mt-6 space-y-3">
        {visible.map((review) => (
          <li key={review.id} className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900">{review.author}</span>
              <span className="text-xs text-slate-400">{review.date}</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
              Rating {review.rating} / 5
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.content}</p>
          </li>
        ))}
      </ul>

      {visibleCount < reviews.length && (
        <button
          type="button"
          className="mt-5 w-full rounded-md border border-slate-300 py-3 text-sm font-medium text-slate-700 hover:border-slate-400"
          onClick={() => setVisibleCount((c) => c + 8)}
        >
          加载更多评价
        </button>
      )}
    </section>
  )
}
