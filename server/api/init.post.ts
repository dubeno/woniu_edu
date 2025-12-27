import { initDatabase } from "#/database"

export default defineEventHandler(async (event) => {
  await initDatabase()
  return { success: true, message: "Database initialized" }
})

