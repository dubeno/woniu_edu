import { getCreditHistoryTable } from "#/database"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, message: "Forbidden" })
  }

  const { page = "1", limit = "50", userId } = getQuery(event)
  const pageNum = parseInt(page as string) || 1
  const limitNum = parseInt(limit as string) || 50
  const offset = (pageNum - 1) * limitNum

  const creditHistoryTable = getCreditHistoryTable()
  const history = await creditHistoryTable.list(limitNum, offset, userId as string | undefined)
  const total = await creditHistoryTable.count(userId as string | undefined)

  return {
    history: history.map((h: any) => ({
      id: h.id,
      user_id: h.user_id,
      amount: h.amount,
      balance_before: h.balance_before,
      balance_after: h.balance_after,
      action: h.action || h.type, // 兼容字段名
      reason: h.reason || "",
      operator_id: h.operator_id || null,
      operator_type: h.operator_type || "system",
      created_at: h.created_at,
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    }
  }
})

