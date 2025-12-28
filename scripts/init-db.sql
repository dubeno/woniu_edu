-- Cloudflare D1 数据库初始化脚本
-- 执行命令: npx wrangler d1 execute wow --remote --file=./scripts/init-db.sql

-- 用户表
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  data TEXT,
  type TEXT,
  avatar TEXT,
  credits INTEGER DEFAULT 0,
  created INTEGER,
  updated INTEGER
);

-- 创建唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username ON user(username) WHERE username IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON user(email) WHERE email IS NOT NULL;

-- 生成记录表
CREATE TABLE IF NOT EXISTS restorations (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  scene_id TEXT NOT NULL,
  original_url TEXT NOT NULL,
  restored_url TEXT,
  restored_urls TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  price INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  completed_at INTEGER
);

-- 订阅表
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created INTEGER NOT NULL,
  updated INTEGER NOT NULL
);

-- 限流表
CREATE TABLE IF NOT EXISTS rate_limits (
  ip TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  reset_at INTEGER NOT NULL
);

-- 积分历史表
CREATE TABLE IF NOT EXISTS credit_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  operator_id TEXT,
  operator_type TEXT,
  created_at INTEGER NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_credit_history_user_id ON credit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_history_created_at ON credit_history(created_at);

-- 验证表是否创建成功
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

