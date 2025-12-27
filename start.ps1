# 启动脚本
Write-Host "🚀 启动老照片修复 MVP..." -ForegroundColor Green
Write-Host ""

# 检查环境变量
if (-not (Test-Path ".env.server")) {
    Write-Host "⚠️  .env.server 不存在，正在创建..." -ForegroundColor Yellow
    Copy-Item "example.env.server" ".env.server"
    Write-Host "✅ 已创建 .env.server，请编辑填入必要配置" -ForegroundColor Green
    Write-Host ""
}

# 检查依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 安装依赖中..." -ForegroundColor Cyan
    pnpm install
    Write-Host ""
}

# 启动开发服务器
Write-Host "🔥 启动开发服务器..." -ForegroundColor Cyan
Write-Host "访问：http://localhost:3000" -ForegroundColor Green
Write-Host ""
pnpm run dev








