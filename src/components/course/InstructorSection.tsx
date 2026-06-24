import { useState } from 'react'
import type { CourseReview, Instructor } from '~/types/course'

export function InstructorSection({ instructor }: { instructor: Instructor }) {
  return (
    <section className="py-8">
      <h2 className="text-xl font-bold text-gray-900">关于讲师</h2>
      <div className="mt-4 flex gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-teal-100 text-2xl">
          👩‍🏫
        </div>
        <div>
          <h5 className="font-bold text-gray-900">{instructor.name}</h5>
          <p className="text-sm text-gray-600">{instructor.title}</p>
          <p className="mt-2 text-sm text-gray-700">{instructor.highlights}</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{instructor.bio}</p>
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
    <section className="py-8">
      <h2 className="text-xl font-bold text-gray-900">学员评价</h2>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-900">{rating}</span>
        <span className="text-yellow-400">★★★★★</span>
        <span className="text-sm text-gray-500">{reviewCount} 条评价</span>
      </div>

      <ul className="mt-6 space-y-4">
        {visible.map((review) => (
          <li key={review.id} className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{review.author}</span>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
            <p className="mt-1 text-yellow-400 text-sm">{'★'.repeat(review.rating)}</p>
            <p className="mt-2 text-sm text-gray-600">{review.content}</p>
          </li>
        ))}
      </ul>

      {visibleCount < reviews.length && (
        <button
          type="button"
          className="mt-4 w-full rounded-full border border-gray-300 py-3 text-sm font-medium text-gray-700"
          onClick={() => setVisibleCount((c) => c + 8)}
        >
          加载更多评价
        </button>
      )}
    </section>
  )
}
