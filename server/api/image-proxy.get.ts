/**
 * 简单图片代理，解决第三方签名 URL 无 CORS 导致前端无法加载的问题
 * 用法：/api/image-proxy?url=ENCODED_URL
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const target = query.url as string

  if (!target) {
    throw createError({ statusCode: 400, message: "Missing url" })
  }

  try {
    const resp = await fetch(target)
    if (!resp.ok) {
      throw createError({ statusCode: resp.status, message: `Fetch failed: ${resp.statusText}` })
    }

    const buffer = await resp.arrayBuffer()
    const contentType = resp.headers.get("content-type") || "image/jpeg"

    // 允许跨域
    setResponseHeader(event, "Access-Control-Allow-Origin", "*")

    return new Response(Buffer.from(buffer), {
      headers: {
        "Content-Type": contentType,
      },
    })
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Proxy fetch failed",
    })
  }
})




