import { buildCourse, chapter } from './factory'

const chapters = [
  chapter('infra-0', '免费资料 · Markdown 讲义', [
    { title: 'AI Infra 推理优化速查表', duration: '阅读', preview: true, freeMarkdown: true },
  ], '15m'),
  chapter('infra-1', '模块一 · 推理性能全景', [
    { title: '1-1. Latency / Throughput / Cost 三角', duration: '24m', preview: true },
    { title: '1-2. Prefill vs Decode 与瓶颈定位', duration: '26m' },
    { title: '1-3. Profiling 工具链入门', duration: '22m' },
    { title: '1-4. 线上 SLA 与容量规划', duration: '20m' },
  ], '1h 32m'),
  chapter('infra-2', '模块二 · 模型压缩与量化', [
    { title: '2-1. FP16 / INT8 / INT4 权衡', duration: '28m', preview: true },
    { title: '2-2. GPTQ、AWQ 等量化方案对比', duration: '30m' },
    { title: '2-3. 精度回归测试与评测集', duration: '24m' },
    { title: '2-4. 蒸馏与小模型路由', duration: '22m' },
  ], '1h 44m'),
  chapter('infra-3', '模块三 · 推理引擎与调度', [
    { title: '3-1. vLLM / TensorRT-LLM 架构要点', duration: '32m' },
    { title: '3-2. Continuous Batching 与 KV Cache', duration: '28m' },
    { title: '3-3. 多卡并行与 PD 分离', duration: '26m' },
    { title: '3-4. Speculative Decoding 实战', duration: '24m' },
  ], '1h 50m'),
  chapter('infra-4', '模块四 · 生产级优化闭环', [
    { title: '4-1. 压测方法论与成本核算', duration: '26m' },
    { title: '4-2. 缓存、路由与降级策略', duration: '24m' },
    { title: '4-3. 案例：10x 吞吐优化复盘', duration: '34m' },
  ], '1h 24m'),
]

export const aiInfraCourse = buildCourse({
  slug: 'ai-infra',
  title: 'AI Infra 推理优化 · 从 Profiling 到 10x 吞吐',
  seoTitle: 'AI Infra 推理优化',
  badge: '技术深度',
  coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  description:
    '面向生产环境的 LLM 推理优化实战：量化压缩、vLLM/TensorRT 调度、KV Cache 与批处理策略，配套压测与成本核算方法，把推理成本打下来。',
  learningObjectives: [
    '读懂推理链路瓶颈，建立 Latency-Throughput-Cost 优化视角',
    '选型并落地量化方案，控制精度损失在可接受范围',
    '理解 Continuous Batching、KV Cache、多卡并行等核心机制',
    '完成一次从 Profiling 到上线的完整优化闭环',
  ],
  chapters,
  price: 5999,
  originalPrice: 8999,
  seoKeywords: [
    'AI Infra 求职',
    'LLM 推理优化',
    'vLLM 面试题',
    'MLE 面试',
    'KV Cache',
    '模型量化',
    '推理工程师',
    'System Design 推理',
  ],
  painPoints: [
    '简历写用过 vLLM 却被追问 Continuous Batching',
    'System Design 设计百万 QPS 推理服务没思路',
    '从算法岗转 Infra 不知道量化怎么讲',
    '大厂 AI Infra OA 和现场 coding 缺乏准备',
  ],
  geoSummary:
    '蜗牛AI AI Infra 推理优化课：覆盖量化、vLLM、KV Cache 与压测成本核算，配套免费 Markdown 速查表，适合 MLE/Infra 求职者与技术深度提升。',
})
