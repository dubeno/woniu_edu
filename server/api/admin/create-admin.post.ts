import { getUserTable } from "#/database"
import { hashPassword } from "#/utils/crypto"

/**
 * 创建管理员账号（仅开发环境或首次设置时使用）
 * 生产环境建议通过环境变量 ADMIN_USERS 配置
 */
export default defineEventHandler(async (event) => {
  // 仅允许在开发环境或通过特殊密钥访问
  const secretKey = getHeader(event, "X-Admin-Secret") || getQuery(event).secret
  const expectedSecret = process.env.ADMIN_CREATE_SECRET || "dev-only-change-in-production"
  
  if (process.env.NODE_ENV === "production" && secretKey !== expectedSecret) {
    throw createError({ statusCode: 403, message: "Forbidden" })
  }

  const body = await readBody(event)
  const { username, email, password } = body

  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      message: "用户名、邮箱和密码不能为空"
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: "密码长度至少6个字符"
    })
  }

  const userTable = getUserTable()
  const passwordHash = await hashPassword(password)
  
  try {
    const userId = await userTable.createUser(username, email, passwordHash)
    
    // 设置用户为管理员
    await userTable.setData(userId, JSON.stringify({ role: "admin" }))
    
    return {
      success: true,
      message: "管理员账号创建成功",
      userId,
      username,
      email,
      note: "请将用户ID添加到环境变量 ADMIN_USERS 中以确保权限持久化"
    }
  } catch (error: any) {
    if (error.message?.includes("已存在")) {
      throw createError({
        statusCode: 409,
        message: error.message
      })
    }
    throw error
  }
})

