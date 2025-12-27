
import { createDatabase } from "db0"
import sqlite from "db0/connectors/better-sqlite3"

const db = createDatabase(sqlite({ path: ".data/db.sqlite" }))

async function dropTable() {
  console.log("Dropping restorations table...")
  try {
    await db.prepare("DROP TABLE IF EXISTS restorations").run()
    console.log("✅ Table dropped")
  } catch (err) {
    console.error("Error dropping table:", err)
  }
}

dropTable()







