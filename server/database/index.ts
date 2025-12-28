import process from "node:process"
import { RestorationsTable } from "./restorations"
import { SubscriptionsTable } from "./subscriptions"
import { UserTable } from "./user"
import { initRateLimitTable } from "./rate-limit"
import { CreditHistoryTable } from "./credit-history"

export async function initDatabase() {
  try {
    const db = useDatabase()
    if (process.env.INIT_TABLE === "false") return

    const restorationsTable = new RestorationsTable(db)
    const subscriptionsTable = new SubscriptionsTable(db)
    const userTable = new UserTable(db)
    const rateLimitTable = initRateLimitTable(db)
    const creditHistoryTable = new CreditHistoryTable(db)

    await restorationsTable.init()
    await subscriptionsTable.init()
    await userTable.init()
    await rateLimitTable.init()
    await creditHistoryTable.init()

    logger.success("Database initialized - Simplified MVP")
  } catch (e) {
    logger.error("Failed to init database", e)
  }
}

export function getRestorationsTable() {
  const db = useDatabase()
  return new RestorationsTable(db)
}

export function getSubscriptionsTable() {
  const db = useDatabase()
  return new SubscriptionsTable(db)
}

export function getUserTable() {
  const db = useDatabase()
  return new UserTable(db)
}

export { getRateLimitTable } from "./rate-limit"

export function getCreditHistoryTable() {
  const db = useDatabase()
  return new CreditHistoryTable(db)
}

