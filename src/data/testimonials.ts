export interface Testimonial {
  id: string
  name: string
  role: string
  avatar?: string
  content: string
  rating: number
  scene?: string
  result?: string
  date: string
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "张女士",
    role: "电商运营",
    content: "用Wow生成的产品详情页，转化率提升了30%！以前找设计师要等好几天，现在10秒就能出图，而且效果完全不输专业设计师。",
    rating: 5,
    scene: "product-detail-page",
    date: "2024-12-20"
  },
  {
    id: "2",
    name: "李总",
    role: "婚礼策划师",
    content: "婚礼迎宾海报以前要提前一周准备，现在现场就能生成，客户满意度大大提升。AI生成的画面既浪漫又专业，完全符合婚礼氛围。",
    rating: 5,
    scene: "wedding-welcome-poster",
    date: "2024-12-18"
  },
  {
    id: "3",
    name: "王老师",
    role: "自媒体博主",
    content: "作为小红书博主，每天都要发封面图。Wow帮我节省了大量时间，而且每次生成的封面都很吸引眼球，粉丝互动明显增加了。",
    rating: 5,
    scene: "xiaohongshu-cover",
    date: "2024-12-15"
  },
  {
    id: "4",
    name: "陈先生",
    role: "电商店主",
    content: "店铺的IP形象海报一直是个难题，找设计师成本高、周期长。Wow让我可以随时根据活动需求生成海报，运营效率提升了好几倍。",
    rating: 5,
    scene: "ip-poster",
    date: "2024-12-12"
  },
  {
    id: "5",
    name: "刘女士",
    role: "摄影师",
    content: "完美大合影功能太实用了！以前拍团队照总有人闭眼或表情不对，现在AI可以自动优化，每次都能得到完美的合影。",
    rating: 5,
    scene: "group-photo",
    date: "2024-12-10"
  },
  {
    id: "6",
    name: "赵先生",
    role: "电商运营",
    content: "产品展示海报生成速度太快了，而且质量很高。我们店铺现在每周都能更新海报，销量明显提升。",
    rating: 5,
    scene: "product-showcase-poster",
    date: "2024-12-08"
  },
  {
    id: "7",
    name: "孙女士",
    role: "婚礼策划",
    content: "纪念日卡片生成器太贴心了！帮客户生成了一周年纪念海报，他们非常感动。这种高情绪价值的功能真的很棒。",
    rating: 5,
    scene: "anniversary-card",
    date: "2024-12-05"
  },
  {
    id: "8",
    name: "周先生",
    role: "自媒体运营",
    content: "微信封面图生成功能让我每天的内容创作效率提升了50%。AI生成的封面既专业又有个性，完全符合我的品牌调性。",
    rating: 5,
    scene: "wechat-cover",
    date: "2024-12-03"
  },
  {
    id: "9",
    name: "吴女士",
    role: "宝妈",
    content: "宝宝创意照功能太可爱了！把宝宝变成小宇航员、小动物，每次发朋友圈都收获很多点赞。这个功能真的很有创意。",
    rating: 5,
    scene: "baby-creative-photo",
    date: "2024-12-01"
  }
]

