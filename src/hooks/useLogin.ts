import { useCallback, useEffect } from "react"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { myFetch } from "~/utils"

const userAtom = atomWithStorage<{
  id?: string
  username?: string
  email?: string
  avatar?: string
  name?: string
  credits?: number
  role?: string
}>("user", {})

export const jwtAtom = atomWithStorage("jwt", "")

const enableLoginAtom = atomWithStorage<{
  enable: boolean
  url?: string
}>("login", {
  enable: true,
})

enableLoginAtom.onMount = (set) => {
  myFetch("/enable-login").then((r) => {
    set(r)
  }).catch((e) => {
    if (e.statusCode === 506) {
      set({ enable: false })
      localStorage.removeItem("jwt")
    }
  })
}

export function useLogin() {
  const [userInfo, setUserInfo] = useAtom(userAtom)
  const [jwt, setJwt] = useAtom(jwtAtom)
  const enableLogin = useAtomValue(enableLoginAtom)

  // 登录（账号密码）
  const loginWithPassword = useCallback(async (username: string, password: string) => {
    try {
      const response = await myFetch("/api/auth/login", {
        method: "POST",
        body: { username, password }
      })
      
      if (response.token) {
        setJwt(response.token)
        setUserInfo({
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          avatar: response.user.avatar,
          credits: 0, // 登录后需要重新获取积分
        })
        // 登录后立即获取用户信息（包括积分）
        // fetchUserInfo会在useEffect中自动调用
        return { success: true }
      }
      return { success: false, message: "登录失败" }
    } catch (error: any) {
      console.error("登录错误:", error)
      // 从错误响应中提取消息
      const errorMessage = error.data?.message || error.message || "登录失败，请检查用户名和密码"
      return { success: false, message: errorMessage }
    }
  }, [setJwt, setUserInfo])

  // 注册
  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      const response = await myFetch("/api/auth/register", {
        method: "POST",
        body: { username, email, password }
      })
      
      if (response.token) {
        setJwt(response.token)
        setUserInfo({
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          credits: 0, // 注册后需要重新获取积分
        })
        // 注册后立即获取用户信息（包括积分）
        setTimeout(() => {
          fetchUserInfo()
        }, 100)
        return { success: true }
      }
      return { success: false, message: "注册失败" }
    } catch (error: any) {
      return { success: false, message: error.message || "注册失败" }
    }
  }, [setJwt, setUserInfo])

  // GitHub登录（保留原有功能）
  const login = useCallback(() => {
    window.location.href = enableLogin.url || "/api/login"
  }, [enableLogin])

  const logout = useCallback(() => {
    setJwt("")
    setUserInfo({})
    window.location.href = "/"
  }, [setJwt, setUserInfo])

  // 获取当前用户信息
  const fetchUserInfo = useCallback(async () => {
    if (!jwt) {
      // 如果没有JWT，清除用户信息
      setUserInfo({})
      return
    }
    
    try {
      const response = await myFetch("/api/me", {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      
      // 更新用户信息（但不覆盖username等）
      setUserInfo(prev => ({
        ...prev,
        id: response.id,
        username: response.username || prev.username,
        email: response.email || prev.email,
        avatar: response.avatar || prev.avatar,
        credits: response.credits || prev.credits || 0,
        role: response.role || prev.role || "photographer",
      }))
    } catch (error: any) {
      // 如果token失效，清除JWT和用户信息
      console.error("获取用户信息失败:", error)
      if (error.statusCode === 401) {
        console.warn("JWT token已过期，清除登录状态")
        setJwt("")
        setUserInfo({})
      }
    }
  }, [jwt, setJwt, setUserInfo])

  // 初始化时获取用户信息
  useEffect(() => {
    if (jwt) {
      fetchUserInfo()
    }
  }, [jwt, fetchUserInfo])

  return {
    loggedIn: !!jwt,
    userInfo,
    enableLogin: !!enableLogin.enable,
    logout,
    login,
    loginWithPassword,
    register,
    fetchUserInfo, // 导出以便外部调用
  }
}
