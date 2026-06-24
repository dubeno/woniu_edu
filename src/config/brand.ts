/** 蜗牛AI — AI Engineer Career Studio */
export const brand = {
  name: '蜗牛AI',
  shortName: 'WoniuAI',
  tagline: 'AI Engineer Career Studio · FDE · AI Infra · Agent',
  supportEmail: 'support@woniu-ai.dev',
} as const

export function formatCoursePrice(amount: number): string {
  return `¥${amount.toLocaleString('zh-CN')}`
}
