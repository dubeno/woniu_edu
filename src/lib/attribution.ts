export interface Attribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  channel_code?: string
}

const STORAGE_KEY = 'opc_attribution'

export function captureAttributionFromSearch(search: string) {
  const params = new URLSearchParams(search)
  const next: Attribution = {}
  const utm_source = params.get('utm_source') ?? undefined
  const utm_medium = params.get('utm_medium') ?? undefined
  const utm_campaign = params.get('utm_campaign') ?? undefined
  const channel = params.get('channel') ?? params.get('channel_code') ?? undefined

  if (utm_source) next.utm_source = utm_source
  if (utm_medium) next.utm_medium = utm_medium
  if (utm_campaign) next.utm_campaign = utm_campaign
  if (channel) next.channel_code = channel

  if (Object.keys(next).length === 0) return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : {}
  } catch {
    return {}
  }
}

export function buildTrackedUrl(
  basePath: string,
  opts: {
    channel_code?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  },
) {
  const url = new URL(basePath, window.location.origin)
  if (opts.channel_code) url.searchParams.set('channel', opts.channel_code)
  if (opts.utm_source) url.searchParams.set('utm_source', opts.utm_source)
  if (opts.utm_medium) url.searchParams.set('utm_medium', opts.utm_medium)
  if (opts.utm_campaign) url.searchParams.set('utm_campaign', opts.utm_campaign)
  return url.toString()
}

export const CHANNEL_PRESETS = [
  { id: 'wechat-moments', label: '微信朋友圈', utm_source: 'wechat', utm_medium: 'social', utm_campaign: 'moments' },
  { id: 'wechat-group', label: '微信群', utm_source: 'wechat', utm_medium: 'community', utm_campaign: 'group' },
  { id: 'xiaohongshu', label: '小红书', utm_source: 'xiaohongshu', utm_medium: 'social', utm_campaign: 'note' },
  { id: 'live', label: '直播回放', utm_source: 'live', utm_medium: 'video', utm_campaign: 'replay' },
  { id: '1v1', label: '私聊 1v1', utm_source: 'wechat', utm_medium: 'dm', utm_campaign: '1v1' },
] as const
