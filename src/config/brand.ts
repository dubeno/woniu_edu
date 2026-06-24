/** 蜗牛AI — 个人品牌 · 求职向 AI 实战课 */
export const brand = {
  name: '蜗牛AI',
  shortName: '蜗牛',
  tagline: 'FDE · AI Infra · Agent — 免费讲义引流，微信咨询转化',
  supportEmail: 'support@woniu-ai.dev',
  primary: '#4f46e5',
  accent: '#0d9488',
} as const

export function formatCoursePrice(amount: number): string {
  return `¥${amount.toLocaleString('zh-CN')}`
}
