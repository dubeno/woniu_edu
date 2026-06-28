import { useEffect } from 'react'
import { wechat } from '~/config/wechat'
import { trackEvent } from '~/lib/analytics'

interface WechatConsultModalProps {
  open: boolean
  onClose: () => void
  courseSlug: string
  courseTitle: string
  trigger: 'purchase' | 'free_resource'
}

export function WechatConsultModal({
  open,
  onClose,
  courseSlug,
  courseTitle,
  trigger,
}: WechatConsultModalProps) {
  useEffect(() => {
    if (!open) return
    trackEvent({
      type: 'consult_open',
      courseSlug,
      courseTitle,
      trigger,
    })
  }, [open, courseSlug, courseTitle, trigger])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0e0b14] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-white/50 transition hover:text-white"
          aria-label="关闭"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 渐变光晕 */}
        <div className="absolute -top-20 left-1/2 h-40 w-[300px] -translate-x-1/2 rounded-full bg-violet-500/30 blur-[60px]" />

        <div className="relative px-6 py-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">扫码咨询课程</h2>
            <p className="mt-1 text-xs text-white/50">
              {wechat.accountHint}
            </p>
          </div>

          <div className="mx-auto mt-6 flex w-56 flex-col items-center">
            <div className="rounded-2xl border border-white/10 bg-white p-3">
              <img
                src={wechat.qrImageUrl}
                alt="微信二维码"
                width={224}
                height={224}
                loading="eager"
                decoding="async"
                className="h-56 w-56 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = '0.3'
                }}
              />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/50">
            长按或截图识别二维码
          </p>
        </div>
      </div>
    </div>
  )
}