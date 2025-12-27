// 查询修复记录
import { getRestorationsTable } from "../../database"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing restoration ID"
    })
  }

  const restorationsTable = getRestorationsTable()
  const restoration = await restorationsTable.get(id)

  if (!restoration) {
    throw createError({
      statusCode: 404,
      message: "Restoration not found"
    })
  }

  return restoration
})


