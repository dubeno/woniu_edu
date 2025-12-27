import type { Database } from "db0"
import type { Subscription } from "@shared/types"

export class SubscriptionsTable {
  private db
  constructor(db: Database) {
    this.db = db
  }

  async init() {
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        price INTEGER NOT NULL,
        status TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        photos_limit INTEGER NOT NULL,
        photos_used INTEGER DEFAULT 0
      );
    `).run()
    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
    `).run()
    logger.success(`init subscriptions table`)
  }

  async create(subscription: Subscription) {
    await this.db.prepare(`
      INSERT INTO subscriptions (id, user_id, plan, price, status, started_at, expires_at, photos_limit, photos_used)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      subscription.id,
      subscription.user_id,
      subscription.plan,
      subscription.price,
      subscription.status,
      subscription.started_at,
      subscription.expires_at,
      subscription.photos_limit,
      subscription.photos_used,
    )
    logger.success(`create subscription ${subscription.id}`)
  }

  async getActiveByUser(userId: string): Promise<Subscription | undefined> {
    const row = await this.db.prepare(`
      SELECT * FROM subscriptions 
      WHERE user_id = ? AND status = 'active' AND expires_at > ?
      ORDER BY expires_at DESC LIMIT 1
    `).get(userId, Date.now()) as any
    return row as Subscription | undefined
  }

  async incrementUsage(subscriptionId: string) {
    await this.db.prepare(`
      UPDATE subscriptions SET photos_used = photos_used + 1 WHERE id = ?
    `).run(subscriptionId)
  }
}


