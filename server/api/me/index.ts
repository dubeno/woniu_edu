import { getUserTable } from "#/database"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" })
  }

  const userTable = getUserTable()
  const userInfo = await userTable.getUser(user.id)
  
  if (!userInfo) {
    throw createError({ statusCode: 404, message: "User not found" })
  }

  // 返回用户的 role（从 context 中获取，已在中间件中设置）
  return {
    id: userInfo.id,
    username: userInfo.username,
    email: userInfo.email,
    type: userInfo.type,
    avatar: userInfo.avatar,
    credits: userInfo.credits || 0,
    role: user.role || "photographer", // 返回用户角色
  }
})
