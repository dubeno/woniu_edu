-- 蜗牛AI D1 schema
-- 课程表（静态课程元数据 + SEO/GEO 字段）
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  seo_title TEXT,
  badge TEXT,
  cover_image TEXT,
  description TEXT,
  learning_objectives TEXT, -- JSON array
  lecture_count INTEGER DEFAULT 0,
  total_duration TEXT,
  rating REAL DEFAULT 5,
  review_count INTEGER DEFAULT 0,
  instructor TEXT, -- JSON
  chapters TEXT, -- JSON array
  plans TEXT, -- JSON array
  faqs TEXT, -- JSON array
  reviews TEXT, -- JSON array
  includes TEXT, -- JSON array
  seo_keywords TEXT, -- JSON array
  pain_points TEXT, -- JSON array
  geo_summary TEXT,
  free_lesson_id TEXT DEFAULT 'free-intro',
  published INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published);

-- 学员表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  password_hash TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  wechat_openid TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 订单
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  email TEXT NOT NULL,
  name TEXT,
  items TEXT NOT NULL, -- JSON
  total INTEGER NOT NULL,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  promo_code TEXT,
  utm_source TEXT,
  utm_channel TEXT,
  created_at INTEGER NOT NULL,
  paid_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_channel ON orders(utm_channel);

-- 报名（订单付款后写入）
CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  order_id TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, course_slug)
);

-- 学习进度
CREATE TABLE IF NOT EXISTS progress (
  user_id TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  watched_seconds INTEGER DEFAULT 0,
  completed_at INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, course_slug, lesson_id)
);

-- UTM / 渠道归因（页面入口捕获，落地转化）
CREATE TABLE IF NOT EXISTS attribution (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  channel_code TEXT,
  referrer TEXT,
  landing_path TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attribution_channel ON attribution(channel_code);
CREATE INDEX IF NOT EXISTS idx_attribution_source ON attribution(utm_source);

-- 事件埋点（咨询弹窗 / 免费讲义阅读 / GEO 印象）
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  type TEXT NOT NULL,
  course_slug TEXT,
  payload TEXT, -- JSON
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_course ON events(course_slug);

-- 销售线索（扫了微信的）
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL, -- 'wechat-qr' | 'consult'
  course_slug TEXT,
  note TEXT,
  contact TEXT,
  created_at INTEGER NOT NULL
);
