import { useState } from 'react'
import type { CourseFAQ } from '~/types/course'

interface CourseFAQSectionProps {
  faqs: CourseFAQ[]
}

export function CourseFAQSection({ faqs }: CourseFAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold text-gray-900">常见问题</h2>
      <p className="mt-2 text-sm text-gray-600">
        购买前如有疑问，可以先看看下面这些大家最关心的问题。
      </p>

      <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div key={faq.question}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
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
                <div className="whitespace-pre-line px-4 pb-4 text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
