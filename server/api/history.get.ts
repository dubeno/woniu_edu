import { getRestorationsTable } from "#/database"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" })
  }

  const restorationsTable = getRestorationsTable()
  const history = await restorationsTable.listByUser(user.id)

  return history.map(item => ({
    id: item.id,
    scene_id: item.scene_id,
    original_url: item.original_url,
    restored_url: item.restored_url,
    restored_urls: item.restored_urls || (item.restored_url ? [item.restored_url] : []),
    status: item.status,
    payment_status: item.payment_status,
    price: item.price,
    created_at: item.created_at,
    completed_at: item.completed_at,
  }))
})

