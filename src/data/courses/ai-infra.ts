import { buildCourse, chapter } from './factory'

const chapters = [
  // 0. 免费讲义
  chapter('infra-0', '免费资料 · Markdown 讲义', [
    { title: 'AI Infra 推理优化速查表', duration: '阅读', preview: true, freeMarkdown: true },
  ], '15m'),

  // 1. 总体介绍
  chapter('infra-1', '模块一 · 总体介绍', [
    { title: '1-1. 大模型发展和 Infra', duration: '24m', preview: true },
    { title: '1-2. AI 芯片与 GPU 体系架构 · 软件体系 · 互联详解', duration: '32m' },
    { title: '1-3. AI 系统简介', duration: '20m' },
    { title: '1-4. AI 数据中心 / 集群芯片所推广的 AI Infra', duration: '26m' },
    { title: '1-5. 就业市场需求的脑力趋势：计算、存储、性能', duration: '20m' },
  ], '2h 02m'),

  // 2. PyTorch 详解
  chapter('infra-2', '模块二 · PyTorch 详解', [
    { title: '2-1. Tensor', duration: '20m' },
    { title: '2-2. Tensor 算子封装和扩展', duration: '26m' },
    { title: '2-3. 分布式通信库和通信拓扑', duration: '24m' },
    { title: '2-4. PyTorch 存储机制和优化', duration: '22m' },
    { title: '2-5. Torch.compile', duration: '28m' },
    { title: '2-6. CUDA Graph', duration: '24m' },
  ], '2h 24m'),

  // 3. LLM 基础
  chapter('infra-3', '模块三 · LLM 基础', [
    { title: '3-1. KVcache 及其内存管理', duration: '28m' },
    { title: '3-2. Attention 系列（flash attention、page attention、context attention）原理', duration: '32m' },
    { title: '3-3. PD 分离实现和分布式 KVcache', duration: '26m' },
    { title: '3-4. vllm 代码详解和关系梳理', duration: '30m' },
  ], '1h 56m'),

  // 4. SGLang 和 mooncake
  chapter('infra-4', '模块四 · SGLang 和 Mooncake', [
    { title: '4-1. KV cache 及其内存管理', duration: '24m' },
    { title: '4-2. 调度策略', duration: '22m' },
    { title: '4-3. RadixAttention', duration: '26m' },
    { title: '4-4. PD 分离实现和分布式 KVcache', duration: '26m' },
    { title: '4-5. SGLang 代码详解和关系梳理', duration: '28m' },
  ], '2h 06m'),

  // 5. 算子开发
  chapter('infra-5', '模块五 · 算子开发', [
    { title: '5-1. 芯片所需算子讲解 · 存储和互联', duration: '24m' },
    { title: '5-2. 编程模型 · SIMD 与 SIMT 及对应的开发方式', duration: '22m' },
    { title: '5-3. 算子开发方式（cuda、triton、mlir）', duration: '30m' },
    { title: '5-4. 算子性能优化思路', duration: '26m' },
    { title: '5-5. 带宽利用率和算力利用率', duration: '22m' },
  ], '2h 04m'),

  // 6. 编译器
  chapter('infra-6', '模块六 · 编译器', [
    { title: '6-1. 市场需求的定位', duration: '20m' },
    { title: '6-2. 芯片厂商的工作内容', duration: '20m' },
    { title: '6-3. AI 编译器解析', duration: '28m' },
  ], '1h 08m'),

  // 7. 精度收敛
  chapter('infra-7', '模块七 · 精度收敛', [
    { title: '7-1. 背景和重要性', duration: '20m' },
    { title: '7-2. 工作内容', duration: '20m' },
    { title: '7-3. 精度收敛方法论', duration: '28m' },
  ], '1h 08m'),

  // 8. 存储优化
  chapter('infra-8', '模块八 · 存储优化', [
    { title: '8-1. 背景和重要性', duration: '20m' },
    { title: '8-2. 工作内容', duration: '20m' },
    { title: '8-3. 存储优化方法论', duration: '28m' },
  ], '1h 08m'),

  // 9. 性能优化
  chapter('infra-9', '模块九 · 性能优化', [
    { title: '9-1. 背景和重要性', duration: '20m' },
    { title: '9-2. 工作内容', duration: '20m' },
    { title: '9-3. 性能优化方法论', duration: '28m' },
  ], '1h 08m'),

  // 10. 项目内容
  chapter('infra-10', '模块十 · 项目内容', [
    { title: '10-1. 精度收敛相关', duration: '24m' },
    { title: '10-2. 性能优化相关', duration: '24m' },
    { title: '10-3. 算子开发相关', duration: '28m' },
  ], '1h 16m'),

  // 11. 硬核项目
  chapter('infra-11', '模块十一 · 硬核项目', [
    { title: '11-1. 多类型高性能算子开发', duration: '32m' },
    { title: '11-2. 分布式通信相关 · 精度优化项目', duration: '28m' },
    { title: '11-3. 机架型性能优化项目 · 涉及算子融合、多方式同步及消除、cudagraph 优化、多 stream 并行优化、分布式通信异步 overlap 等（4 阶段）', duration: '36m' },
    { title: '11-4. 端到端量化优化项目', duration: '30m' },
  ], '2h 06m'),
]

export const aiInfraCourse = buildCourse({
  slug: 'ai-infra',
  title: 'AI Infra 推理优化 · 大模型 · AI Infra 工程师实战课',
  seoTitle: 'AI Infra 推理优化实战',
  badge: '技术深度',
  coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  description:
    '面向生产环境的 LLM 推理优化与 AI Infra 工程师实战：覆盖 AI 芯片体系、PyTorch / Torch.compile / CUDA Graph、KV Cache 与 vLLM、SGLang / Mooncake、算子开发、编译器、精度收敛、性能优化与硬核项目。',
  learningObjectives: [
    '理解 AI Infra 全景：芯片 · 体系架构 · 数据中心 · 就业趋势',
    '掌握 PyTorch 机制与算子、Torch.compile、CUDA Graph 工程化能力',
    '深入 LLM 推理核心：KV Cache、Attention、PD 分离、vLLM 与 SGLang',
    '完成算子开发、编译器、精度收敛、性能优化与硬核项目闭环',
  ],
  chapters,
  price: 5999,
  originalPrice: 8999,
  seoKeywords: [
    'AI Infra 求职',
    'AI Infra 工程师',
    'LLM 推理优化',
    'vLLM 面试',
    'KV Cache',
    'SGLang',
    'Mooncake',
    'PyTorch 优化',
    'CUDA 算子开发',
    'AI 编译器',
    '模型量化',
    '推理工程师',
    '大模型推理',
    '推理性能优化',
  ],
  painPoints: [
    '不知道 AI Infra 工程师日常做什么、芯片 / 系统 / 编译器 / 算子 怎么串起来',
    '简历写过 vLLM 但面试被追问 KV Cache、PD 分离、Continuous Batching',
    '想从算法转 Infra，不知道 PyTorch 机制、CUDA 算子、性能方法论怎么补',
    'AI Infra 系统设计题没模板，不知道如何给指标、给权衡',
    '硬核项目不会讲：量化 / 算子融合 / 多 stream overlap 写不进简历',
  ],
  geoSummary:
    '蜗牛AI AI Infra 推理优化工程师实战课：覆盖 AI 芯片、PyTorch / Torch.compile、KV Cache 与 vLLM、SGLang / Mooncake、算子开发、编译器、精度 / 性能优化与 4 阶段硬核项目，适合 MLE / AI Infra 求职者与技术深度提升。',
})
