# 蜗牛AI（woniu-ai）

FDE · AI Infra · Agent 求职向 AI 实战课。

- 课程元数据：静态 TS（`src/data/courses/`）
- 免费讲义：Markdown（`src/content/courses/`）
- 数据库：Cloudflare D1（`WONIU_DB`）
- 部署：Cloudflare Pages
- 框架：React 19 + TanStack Router + Nitro

## 本地开发

```bash
pnpm install --ignore-scripts
pnpm dev          # http://localhost:5173
```

dev 模式用 Cloudflare Workers runtime（`getPlatformProxy`），自动绑定 `WONIU_DB` 到远端 D1。如需本地 SQLite，把 `nitro.config.ts` 里的 connector 切回 `better-sqlite3`。

## D1 迁移

```bash
# 远端生产 D1
wrangler d1 migrations apply woniu-ai --remote

# 本地 D1（开发）
wrangler d1 migrations apply woniu-ai --local
```

迁移文件位于 `migrations/0001_init.sql`。

## 创建 D1

```bash
wrangler d1 create woniu-ai
# 把输出的 database_id 贴到 wrangler.toml 的 [[d1_databases]] 里
```

## 部署

```bash
pnpm run deploy
```

等于 `cross-env CF_PAGES=1 pnpm run build && wrangler pages deploy dist/output/public`。

## 路由

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/courses` | 课程列表 |
| `/courses/$slug` | 课程详情（微信咨询） |
| `/courses/$slug/learn/$lessonId` | 免费 Markdown 讲义 |
| `/login` · `/profile` | 登录/个人中心 |
| `/admin` | 管理后台 |

## 关键文件

- `src/data/courses/` — 三门课静态数据
- `src/content/courses/` — 免费讲义 Markdown
- `src/lib/seo.ts` — SEO/GEO 埋点
- `src/components/WechatConsultModal.tsx` — 微信咨询弹窗
- `migrations/0001_init.sql` — D1 schema
- `wrangler.toml` — Cloudflare Pages + D1 binding
- `nitro.config.ts` — Nitro preset（默认 cloudflare-d1）
