import { getUserTable } from "#/database"
import { verifyPassword } from "#/utils/crypto"
import { SignJWT } from "jose"

export default defineEventHandler(async (event) => {
  if (!process.env.JWT_SECRET) {
    throw createError({
      statusCode: 500,
      message: "服务器配置错误"
    })
  }

  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "用户名和密码不能为空"
    })
  }

  const userTable = getUserTable()
  const user = await userTable.getUserByUsername(username) || await userTable.getUserByEmail(username)
  
  if (!user || !user.password_hash) {
    throw createError({
      statusCode: 401,
      message: "用户名或密码错误"
    })
  }

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: "用户名或密码错误"
    })
  }

  const token = await new SignJWT({
    id: user.id,
    type: user.type || "email",
  })
    .setExpirationTime("60d")
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }
  }
})

