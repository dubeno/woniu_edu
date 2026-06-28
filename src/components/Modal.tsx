import { useEffect, useState } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className={`relative w-full ${sizeClasses[size]} overflow-hidden rounded-2xl border border-white/10 bg-[#0e0b14] shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-white/50 transition hover:text-white" aria-label="关闭">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 text-sm text-white/80">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: "blue" | "green" | "red"
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "确定",
  cancelText = "取消",
  confirmColor = "blue",
}: ConfirmModalProps) {
  const buttonClass = {
    blue: "bg-white text-black hover:bg-violet-100",
    green: "bg-white text-black hover:bg-violet-100",
    red: "bg-red-500 text-white hover:bg-red-600",
  }[confirmColor]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-white/70">{message}</p>
        <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 bg-transparent px-4 py-2 text-xs text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

interface InputModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  title: string
  message: string
  placeholder?: string
  type?: "text" | "number"
  confirmText?: string
  cancelText?: string
  confirmColor?: "blue" | "green" | "red"
  defaultValue?: string
}

export function InputModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "请输入",
  type = "text",
  confirmText = "确定",
  cancelText = "取消",
  confirmColor = "blue",
  defaultValue = "",
}: InputModalProps) {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue)
      setError("")
    }
  }, [isOpen, defaultValue])

  const buttonClass = {
    blue: "bg-white text-black hover:bg-violet-100",
    green: "bg-white text-black hover:bg-violet-100",
    red: "bg-red-500 text-white hover:bg-red-600",
  }[confirmColor]

  const handleConfirm = () => {
    if (!value.trim()) {
      setError("请输入内容")
      return
    }
    if (type === "number" && (isNaN(Number(value)) || Number(value) < 0)) {
      setError("请输入有效的数字")
      return
    }
    onConfirm(value)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-white/70">{message}</p>
        <div>
          <input
            type={type}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError("")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirm()
              }
            }}
            placeholder={placeholder}
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:bg-white/5 ${
              error
                ? "border-red-500/50 focus:border-red-400"
                : "border-white/10 focus:border-violet-400/60"
            }`}
            autoFocus
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-400">{error}</p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 bg-transparent px-4 py-2 text-xs text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}