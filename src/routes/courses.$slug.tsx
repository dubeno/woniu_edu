import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { getCourseBySlug } from '~/data/courses'
import { courseJsonLd, useCourseSeo } from '~/lib/seo'
import { PurchaseCard, MobilePurchaseBar, PurchaseActions } from '~/components/course/PurchaseCard'
import { CurriculumSection } from '~/components/course/CurriculumSection'
import { InstructorSection, ReviewsSection } from '~/components/course/InstructorSection'
import { CourseFAQSection } from '~/components/course/CourseFAQSection'
import { PainPointsSection } from '~/components/course/PainPointsSection'
import { CourseFooter } from '~/components/course/CourseFooter'

export const Route = createFileRoute('/courses/$slug')({
  component: CoursePage,
})

function CoursePage() {
  const { slug } = Route.useParams()
  const course = getCourseBySlug(slug)
  const plan = course?.plans[0]

  useCourseSeo(course ?? null)

  if (!course || !plan) {
    return <Navigate to="/courses" />
  }

  return (
    <div className="min-h-full bg-white pb-28 text-slate-900 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd(course)) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
        <main>
          {course.badge && (
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {course.badge}
            </span>
          )}

          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-900">
            {course.title}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white">
              W
            </div>
            <span>{course.instructor.name}</span>
          </div>

          <img
            src={course.coverImage}
            alt={course.title}
            className="mt-6 w-full rounded-2xl object-cover lg:hidden"
          />

          <div className="mt-6 space-y-3 lg:hidden">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              What's included
            </h4>
            <ul className="space-y-1">
              {course.includes.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  {item}
                </li>
              ))}
            </ul>
            <PurchaseActions course={course} plan={plan} />
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">课程简介</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{course.description}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">课程要点</h2>
            <ul className="mt-4 space-y-3">
              {course.learningObjectives.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <PainPointsSection course={course} />

          <CurriculumSection
            courseSlug={course.slug}
            chapters={course.chapters}
            lectureCount={course.lectureCount}
            totalDuration={course.totalDuration}
          />

          <InstructorSection instructor={course.instructor} />
          <CourseFAQSection faqs={course.faqs} />
          <ReviewsSection
            rating={course.rating}
            reviewCount={course.reviewCount}
            reviews={course.reviews}
          />
        </main>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <PurchaseCard course={course} />
          </div>
        </div>
      </div>

      <MobilePurchaseBar course={course} />
      <CourseFooter />
    </div>
  )
}
