export default defineEventHandler(() => {
  // 邮件密码登录只需要 JWT_SECRET；GitHub OAuth 是可选的
  const hasJwt = !!process.env.JWT_SECRET
  const hasGithub = !!(process.env.G_CLIENT_ID && process.env.G_CLIENT_SECRET)

  return {
    enable: hasJwt,
    github: hasGithub,
    url: hasGithub
      ? `https://github.com/login/oauth/authorize?client_id=${process.env.G_CLIENT_ID}`
      : undefined,
  }
})