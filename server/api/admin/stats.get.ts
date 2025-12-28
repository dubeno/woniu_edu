import { getUserTable, getRestorationsTable } from "#/database"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, message: "Forbidden" })
  }

  const userTable = getUserTable()
  const restorationsTable = getRestorationsTable()

  // 获取统计数据
  const totalUsers = await userTable.countUsers()
  const totalRestorations = await restorationsTable.count()
  const completedRestorations = await restorationsTable.countByStatus("completed")
  
  // 获取最近7天的数据
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const newUsersLast7Days = await userTable.countUsersSince(sevenDaysAgo)
  const newRestorationsLast7Days = await restorationsTable.countSince(sevenDaysAgo)

  return {
    totalUsers,
    totalRestorations,
    completedRestorations,
    newUsersLast7Days,
    newRestorationsLast7Days,
  }
})

