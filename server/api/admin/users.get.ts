import { getUserTable } from "#/database"

export default defineEventHandler(async (event) => {
  // 检查管理员权限（简化版：检查用户role）
  const user = event.context.user
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, message: "Forbidden" })
  }

  const { page = "1", limit = "20", search = "" } = getQuery(event)
  const pageNum = parseInt(page as string) || 1
  const limitNum = parseInt(limit as string) || 20
  const offset = (pageNum - 1) * limitNum

  const userTable = getUserTable()
  
  // 获取用户列表（注意：listUsers的参数顺序是 limit, offset, search）
  const users = await userTable.listUsers(limitNum, offset, search as string)
  const total = await userTable.countUsers(search as string)

  return {
    users: users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      credits: u.credits || 0,
      created: u.created,
      type: u.type,
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    }
  }
})

