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

  useCourseSeo(course ?? null, `/courses/${slug}`)

  if (!course || !plan) {
    return <Navigate to="/courses" />
  }

  return (
    <div className="min-h-full bg-white pb-28 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd(course)) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:py-8">
        <main>
          {course.badge && (
            <span className="inline-block rounded bg-emerald-400 px-2 py-0.5 text-xs font-medium text-white">
              {course.badge}
            </span>
          )}

          <h1 className="mt-3 text-2xl font-bold leading-snug text-gray-900 lg:text-3xl">{course.title}</h1>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm">🐌</div>
            <span className="text-sm font-medium text-gray-700">{course.instructor.name}</span>
          </div>

          <img src={course.coverImage} alt={course.title} className="mt-6 w-full rounded-xl object-cover lg:hidden" />

          <div className="mt-6 space-y-3 lg:hidden">
            <h4 className="font-semibold text-gray-900">本课程包含：</h4>
            <ul className="space-y-1">
              {course.includes.map(item => (
                <li key={item} className="text-sm text-gray-700">
                  ✓
                  {item}
                </li>
              ))}
            </ul>
            <PurchaseActions course={course} plan={plan} />
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900">课程简介</h2>
            <p className="mt-2 text-gray-600">{course.description}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900">课程要点</h2>
            <ul className="mt-4 space-y-3">
              {course.learningObjectives.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
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
          <ReviewsSection rating={course.rating} reviewCount={course.reviewCount} reviews={course.reviews} />
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
