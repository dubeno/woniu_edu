export default defineEventHandler(() => {
  const hasConfig = !!(process.env.JWT_SECRET && process.env.G_CLIENT_ID && process.env.G_CLIENT_SECRET)
  
  return {
    enable: hasConfig,
    url: process.env.G_CLIENT_ID 
      ? `https://github.com/login/oauth/authorize?client_id=${process.env.G_CLIENT_ID}`
      : undefined,
  }
})
