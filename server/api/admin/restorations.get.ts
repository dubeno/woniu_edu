import { getRestorationsTable } from "#/database"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, message: "Forbidden" })
  }

  const { page = "1", limit = "20", status, userId } = getQuery(event)
  const pageNum = parseInt(page as string) || 1
  const limitNum = parseInt(limit as string) || 20
  const offset = (pageNum - 1) * limitNum

  const restorationsTable = getRestorationsTable()
  const db = restorationsTable.getDb()
  
  // 构建查询
  let query = `SELECT * FROM restorations WHERE 1=1`
  const params: any[] = []
  
  if (status) {
    query += ` AND status = ?`
    params.push(status)
  }
  
  if (userId) {
    query += ` AND user_id = ?`
    params.push(userId)
  }
  
  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
  params.push(limitNum, offset)
  
  const restorations = await db.prepare(query).all(...params) as any
  
  // 获取总数
  let countQuery = `SELECT COUNT(*) as count FROM restorations WHERE 1=1`
  const countParams: any[] = []
  
  if (status) {
    countQuery += ` AND status = ?`
    countParams.push(status)
  }
  
  if (userId) {
    countQuery += ` AND user_id = ?`
    countParams.push(userId)
  }
  
  const totalResult = await db.prepare(countQuery).get(...countParams) as { count: number }
  const total = totalResult?.count || 0

  return {
    restorations: (restorations.results || restorations).map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      scene_id: r.scene_id,
      original_url: r.original_url,
      restored_url: r.restored_url,
      status: r.status,
      payment_status: r.payment_status,
      price: r.price,
      created_at: r.created_at,
      completed_at: r.completed_at,
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    }
  }
})

