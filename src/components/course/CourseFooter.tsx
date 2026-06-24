import { brand } from '~/config/brand'

export function CartToast() {
  return null
}

export function CourseFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
      <p>
        <a href={`mailto:${brand.supportEmail}`} className="text-indigo-600 hover:underline">
          客服邮箱：{brand.supportEmail}
        </a>
      </p>
      <p className="mt-2 font-medium text-slate-700">
        {brand.name}
        {' '}
        —
        {brand.tagline}
      </p>
    </footer>
  )
}

export function ScrollToTop() {
  return null
}
