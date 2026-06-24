import { useState } from 'react'
import { wechat } from '~/config/wechat'
import { WechatConsultModal } from '~/components/WechatConsultModal'
import { trackEvent } from '~/lib/analytics'

interface WechatFabProps {
  courseSlug?: string
  courseTitle?: string
  /** 当用户在课程 / 文章页时传入 trigger='purchase'，否则为 'free_resource' */
  trigger?: 'purchase' | 'free_resource'
  /** 按钮旁的简短文案，默认「咨询课程」 */
  label?: string
}

/** 全站右下角悬浮气泡 — 点击弹出微信二维码 */
export function WechatFab({
  courseSlug = 'general',
  courseTitle = '蜗牛AI 课程咨询',
  trigger = 'purchase',
  label = '咨询课程',
}: WechatFabProps) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="微信咨询课程"
        onClick={() => {
          trackEvent({ type: 'fab_click', courseSlug, courseTitle, trigger })
          setOpen(true)
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 rounded-full bg-[#07c160] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:bg-[#06ad56] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path d="M9.5 4C5.36 4 2 6.91 2 10.5c0 2.07 1.06 3.92 2.71 5.13-.12.45-.43 1.6-.49 1.83-.07.27.1.27.21.2.09-.06 1.55-.9 1.95-1.13.62.13 1.27.2 1.94.2.21 0 .41-.01.62-.02-.13-.4-.21-.83-.21-1.27 0-3.31 3.13-6 7-6 .16 0 .31.01.47.02C15.62 6.04 12.85 4 9.5 4Zm-2.7 4.4c.55 0 1 .41 1 .92s-.45.92-1 .92-1-.41-1-.92.45-.92 1-.92Zm5.4 0c.55 0 1 .41 1 .92s-.45.92-1 .92-1-.41-1-.92.45-.92 1-.92Z" />
          <path d="M22 14.7c0-2.83-2.91-5.13-6.5-5.13-3.81 0-6.5 2.18-6.5 5.13 0 2.95 2.69 5.13 6.5 5.13.59 0 1.16-.06 1.7-.18.34.18 1.55.84 1.62.88.09.04.23.04.18-.18-.04-.18-.34-1.16-.43-1.53C20.81 18.31 22 16.61 22 14.7Zm-8.7-1.3c-.49 0-.9-.36-.9-.81s.41-.81.9-.81.9.36.9.81-.41.81-.9.81Zm4.4 0c-.49 0-.9-.36-.9-.81s.41-.81.9-.81.9.36.9.81-.41.81-.9.81Z" />
        </svg>
        <span className={hovered ? 'inline' : 'hidden sm:inline'}>{label}</span>
      </button>

      <WechatConsultModal
        open={open}
        onClose={() => setOpen(false)}
        courseSlug={courseSlug}
        courseTitle={courseTitle}
        trigger={trigger}
      />
    </>
  )
}
