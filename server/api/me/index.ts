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

  return {
    id: userInfo.id,
    email: userInfo.email,
    type: userInfo.type,
  }
})
