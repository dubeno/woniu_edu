import { Navigate, useParams } from '@tanstack/react-router'
import { getCourseBySlug } from '~/data/courses'
import { courseJsonLd, useCourseSeo } from '~/lib/seo'
import { PurchaseCard, MobilePurchaseBar, PurchaseActions } from '~/components/course/PurchaseCard'
import { CurriculumSection } from '~/components/course/CurriculumSection'
import { InstructorSection, ReviewsSection } from '~/components/course/InstructorSection'
import { CourseFAQSection } from '~/components/course/CourseFAQSection'
import { PainPointsSection } from '~/components/course/PainPointsSection'
import { CourseFooter } from '~/components/course/CourseFooter'

// 课程详情页 — 仅在 /courses/$slug 时按需加载
export default function CoursePage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const course = getCourseBySlug(slug)
  const plan = course?.plans[0]

  useCourseSeo(course ?? null)

  if (!course || !plan) {
    return <Navigate to="/courses" />
  }

  return (
    <div className="min-h-full bg-[#0a0e1a] pb-28 font-mono text-slate-200 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd(course)) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
        <main>
          {course.badge && (
            <span className="border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-emerald-400">
              {course.badge}
            </span>
          )}

          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-100">
            {course.title}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
            <div className="flex h-7 w-7 items-center justify-center border border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-400">
              W
            </div>
            <span>// instructor · {course.instructor.name}</span>
          </div>

          <img
            src={course.coverImage}
            alt={course.title}
            className="mt-6 w-full border border-emerald-500/20 object-cover lg:hidden"
          />

          <div className="mt-6 space-y-3 border border-emerald-500/20 bg-[#0d1220] p-5 lg:hidden">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              // what's_included
            </h4>
            <ul className="space-y-1">
              {course.includes.map(item => (
                <li key={item} className="flex items-start gap-2 text-xs text-slate-300">
                  <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-emerald-500/70" />
                  {item}
                </li>
              ))}
            </ul>
            <PurchaseActions course={course} plan={plan} />
          </div>

          <section className="mt-10 border border-emerald-500/20 bg-[#0d1220] p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              // 课程简介
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{course.description}</p>
          </section>

          <section className="mt-6 border border-emerald-500/20 bg-[#0d1220] p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              // 课程要点
            </h2>
            <ul className="mt-4 space-y-3">
              {course.learningObjectives.map(item => (
                <li key={item} className="flex items-start gap-3 text-xs leading-relaxed text-slate-300">
                  <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-emerald-500/70" />
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