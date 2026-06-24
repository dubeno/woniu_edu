import process from 'node:process'
import { getUserTable, getCreditHistoryTable } from '#/database'

export default defineEventHandler(async () => {
  if (process.env.NODE_ENV === 'production' && process.env.INIT_TABLE !== 'true') {
    return { skipped: true }
  }
  try {
    const user = getUserTable()
    const credit = getCreditHistoryTable()
    await user.init()
    await credit.init()
    return { ok: true, env: process.env.NODE_ENV ?? 'dev' }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? String(e) }
  }
})
