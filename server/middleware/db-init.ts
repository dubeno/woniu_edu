import process from "node:process"
import { initDatabase } from "#/database"

let initialized = false

export default defineEventHandler(async (event) => {
  // Only initialize once per server instance
  if (initialized) {
    return
  }

  try {
    // 初始化数据库
    if (process.env.INIT_TABLE !== "false") {
      await initDatabase()
    }
    
    initialized = true
    logger.success("Database initialized")
  } catch (e) {
    logger.error("Failed to initialize database", e)
    // Don't throw - allow server to continue
  }
})
