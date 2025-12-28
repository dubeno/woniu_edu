import { getUserTable } from "#/database"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" })
  }

  const userTable = getUserTable()
  const credits = await userTable.getCredits(user.id)
  
  return { credits }
})

