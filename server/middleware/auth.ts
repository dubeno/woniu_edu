import process from "node:process"
import { jwtVerify } from "jose"

// dev fallback — 生产必须用环境变量覆盖
const DEV_JWT_SECRET = "woniu-ai-dev-secret-change-me-in-production-2026"

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  if (!url.pathname.startsWith("/api")) return

  // 解析 JWT secret：优先环境变量，否则 dev fallback
  const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : DEV_JWT_SECRET)

  // 必填项只剩 JWT_SECRET —— 邮件密码登录独立可用
  // GitHub OAuth 用 G_CLIENT_ID / G_CLIENT_SECRET，未配置时直接禁用那个流程
  if (!jwtSecret) {
    event.context.disabledLogin = true
    const publicApis = ["/api/init", "/api/login", "/api/auth", "/api/oauth", "/api/enable-login"]
    if (publicApis.every(p => !url.pathname.startsWith(p)))
      throw createError({ statusCode: 506, message: "Server not configured, disable login" })
    return
  }

  // 把解析到的 secret 写回 process.env 让后续 sign 调用拿到
  if (!process.env.JWT_SECRET) process.env.JWT_SECRET = jwtSecret

  const hasGithub = !!(process.env.G_CLIENT_ID && process.env.G_CLIENT_SECRET)
  event.context.hasGithub = hasGithub

  // Try to authenticate for all API routes (optional for some routes)
  const token = getHeader(event, "Authorization")?.replace(/Bearer\s*/, "")?.trim()
  if (token) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!)) as { payload?: { id: string, type: string, role?: string } }
      if (payload?.id) {
        // 从数据库加载用户信息以获取role
        let role = "photographer"
        try {
          const { getUserTable } = await import("#/database")
          const userTable = getUserTable()
          const userInfo = await userTable.getUser(payload.id)

          if (userInfo?.data) {
            try {
              const userData = JSON.parse(userInfo.data)
              role = userData.role || role
            } catch {}
          }

          // 检查环境变量中的管理员列表（支持用户ID或用户名）
          const adminUsers = process.env.ADMIN_USERS?.split(",").map(u => u.trim()) || []
          if (adminUsers.includes(payload.id) || (userInfo?.username && adminUsers.includes(userInfo.username))) {
            role = "admin"
          }
        } catch {
          // 如果加载失败，使用默认role
        }

        event.context.user = {
          id: payload.id,
          type: payload.type,
          role,
        }

        // 只在调试模式下记录JWT验证成功
        if (process.env.NODE_ENV === "development") {
          logger.debug(`JWT验证成功: 用户ID ${payload.id}, role: ${role}`)
        }
      } else {
        logger.warn("JWT payload中没有id字段")
      }
    } catch (error: any) {
      // Token verification failed, but continue for public routes
      const errorMsg = error.message || error.name || "Unknown error"
      // 只对受保护的路由记录警告，公开路由的验证失败是正常的
      const protectedRoutes = ["/api/orders", "/api/templates", "/api/me", "/api/history", "/api/credits"]
      if (protectedRoutes.some(p => url.pathname.startsWith(p))) {
        logger.warn(`JWT验证失败 (${url.pathname}): ${errorMsg}`)
        // 记录token的前几个字符用于调试（不记录完整token）
        if (token) {
          logger.debug(`Token预览: ${token.substring(0, 20)}...`)
        }
      }
      // 对于受保护的路由，会在下面检查时抛出401
    }
  }

  // Protected API routes that require authentication
  if (["/api/orders", "/api/templates", "/api/me", "/api/history", "/api/credits"].find(p => url.pathname.startsWith(p))) {
    if (!event.context.user) {
      logger.warn(`受保护的路由需要认证: ${url.pathname}`)
      throw createError({ statusCode: 401, message: "Unauthorized" })
    }
  }

  // Admin API routes require admin role
  if (url.pathname.startsWith("/api/admin")) {
    if (!event.context.user || event.context.user.role !== "admin") {
      throw createError({ statusCode: 403, message: "Forbidden" })
    }
  }
})
