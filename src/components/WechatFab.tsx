import { useState } from 'react'
import { WechatConsultModal } from '~/components/WechatConsultModal'
import { trackEvent } from '~/lib/analytics'

interface WechatFabProps {
  courseSlug?: string
  courseTitle?: string
  trigger?: 'purchase' | 'free_resource'
  label?: string
}

export function WechatFab({
  courseSlug = 'general',
  courseTitle = '蜗牛AI 课程咨询',
  trigger = 'purchase',
  label = '微信咨询',
}: WechatFabProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="微信咨询课程"
        onClick={() => {
          trackEvent({ type: 'fab_click', courseSlug, courseTitle, trigger })
          setOpen(true)
        }}
        className="group fixed bottom-6 right-6 z-[90] inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-2xl shadow-violet-500/20 transition hover:scale-[1.02] hover:bg-violet-100"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#07c160] to-[#05a14e] text-[10px] font-semibold text-white">
          微
        </span>
        {label}
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