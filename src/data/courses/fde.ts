import { buildCourse, chapter } from './factory'

const chapters = [
  chapter('fde-0', '免费资料 · Markdown 讲义', [
    { title: 'FDE 求职与交付入门讲义', duration: '阅读', preview: true, freeMarkdown: true },
  ], '15m'),
  chapter('fde-1', '模块一 · FDE 角色与交付心智', [
    { title: '1-1. 什么是 Forward Deployed Engineer', duration: '22m', preview: true },
    { title: '1-2. 从 Demo 到 Production 的鸿沟', duration: '20m' },
    { title: '1-3. 客户现场 vs 远程交付的节奏', duration: '18m' },
    { title: '1-4. 技术、产品、商务的三角协作', duration: '24m' },
  ], '1h 24m'),
  chapter('fde-2', '模块二 · 需求澄清与 POC 设计', [
    { title: '2-1. 客户访谈与问题拆解框架', duration: '26m', preview: true },
    { title: '2-2. 可行性评估与范围控制', duration: '22m' },
    { title: '2-3. POC 里程碑与验收标准', duration: '20m' },
    { title: '2-4. 风险清单与回滚预案', duration: '19m' },
  ], '1h 27m'),
  chapter('fde-3', '模块三 · 集成交付与上线', [
    { title: '3-1. 企业环境接入：SSO、VPC、合规', duration: '28m' },
    { title: '3-2. 数据管道与权限边界', duration: '25m' },
    { title: '3-3. 灰度发布与监控告警', duration: '23m' },
    { title: '3-4. 交接文档与运维 Runbook', duration: '21m' },
  ], '1h 37m'),
  chapter('fde-4', '模块四 · 复盘与规模化', [
    { title: '4-1. 案例复盘：金融场景 FDE 全流程', duration: '32m' },
    { title: '4-2. 从单次交付到可复用 Playbook', duration: '24m' },
    { title: '4-3. 向上管理与续约策略', duration: '20m' },
  ], '1h 16m'),
]

export const fdeCourse = buildCourse({
  slug: 'fde',
  title: 'FDE 实战 · 从客户现场到可上线 AI 交付',
  seoTitle: 'FDE 实战交付课',
  badge: '企业交付',
  coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  description:
    '系统掌握 Forward Deployed Engineer 的交付方法论：需求澄清、POC 设计、企业集成、上线运维与复盘，把 AI 项目从「能演示」做到「能续费」。',
  learningObjectives: [
    '建立 FDE 心智模型，明确技术交付与商业结果的连接方式',
    '用结构化框架完成客户访谈、范围控制与 POC 验收',
    '掌握企业环境集成、灰度上线与运维交接的关键 checklist',
    '沉淀可复用 Playbook，支撑团队规模化交付',
  ],
  chapters,
  price: 4999,
  originalPrice: 6999,
  seoKeywords: [
    'FDE 求职',
    'Forward Deployed Engineer',
    'AI 工程师找工作',
    '转码 AI',
    '无实习进大厂',
    'Behavior Interview',
    '北美 NG 求职',
    'POC 交付',
  ],
  painPoints: [
    '转行 AI 不知道 FDE 和 SDE 面试差在哪',
    '简历没有大厂实习，项目经历不知道怎么写',
    '行为面被问客户现场推进却答不上来',
    '想冲 OpenAI/Anthropic 类 FDE 岗缺 POC 叙事',
  ],
  geoSummary:
    '蜗牛AI FDE 实战课：面向留学生与转码求职者的 AI 落地交付训练，覆盖客户访谈、POC 设计、企业集成与面试叙事，免费 Markdown 讲义可试读。',
})
