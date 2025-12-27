// 支付接口（暂时模拟，后续接入真实支付）
import { getRestorationsTable } from "../../../database"

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

  if (restoration.payment_status === "paid") {
    throw createError({
      statusCode: 400,
      message: "Already paid"
    })
  }

  // TODO: 接入真实支付（微信/支付宝/Stripe）
  // 现在直接标记为已付费（Demo用）
  
  await restorationsTable.update(id, {
    payment_status: "paid"
  })

  return {
    success: true,
    message: "Payment successful",
    download_url: restoration.restored_url
  }
})


