import { getUserTable } from "#/database"
import { hashPassword } from "#/utils/crypto"
import { SignJWT } from "jose"

export default defineEventHandler(async (event) => {
  if (!process.env.JWT_SECRET) {
    throw createError({
      statusCode: 500,
      message: "服务器配置错误"
    })
  }

  const body = await readBody(event)
  const { username, email, password } = body

  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      message: "用户名、邮箱和密码不能为空"
    })
  }

  if (username.length < 3 || username.length > 20) {
    throw createError({
      statusCode: 400,
      message: "用户名长度必须在3-20个字符之间"
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: "密码长度至少6个字符"
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      message: "邮箱格式不正确"
    })
  }

  const userTable = getUserTable()
  const passwordHash = await hashPassword(password)
  
  try {
    const userId = await userTable.createUser(username, email, passwordHash)
    
    const token = await new SignJWT({
      id: userId,
      type: "email",
    })
      .setExpirationTime("60d")
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    return {
      token,
      user: {
        id: userId,
        username,
        email,
      }
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

