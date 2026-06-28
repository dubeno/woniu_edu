import type { Course } from '~/types/course'

/** 首页数据 — teachify 风格的信任 + 价值 + 学习路径 */
export interface Stat {
  label: string
  value: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ServicePlan {
  /** 卡片编号 01-06 */
  step: string
  title: string
  /** 一段话摘要，作为卡片正文 */
  summary: string
  /** 列表形式的要点 */
  bullets: string[]
}

export const heroStats: Stat[] = [
  { label: '学员拿下面试', value: '120+' },
  { label: '覆盖公司', value: '50+' },
  { label: '课程模块', value: '60+' },
  { label: '免费讲义', value: '6 篇' },
]



/** AI Infra 求职陪跑 6 步法 — C9 博士后企业一线专家 1v1 带教 */
export const servicePlan: ServicePlan[] = [
  {
    step: '01',
    title: '简历深度挖掘',
    summary:
      '简历深度挖掘：简历通词句优化、项目升华，技术亮点和项目亮点深挖，硬核技能输入，制定高阶简历目标，靶向学习。',
    bullets: [
      '一份优秀的简历是获得面试机会的关键，我们将用 10 年架构内功为你量身打造一个金光闪闪的绝世好简历',
      '让面试官审阅 3 次，因人施教、语言指导，深挖项目亮点、技术亮点，制定高目标、靶向学习，让你的简历在众多应聘者中脱颖而出',
    ],
  },
  {
    step: '02',
    title: '定制求职规划',
    summary:
      '量身定制求职和技能学习计划，确保您高效地备面面试并找到理想的工作。',
    bullets: [
      '通过帮您在硕大模型和 Infra 领域的内容传授给您，进行认知升级，技能升级，表达升级，跨维升级',
      '最终实现高薪 offer，实现弯道加速 5 年，打造个人飞跃成长曲线',
    ],
  },
  {
    step: '03',
    title: '硬核实操课程',
    summary:
      '系统化、体系化大模型硬核技能，高薪必备，提供全网最落地企业 AI Infra 技能需求学习路径和材料。',
    bullets: [
      '覆盖 vLLM 框架、SGLang、CUDA 算子开发、性能优化、精度优化、理论 + 项目实操',
      '跟着做，听不懂 6 个月，新手 3 个月 · 半年成专家',
      '通过提供的体系化、闭门课程，掌握一线 Infra 核心高薪技能',
    ],
  },
  {
    step: '04',
    title: '模拟 / 面试辅导',
    summary: '面试前 / 中 / 后 全流程辅导，全真模拟面试 + 题目答疑 + Offer 谈判。',
    bullets: [
      '面试前：老师将全开展全真模拟面试，通过语音或者 Meeting 会议，1v1 实战演练，熟出你的知识盲区和痛点，传授表述秘诀，让你临场不慌，从容拿捏面试',
      '面试中：提供全面的面试问题解答服务，帮你理解并应对各种面试挑战，提升面试技巧，包括复杂问题处理',
      '面试后：进行面试复盘，调整面试策略，谈 offer 时的谈薪话术，如何提出合理薪酬区间，策略，帮助你多拿薪资',
    ],
  },
  {
    step: '05',
    title: '1v1 私教咨询',
    summary:
      '成为长期会员，享受最具价值的持续咨询服务，学进度到问题可以随时提问答疑，来自一线实际工作的经验一语胜千言，突破认知、走出新的道路。',
    bullets: [
      '如果单按咨询费 599 / 小时起步，是您升级开智路上的强大智库。前程是个人，需要丰动',
    ],
  },
  {
    step: '06',
    title: '服务形式',
    summary: '文字材料 + 配套试听 · 持续更新 + 老学员有效期内免费获取增值服务。',
    bullets: [
      '文字材料 + 配套试听，持续更新',
      '老学员有效期内免费获取增值服务',
      '2v1 私教咨询（群聊、语音、Meeting）',
    ],
  },
]

/** AI Infra 求职陪跑价目表 — 套餐 2 (¥8,000) */
export const coachingPlan = {
  name: 'AI Infra 求职陪跑',
  packageName: '套餐 2',
  price: 8000,
  duration: '一年',
  highlights: [
    'C9 博士后 · 企业一线在职专家亲带',
    '一年内不限次 1v1 + 群聊答疑',
    '简历三件套 + 模拟面试 + Offer 谈判',
  ],
  categories: [
    {
      title: '课程辅导',
      items: ['课程文档', '配套视频', '日常答疑'],
    },
    {
      title: '项目植入',
      items: ['硬核项目', '路线规划'],
    },
    {
      title: '求职辅导',
      items: ['简历优化', '表达技巧', '模拟面试', '面试复盘'],
    },
    {
      title: '服务时长',
      items: ['一年'],
    },
  ],
}

/** 三大产品包 —— 课程 + 求职陪跑 二合一 */
export interface Bundle {
  slug: 'fde' | 'ai-app' | 'ai-infra'
  name: string
  tagline: string
  badge: string
  price: number
  duration: string
  pitch: string
  highlights: string[]
  curriculum: string[]
  projects: string[]
  outcomes: string[]
  coaching: { title: string; items: string[] }[]
}

export const bundles: Bundle[] = [
  {
    slug: 'fde',
    name: 'FDE',
    tagline: '课程 + 求职陪跑',
    badge: '入门首选',
    price: 6000,
    duration: '一年',
    pitch: 'Forward Deployed Engineer 方向：客户叙事、客户对接、POC 端到端交付，冲刺 AI 大厂 / 独角兽 FDE 岗位。',
    highlights: [
      '客户叙事 · Stakeholder 沟通',
      'POC 端到端交付 · Playbook 沉淀',
      '简历项目段公式 · 客户故事公式',
    ],
    curriculum: [
      '课程文档',
      '配套视频',
      '日常答疑',
    ],
    projects: [
      '硬核项目',
      '路线规划',
    ],
    outcomes: [
      '简历优化',
      '表达技巧',
      '模拟面试',
      '面试复盘',
    ],
    coaching: [
      { title: '课程辅导', items: ['课程文档', '日常答疑'] },
      { title: '项目植入', items: ['硬核项目', '路线规划'] },
      { title: '求职辅导', items: ['简历优化', '表达技巧', '模拟面试', '面试复盘'] },
      { title: '服务时长', items: ['一年'] },
    ],
  },
  {
    slug: 'ai-app',
    name: 'AI 应用',
    tagline: '课程 + 求职陪跑',
    badge: '主流赛道',
    price: 6000,
    duration: '一年',
    pitch: '从 LLM API 到 Agent / RAG 全栈应用，配套项目植入与模拟面试，冲刺 AI 应用工程师岗位。',
    highlights: [
      'LLM API · Prompt Engineering · Agent 编排',
      'RAG · Function Calling · 工具调用',
      '简历项目段公式 · POC 模板',
    ],
    curriculum: [
      '课程文档',
      '日常答疑',
    ],
    projects: [
      '硬核项目',
      '路线规划',
    ],
    outcomes: [
      '简历优化',
      '表达技巧',
      '模拟面试',
      '面试复盘',
    ],
    coaching: [
      { title: '课程辅导', items: ['课程文档', '日常答疑'] },
      { title: '项目植入', items: ['硬核项目', '路线规划'] },
      { title: '求职辅导', items: ['简历优化', '表达技巧', '模拟面试', '面试复盘'] },
      { title: '服务时长', items: ['一年'] },
    ],
  },
  {
    slug: 'ai-infra',
    name: 'AI Infra',
    tagline: '课程 + 求职陪跑',
    badge: '高薪进阶',
    price: 8000,
    duration: '一年',
    pitch: '覆盖 vLLM / SGLang / CUDA 算子 / 推理优化，针对 AI Infra 与大模型系统岗位。',
    highlights: [
      'vLLM / SGLang 推理框架源码',
      'CUDA 算子 · 性能优化 · 精度优化',
      '系统设计 · 部署模板 · 内部推荐',
    ],
    curriculum: [
      '课程文档',
      '配套视频',
      '日常答疑',
    ],
    projects: [
      '硬核项目',
      '路线规划',
    ],
    outcomes: [
      '简历优化',
      '表达技巧',
      '模拟面试',
      '面试复盘',
    ],
    coaching: [
      { title: '课程辅导', items: ['课程文档', '配套视频', '日常答疑'] },
      { title: '项目植入', items: ['硬核项目', '路线规划'] },
      { title: '求职辅导', items: ['简历优化', '表达技巧', '模拟面试', '面试复盘'] },
      { title: '服务时长', items: ['一年'] },
    ],
  },
]

export const homeFaqs: FaqItem[] = [
  {
    question: '我是转码 / NG，没有大厂实习能学吗？',
    answer:
      '完全可以。三门课的 12 周上岸路径都是从 0 开始，简历项目段我们给三行公式 + POC 模板，可演示交付物比实习更被面试官记住。',
  },
  {
    question: '课程视频还是直播？',
    answer:
      '正课是录播视频 + 配套 Markdown 讲义 + GitHub 仓库，支持 1 年内回看。每月 1 次直播答疑 + 模拟面试。',
  },
  {
    question: '可以单独买一门吗？',
    answer:
      '三门课独立销售，按你的目标岗位选一门做透；FDE / AI Infra / Agent 三选一，或者三门打包有学员价。',
  },
  {
    question: '学完能 offer 吗？',
    answer:
      '我们不承诺 offer，但 80%+ 学员在 12 周内拿到至少 2 个目标公司面试。决定结果的是你的基础 + 投入，课程提供最稳的学习路径。',
  },
  {
    question: '海外能买吗？',
    answer:
      '支持微信 / 支付宝 / Stripe。海外同学可走 Stripe，按 USD 结算，发票走 Invoice。',
  },
]


export function pickFeaturedCourses(all: Course[], limit = 3): Course[] {
  return all.slice(0, limit)
}
