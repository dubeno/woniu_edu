import { getUserTable } from "#/database"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, message: "Forbidden" })
  }

  const { id } = getRouterParams(event)
  const body = await readBody(event)
  const { action, amount, reason } = body

  if (!["add", "set", "deduct"].includes(action)) {
    throw createError({ statusCode: 400, message: "Invalid action" })
  }

  if (typeof amount !== "number" || amount < 0) {
    throw createError({ statusCode: 400, message: "Invalid amount" })
  }

  const userTable = getUserTable()
  const targetUser = await userTable.getUser(id)
  
  if (!targetUser) {
    throw createError({ statusCode: 404, message: "User not found" })
  }

  const actionText = action === "add" ? "充值" : action === "set" ? "设置" : "扣除"
  const reasonText = reason || `管理员${actionText}`
  
  switch (action) {
    case "add":
      await userTable.addCredits(id, amount, reasonText, user.id, "admin")
      break
    case "set":
      await userTable.setCredits(id, amount, reasonText, user.id, "admin")
      break
    case "deduct":
      const deducted = await userTable.deductCredits(id, amount, reasonText, user.id, "admin")
      if (!deducted) {
        throw createError({ statusCode: 400, message: "积分不足，无法扣除" })
      }
      break
  }

  const newCredits = await userTable.getCredits(id)
  return { credits: newCredits }
})

