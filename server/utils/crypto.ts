import _md5 from "md5"
import { subtle as _ } from "uncrypto"

type T = typeof crypto.subtle
const subtle: T = _

export async function md5(s: string) {
  try {
    // https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
    // cloudflare worker support md5
    return await myCrypto(s, "MD5")
  } catch {
    return _md5(s)
  }
}

type Algorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"
export async function myCrypto(s: string, algorithm: Algorithm) {
  const sUint8 = new TextEncoder().encode(s)
  const hashBuffer = await subtle.digest(algorithm, sUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

// 密码哈希和验证
export async function hashPassword(password: string): Promise<string> {
  // 使用 bcrypt 或简单的 SHA-256 + salt
  // 这里使用 SHA-256 + 固定salt（生产环境应使用随机salt）
  const salt = process.env.PASSWORD_SALT || "wow-salt-2025"
  const hash = await myCrypto(password + salt, "SHA-256")
  return hash
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}
