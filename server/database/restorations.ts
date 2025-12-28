import type { Database } from "db0"
import type { Restoration } from "@shared/types"

export class RestorationsTable {
  private db
  constructor(db: Database) {
    this.db = db
  }

  async init() {
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS restorations (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        scene_id TEXT NOT NULL DEFAULT 'old-photo-restoration',
        original_url TEXT NOT NULL,
        restored_url TEXT,
        status TEXT NOT NULL,
        payment_status TEXT NOT NULL,
        price INTEGER NOT NULL,
        error TEXT,
        created_at INTEGER NOT NULL,
        completed_at INTEGER
      );
    `).run()
    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_restorations_user_id ON restorations(user_id);
    `).run()
    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_restorations_status ON restorations(status);
    `).run()
    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_restorations_scene_id ON restorations(scene_id);
    `).run()
    logger.success(`init restorations table`)
  }

  async create(restoration: Restoration) {
    await this.db.prepare(`
      INSERT INTO restorations (id, user_id, scene_id, original_url, restored_url, status, payment_status, price, error, created_at, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      restoration.id,
      restoration.user_id || null,
      restoration.scene_id || 'old-photo-restoration',
      restoration.original_url,
      restoration.restored_url || null,
      restoration.status,
      restoration.payment_status,
      restoration.price,
      restoration.error || null,
      restoration.created_at,
      restoration.completed_at || null,
    )
    logger.success(`create restoration ${restoration.id}`)
  }

  async get(id: string): Promise<Restoration | undefined> {
    const row = await this.db.prepare(`
      SELECT * FROM restorations WHERE id = ?
    `).get(id) as any
    return row as Restoration | undefined
  }

  async update(id: string, updates: Partial<Restoration>) {
    const fields: string[] = []
    const values: any[] = []

    if (updates.restored_url !== undefined) {
      fields.push("restored_url = ?")
      values.push(updates.restored_url)
    }
    if (updates.status) {
      fields.push("status = ?")
      values.push(updates.status)
    }
    if (updates.payment_status) {
      fields.push("payment_status = ?")
      values.push(updates.payment_status)
    }
    if (updates.error !== undefined) {
      fields.push("error = ?")
      values.push(updates.error)
    }
    if (updates.completed_at !== undefined) {
      fields.push("completed_at = ?")
      values.push(updates.completed_at)
    }

    if (fields.length === 0) return

    values.push(id)
    await this.db.prepare(`
      UPDATE restorations SET ${fields.join(", ")} WHERE id = ?
    `).run(...values)
    logger.success(`update restoration ${id}`)
  }

  async count(): Promise<number> {
    const result = await this.db.prepare(`SELECT COUNT(*) as count FROM restorations`).get() as { count: number }
    return result?.count || 0
  }

  async countByStatus(status: string): Promise<number> {
    const result = await this.db.prepare(`SELECT COUNT(*) as count FROM restorations WHERE status = ?`).get(status) as { count: number }
    return result?.count || 0
  }

  async countSince(timestamp: number): Promise<number> {
    const result = await this.db.prepare(`SELECT COUNT(*) as count FROM restorations WHERE created_at >= ?`).get(timestamp) as { count: number }
    return result?.count || 0
  }

  async listByUser(userId: string) {
    const rows = await this.db.prepare(`
      SELECT * FROM restorations WHERE user_id = ? ORDER BY created_at DESC
    `).all(userId) as any
    return (rows.results ?? rows) as Restoration[]
  }

  /**
   * 获取数据库实例（用于管理后台）
   */
  getDb() {
    return this.db
  }
}


