import type { Database } from "db0"

export interface CreditHistory {
  id: string
  user_id: string
  amount: number
  balance_before: number
  balance_after: number
  action: "add" | "deduct" | "set"
  reason: string
  operator_id?: string
  operator_type?: "admin" | "system"
  created_at: number
}

export class CreditHistoryTable {
  private db
  constructor(db: Database) {
    this.db = db
  }

  async init() {
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS credit_history (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        balance_before INTEGER NOT NULL,
        balance_after INTEGER NOT NULL,
        action TEXT NOT NULL,
        reason TEXT NOT NULL,
        operator_id TEXT,
        operator_type TEXT,
        created_at INTEGER NOT NULL
      );
    `).run()
    
    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_credit_history_user_id ON credit_history(user_id);
    `).run()
    
    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_credit_history_created_at ON credit_history(created_at);
    `).run()
    
    logger.success(`init credit_history table`)
  }

  /**
   * 记录积分变更
   */
  async record(
    userId: string,
    amount: number,
    balanceBefore: number,
    balanceAfter: number,
    action: "add" | "deduct" | "set",
    reason: string,
    operatorId?: string,
    operatorType: "admin" | "system" = "system"
  ) {
    const id = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await this.db.prepare(`
      INSERT INTO credit_history (
        id, user_id, amount, balance_before, balance_after,
        action, reason, operator_id, operator_type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      userId,
      amount,
      balanceBefore,
      balanceAfter,
      action,
      reason,
      operatorId || null,
      operatorType,
      Date.now()
    )
    
    return id
  }

  /**
   * 获取用户的积分变更历史
   */
  async listByUser(userId: string, limit: number = 50, offset: number = 0): Promise<CreditHistory[]> {
    const result = await this.db.prepare(`
      SELECT 
        id, user_id, amount, balance_before, balance_after,
        action, reason, operator_id, operator_type, created_at
      FROM credit_history
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset) as any
    
    const rows = (result?.results || result || []) as any[]
    return rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      amount: row.amount,
      balance_before: row.balance_before,
      balance_after: row.balance_after,
      action: row.action as "add" | "deduct" | "set",
      reason: row.reason || "",
      operator_id: row.operator_id || undefined,
      operator_type: row.operator_type as "admin" | "system" | undefined,
      created_at: row.created_at,
    })) as CreditHistory[]
  }

  /**
   * 获取所有积分变更历史（管理员用）
   */
  async list(limit: number = 100, offset: number = 0, userId?: string): Promise<CreditHistory[]> {
    let query = `SELECT 
      id, user_id, amount, balance_before, balance_after,
      action, reason, operator_id, operator_type, created_at
    FROM credit_history WHERE 1=1`
    const params: any[] = []
    
    if (userId) {
      query += ` AND user_id = ?`
      params.push(userId)
    }
    
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)
    
    const result = await this.db.prepare(query).all(...params) as any
    const rows = (result?.results || result || []) as any[]
    return rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      amount: row.amount,
      balance_before: row.balance_before,
      balance_after: row.balance_after,
      action: row.action as "add" | "deduct" | "set",
      reason: row.reason || "",
      operator_id: row.operator_id || undefined,
      operator_type: row.operator_type as "admin" | "system" | undefined,
      created_at: row.created_at,
    })) as CreditHistory[]
  }

  /**
   * 统计积分变更记录数
   */
  async count(userId?: string): Promise<number> {
    let query = `SELECT COUNT(*) as count FROM credit_history WHERE 1=1`
    const params: any[] = []
    
    if (userId) {
      query += ` AND user_id = ?`
      params.push(userId)
    }
    
    const result = await this.db.prepare(query).get(...params) as { count: number }
    return result?.count || 0
  }
}

