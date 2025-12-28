import type { Database } from "db0"

export interface RateLimitRecord {
  ip: string
  count: number
  reset_at: number // 重置时间戳（Unix timestamp）
}

export class RateLimitTable {
  private db
  constructor(db: Database) {
    this.db = db
  }

  async init() {
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        ip TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0,
        reset_at INTEGER NOT NULL
      );
    `).run()

    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits(reset_at);
    `).run()

    logger.success("init rate_limits table")
  }

  /**
   * 检查IP是否超过限制
   * @param ip IP地址
   * @param limit 限制次数（默认5次）
   * @param windowMs 时间窗口（毫秒，默认24小时）
   * @returns { allowed: boolean, remaining: number, resetAt: number }
   */
  async checkLimit(ip: string, limit: number = 5, windowMs: number = 24 * 60 * 60 * 1000) {
    const now = Date.now()
    const resetAt = now + windowMs

    // 获取或创建记录
    let record = await this.db.prepare(`
      SELECT * FROM rate_limits WHERE ip = ?
    `).get(ip) as RateLimitRecord | undefined

    if (!record) {
      // 创建新记录
      await this.db.prepare(`
        INSERT INTO rate_limits (ip, count, reset_at)
        VALUES (?, 1, ?)
      `).run(ip, resetAt)
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt
      }
    }

    // 检查是否需要重置
    if (record.reset_at < now) {
      // 重置计数
      await this.db.prepare(`
        UPDATE rate_limits SET count = 1, reset_at = ? WHERE ip = ?
      `).run(resetAt, ip)
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt
      }
    }

    // 检查是否超过限制
    if (record.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.reset_at
      }
    }

    // 增加计数
    await this.db.prepare(`
      UPDATE rate_limits SET count = count + 1 WHERE ip = ?
    `).run(ip)

    return {
      allowed: true,
      remaining: limit - record.count - 1,
      resetAt: record.reset_at
    }
  }

  /**
   * 获取IP的剩余次数
   */
  async getRemaining(ip: string, limit: number = 5) {
    const now = Date.now()
    const record = await this.db.prepare(`
      SELECT * FROM rate_limits WHERE ip = ?
    `).get(ip) as RateLimitRecord | undefined

    if (!record || record.reset_at < now) {
      return limit
    }

    return Math.max(0, limit - record.count)
  }

  /**
   * 清理过期的记录
   */
  async cleanup() {
    const now = Date.now()
    await this.db.prepare(`
      DELETE FROM rate_limits WHERE reset_at < ?
    `).run(now)
  }
}

let rateLimitTableInstance: RateLimitTable | null = null

export function getRateLimitTable(): RateLimitTable {
  if (!rateLimitTableInstance) {
    throw new Error("RateLimitTable not initialized")
  }
  return rateLimitTableInstance
}

export function initRateLimitTable(db: Database) {
  rateLimitTableInstance = new RateLimitTable(db)
  return rateLimitTableInstance
}

