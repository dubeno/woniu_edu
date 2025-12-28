import { getUserTable } from "#/database"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" })
  }

  const body = await readBody(event)
  const { amount } = body

  if (typeof amount !== "number" || amount <= 0 || amount > 10000) {
    throw createError({
      statusCode: 400,
      message: "积分数量必须在1-10000之间"
    })
  }

  const userTable = getUserTable()
  await userTable.addCredits(user.id, amount)
  const credits = await userTable.getCredits(user.id)
  
  return { credits }
})

