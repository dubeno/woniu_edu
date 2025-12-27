// Lovart PortraitOS - Simplified Types (极简版)

export interface UserInfo {
  id: string
  email: string
  type: "github"
  created: number
  updated: number
}

// 简化：只保留核心订单字段
export interface Order {
  id: string
  customer_name: string
  customer_phone?: string
  status: "pending" | "processing" | "completed"
  created_by: string
  created_at: number
}

// 简化：只保留核心照片字段
export interface Photo {
  id: string
  order_id: string
  original_url: string
  processed_url?: string
  face_count: number
  created_at: number
}

// 新增：场景化AI图像处理记录（核心功能）
export interface Restoration {
  id: string
  user_id?: string           // 可选，未登录也能用
  scene_id?: string          // 场景ID，默认 old-photo-restoration
  original_url: string
  restored_url?: string
  status: "pending" | "processing" | "completed" | "failed"
  payment_status: "unpaid" | "paid"
  price: number              // 单位：分
  error?: string
  created_at: number
  completed_at?: number
}

// 付费订阅（朱啸虎：商业化）
export interface Subscription {
  id: string
  user_id: string
  plan: "trial" | "basic" | "pro"
  price: number
  status: "active" | "cancelled" | "expired"
  started_at: number
  expires_at: number
  photos_limit: number
  photos_used: number
}
