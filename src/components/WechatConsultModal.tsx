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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="关闭"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold text-gray-900">{wechat.consultTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">{wechat.consultSubtitle}</p>
        <p className="mt-1 text-xs text-indigo-600">当前课程：{courseTitle}</p>

        <div className="mx-auto mt-6 flex w-56 flex-col items-center">
          <img
            src={wechat.qrImageUrl}
            alt="微信二维码"
            width={224}
            height={224}
            loading="eager"
            decoding="async"
            className="h-56 w-56 rounded-xl border border-slate-200 bg-white object-contain p-2"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = '0.3'
            }}
          />
          <p className="mt-3 text-sm font-medium text-slate-800">{wechat.accountHint}</p>
        </div>

        <p className="mt-4 rounded-md border border-slate-200 px-3 py-2 text-center text-xs text-slate-600">
          发送课程关键词领取免费 Markdown 讲义 · 咨询报名享学员价
        </p>
      </div>
    </div>
  )
}
