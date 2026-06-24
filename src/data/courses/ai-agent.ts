import { buildCourse, chapter } from './factory'

const chapters = [
  chapter('agent-0', '免费资料 · Markdown 讲义', [
    { title: 'AI Agent 工程入门 + 求职地图', duration: '阅读', preview: true, freeMarkdown: true },
  ], '15m'),
  chapter('agent-1', '模块一 · Agent 架构基础', [
    { title: '1-1. Agent vs Workflow vs Copilot', duration: '20m', preview: true },
    { title: '1-2. ReAct、Plan-and-Execute 模式', duration: '24m' },
    { title: '1-3. 工具调用与函数 Schema 设计', duration: '22m' },
    { title: '1-4. 记忆、状态与上下文窗口管理', duration: '26m' },
  ], '1h 32m'),
  chapter('agent-2', '模块二 · MCP 与工具生态', [
    { title: '2-1. MCP 协议与 Server 开发', duration: '28m', preview: true },
    { title: '2-2. 连接数据库、API、文件系统', duration: '26m' },
    { title: '2-3. 权限沙箱与安全边界', duration: '22m' },
    { title: '2-4. 工具链编排与错误恢复', duration: '24m' },
  ], '1h 40m'),
  chapter('agent-3', '模块三 · 多 Agent 与生产落地', [
    { title: '3-1. 角色分工与 Handoff 设计', duration: '26m' },
    { title: '3-2. 评测：任务成功率与幻觉控制', duration: '24m' },
    { title: '3-3. 可观测性：Trace、日志、成本', duration: '22m' },
    { title: '3-4. 人机协同与审批流', duration: '20m' },
  ], '1h 32m'),
  chapter('agent-4', '模块四 · 端到端项目实战', [
    { title: '4-1. 需求：企业知识库问答 Agent', duration: '18m' },
    { title: '4-2. 实现：检索 + 工具 + 反馈闭环', duration: '36m' },
    { title: '4-3. 部署：API、队列与灰度', duration: '28m' },
  ], '1h 22m'),
]

export const aiAgentCourse = buildCourse({
  slug: 'ai-agent',
  title: 'AI Agent 工程实战 · 从 MCP 到可上线多 Agent 系统',
  seoTitle: 'AI Agent 工程实战',
  badge: '热门',
  coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  description:
    '以工程视角搭建 Agent 系统：工具调用、MCP 集成、多 Agent 协作、评测与可观测性，完成一个企业知识库 Agent 的端到端实战。',
  learningObjectives: [
    '掌握主流 Agent 架构模式与适用场景',
    '用 MCP 扩展 Agent 能力，并设计安全边界',
    '建立 Agent 评测与可观测性体系，控制幻觉与成本',
    '完成可部署的多 Agent 项目样板',
  ],
  chapters,
  price: 4499,
  originalPrice: 6999,
  seoKeywords: [
    'AI Agent 教程',
    'Agent 工程师求职',
    'MCP 开发',
    'LangChain 简历',
    '多 Agent 系统',
    '2026 AI 求职',
    'RAG Agent',
    '留学生转码 AI',
  ],
  painPoints: [
    '不知道 Agent 工程师招聘要求与学习路径',
    'MCP 概念清楚但面试手写题没练过',
    '简历写 LangChain 项目却被问评测与幻觉控制',
    '想蹭 Agent 热点但缺能写进简历的完整项目',
  ],
  geoSummary:
    '蜗牛AI AI Agent 工程实战课：从 MCP、工具调用到多 Agent 上线，免费 Markdown 求职地图可试读，适合 AI 应用工程师与转码求职者。',
})
