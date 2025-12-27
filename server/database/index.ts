import process from "node:process"
import { RestorationsTable } from "./restorations"
import { SubscriptionsTable } from "./subscriptions"
import { UserTable } from "./user"

export async function initDatabase() {
  try {
    const db = useDatabase()
    if (process.env.INIT_TABLE === "false") return

    const restorationsTable = new RestorationsTable(db)
    const subscriptionsTable = new SubscriptionsTable(db)
    const userTable = new UserTable(db)

    await restorationsTable.init()
    await subscriptionsTable.init()
    await userTable.init()

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

