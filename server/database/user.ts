import type { Database } from "db0"
import type { UserInfo } from "#/types"

export class UserTable {
  private db
  constructor(db: Database) {
    this.db = db
  }

  async init() {
    // 创建表（如果不存在）
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password_hash TEXT,
        data TEXT,
        type TEXT,
        avatar TEXT,
        credits INTEGER DEFAULT 0,
        created INTEGER,
        updated INTEGER
      );
    `).run()

    // 检查并添加新列（迁移逻辑）
    try {
      // 检查 username 列是否存在
      const tableInfo = await this.db.prepare(`PRAGMA table_info(user)`).all() as any
      const columns = (tableInfo.results || tableInfo).map((row: any) => row.name)
      
      if (!columns.includes('username')) {
        logger.info('添加 username 列...')
        // SQLite 不支持在 ALTER TABLE 中直接添加 UNIQUE 约束
        await this.db.prepare(`ALTER TABLE user ADD COLUMN username TEXT`).run()
      }
      
      if (!columns.includes('password_hash')) {
        logger.info('添加 password_hash 列...')
        await this.db.prepare(`ALTER TABLE user ADD COLUMN password_hash TEXT`).run()
      }
      
      if (!columns.includes('avatar')) {
        logger.info('添加 avatar 列...')
        await this.db.prepare(`ALTER TABLE user ADD COLUMN avatar TEXT`).run()
      }
      
      if (!columns.includes('credits')) {
        logger.info('添加 credits 列...')
        await this.db.prepare(`ALTER TABLE user ADD COLUMN credits INTEGER DEFAULT 0`).run()
      }

      // 创建唯一索引（如果列是新添加的或索引不存在）
      // 注意：SQLite 的唯一索引可以处理 NULL 值，所以即使有 NULL 值也可以创建
      try {
        await this.db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username ON user(username) WHERE username IS NOT NULL`).run()
      } catch (e: any) {
        // 如果索引已存在或创建失败，忽略
        logger.warn('创建 username 唯一索引失败（可能已存在）:', e.message)
      }
      
      try {
        await this.db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON user(email) WHERE email IS NOT NULL`).run()
      } catch (e: any) {
        logger.warn('创建 email 唯一索引失败（可能已存在）:', e.message)
      }
    } catch (e: any) {
      // 如果迁移失败，记录错误但继续
      if (e.message?.includes('duplicate column')) {
        logger.warn('检测到重复列，跳过迁移')
      } else {
        logger.error('数据库迁移失败:', e)
        // 不抛出错误，让表创建继续
      }
    }

    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_user_id ON user(id);
    `).run()
    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_user_username ON user(username);
    `).run()
    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_user_email ON user(email);
    `).run()
    logger.success(`init user table`)
  }

  async addUser(id: string, email: string, type: "github" | "email") {
    const u = await this.getUser(id)
    const now = Date.now()
    if (!u) {
      await this.db.prepare(`INSERT INTO user (id, email, data, type, created, updated) VALUES (?, ?, ?, ?, ?, ?)`)
        .run(id, email, "", type, now, now)
      logger.success(`add user ${id}`)
    } else if (u.email !== email && u.type !== type) {
      await this.db.prepare(`UPDATE user SET email = ?, updated = ? WHERE id = ?`).run(email, now, id)
      logger.success(`update user ${id} email`)
    } else {
      logger.info(`user ${id} already exists`)
    }
  }

  async createUser(username: string, email: string, passwordHash: string) {
    const id = crypto.randomUUID()
    const now = Date.now()
    
    // 检查用户名和邮箱是否已存在
    const existingUser = await this.db.prepare(`
      SELECT id FROM user WHERE username = ? OR email = ?
    `).get(username, email) as { id: string } | undefined
    
    if (existingUser) {
      throw new Error("用户名或邮箱已存在")
    }
    
    await this.db.prepare(`
      INSERT INTO user (id, username, email, password_hash, data, type, created, updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, username, email, passwordHash, "", "email", now, now)
    
    logger.success(`create user ${id} (${username})`)
    return id
  }

  async getUserByUsername(username: string) {
    return (await this.db.prepare(`
      SELECT id, username, email, password_hash, data, type, avatar, credits, created, updated 
      FROM user WHERE username = ?
    `).get(username)) as UserInfo & { password_hash?: string; credits?: number } | undefined
  }

  async getUserByEmail(email: string) {
    return (await this.db.prepare(`
      SELECT id, username, email, password_hash, data, type, avatar, credits, created, updated 
      FROM user WHERE email = ?
    `).get(email)) as UserInfo & { password_hash?: string; credits?: number } | undefined
  }

  async getUser(id: string) {
    return (await this.db.prepare(`
      SELECT id, username, email, password_hash, data, type, avatar, credits, created, updated 
      FROM user WHERE id = ?
    `).get(id)) as any
  }

  /**
   * 获取用户积分
   */
  async getCredits(userId: string): Promise<number> {
    const user = await this.getUser(userId)
    return user?.credits || 0
  }

  /**
   * 扣除积分
   */
  async deductCredits(userId: string, amount: number, reason: string = "消费", operatorId?: string, operatorType: "admin" | "system" = "system"): Promise<boolean> {
    const balanceBefore = await this.getCredits(userId)
    if (balanceBefore < amount) {
      return false
    }
    
    await this.db.prepare(`
      UPDATE user SET credits = credits - ?, updated = ? WHERE id = ?
    `).run(amount, Date.now(), userId)
    const balanceAfter = balanceBefore - amount
    
    // 记录积分变更历史
    try {
      const { getCreditHistoryTable } = await import("#/database")
      const creditHistoryTable = getCreditHistoryTable()
      await creditHistoryTable.record(userId, amount, balanceBefore, balanceAfter, "deduct", reason, operatorId, operatorType)
    } catch (e) {
      logger.warn("记录积分变更历史失败:", e)
    }
    
    logger.info(`扣除用户 ${userId} ${amount} 积分，余额：${balanceBefore} -> ${balanceAfter}`)
    return true
  }

  /**
   * 增加积分
   */
  async addCredits(userId: string, amount: number, reason: string = "系统充值", operatorId?: string, operatorType: "admin" | "system" = "system"): Promise<void> {
    const balanceBefore = await this.getCredits(userId)
    await this.db.prepare(`
      UPDATE user SET credits = credits + ?, updated = ? WHERE id = ?
    `).run(amount, Date.now(), userId)
    const balanceAfter = balanceBefore + amount
    
    // 记录积分变更历史
    try {
      const { getCreditHistoryTable } = await import("#/database")
      const creditHistoryTable = getCreditHistoryTable()
      await creditHistoryTable.record(userId, amount, balanceBefore, balanceAfter, "add", reason, operatorId, operatorType)
    } catch (e) {
      logger.warn("记录积分变更历史失败:", e)
    }
    
    logger.info(`增加用户 ${userId} ${amount} 积分，余额：${balanceBefore} -> ${balanceAfter}`)
  }

  /**
   * 设置积分
   */
  async setCredits(userId: string, amount: number, reason: string = "系统设置", operatorId?: string, operatorType: "admin" | "system" = "system"): Promise<void> {
    const balanceBefore = await this.getCredits(userId)
    await this.db.prepare(`
      UPDATE user SET credits = ?, updated = ? WHERE id = ?
    `).run(amount, Date.now(), userId)
    const balanceAfter = amount
    
    // 记录积分变更历史
    try {
      const { getCreditHistoryTable } = await import("#/database")
      const creditHistoryTable = getCreditHistoryTable()
      await creditHistoryTable.record(userId, amount, balanceBefore, balanceAfter, "set", reason, operatorId, operatorType)
    } catch (e) {
      logger.warn("记录积分变更历史失败:", e)
    }
    
    logger.info(`设置用户 ${userId} 积分为 ${amount}，余额：${balanceBefore} -> ${balanceAfter}`)
  }

  async setData(key: string, value: string, updatedTime = Date.now()) {
    const state = await this.db.prepare(
      `UPDATE user SET data = ?, updated = ? WHERE id = ?`,
    ).run(value, updatedTime, key)
    if (!state.success) throw new Error(`set user ${key} data failed`)
    logger.success(`set ${key} data`)
  }

  async getData(id: string) {
    const row: any = await this.db.prepare(`SELECT data, updated FROM user WHERE id = ?`).get(id)
    if (!row) throw new Error(`user ${id} not found`)
    logger.success(`get ${id} data`)
    return row as {
      data: string
      updated: number
    }
  }

  async deleteUser(key: string) {
    const state = await this.db.prepare(`DELETE FROM user WHERE id = ?`).run(key)
    if (!state.success) throw new Error(`delete user ${key} failed`)
    logger.success(`delete user ${key}`)
  }

  /**
   * 获取用户列表（管理后台用）
   * @param limit 每页数量
   * @param offset 偏移量
   * @param search 搜索关键词
   */
  async listUsers(limit: number, offset: number, search: string = "") {
    let query = `SELECT id, username, email, credits, created, type FROM user WHERE 1=1`
    const params: any[] = []
    
    if (search) {
      query += ` AND (username LIKE ? OR email LIKE ?)`
      params.push(`%${search}%`, `%${search}%`)
    }
    
    query += ` ORDER BY created DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)
    
    const result = await this.db.prepare(query).all(...params) as any
    return result?.results || result || []
  }

  /**
   * 统计用户总数（管理后台用）
   */
  async countUsers(search: string = ""): Promise<number> {
    let query = `SELECT COUNT(*) as count FROM user WHERE 1=1`
    const params: any[] = []
    
    if (search) {
      query += ` AND (username LIKE ? OR email LIKE ?)`
      params.push(`%${search}%`, `%${search}%`)
    }
    
    const result = await this.db.prepare(query).get(...params) as { count: number }
    return result?.count || 0
  }

  /**
   * 统计指定时间之后的用户数（管理后台用）
   */
  async countUsersSince(timestamp: number): Promise<number> {
    const result = await this.db.prepare(
      `SELECT COUNT(*) as count FROM user WHERE created >= ?`
    ).get(timestamp) as { count: number }
    return result?.count || 0
  }
}
