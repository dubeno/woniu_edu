/**
 * 前端事件埋点
 * 现阶段先写 localStorage，后续可接入 GA4 / Cloudflare Analytics
 */

const STORAGE_KEY = 'woniu_ai_events'

export interface WoniuEvent {
  type: string
  ts: number
  [k: string]: unknown
}

export function trackEvent(event: Omit<WoniuEvent, 'ts'>): void {
  if (typeof window === 'undefined') return
  const list = readEvents()
  list.push({ ...event, ts: Date.now() })
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-200)))
  } catch {
    /* quota exceeded — ignore */
  }
}

export function readEvents(): WoniuEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as WoniuEvent[]) : []
  } catch {
    return []
  }
}
