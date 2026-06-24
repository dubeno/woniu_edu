# AI System Design 模板：RAG、Agent、Inference 三类题型怎么搭框架

> 蜗牛AI · AI System Design · 求职专栏

## 为什么要单独写 AI System Design

传统 System Design 关注：
- 数据存储、缓存、消息队列、负载均衡

AI 岗 System Design 多一层：
- 模型选择、Prompt 模板、向量检索、Guardrail、评估、可观测性、成本

## 通用五层答题模板

任何 AI System Design 题都可以拆成这五层：

1. **数据层**：原始数据 → 清洗 → 切分 → Embedding → 索引
2. **模型层**：选型 / Prompt / 微调 / 蒸馏
3. **检索 / 工具层**：向量 / BM25 / 工具调用 / Re-rank
4. **服务层**：API gateway、缓存、限流、异步
5. **可观测 + 评估**：指标、Trace、Eval 集、A/B

> 答题时先画五层框图，再深入每层。

## 三类题型差异

### RAG 问答系统

- 重点：**召回 / Re-rank / Guardrail**
- 必答组件：Embedding 模型、向量库、Hybrid Search、Re-rank、缓存
- 评估：命中率、答案忠实度、人工评估

### Agent 工作流

- 重点：**工具注册 / 状态机 / 容错**
- 必答组件：工具 Schema、状态机、人机协同、超时重试
- 评估：任务成功率、Token 成本、平均步数

### LLM 推理服务

- 重点：**调度 / 显存 / 成本**
- 必答组件：连续批、KV Cache、量化、Speculative Decoding
- 评估：P99 延迟、QPS、$/1k tokens

## 答题实战步骤

| 步 | 时长 | 做什么 |
|----|------|--------|
| 澄清 | 2 min | 用户量、延迟、QPS、SLA、成本约束 |
| 拆解 | 3 min | 画五层框图 |
| 深入 | 15 min | 选 2–3 层深入讲权衡 |
| 评估 | 3 min | 怎么测、怎么迭代 |
| 收尾 | 2 min | 总结权衡 + 给出 follow-up |

## 常见踩坑

- 只讲「调 GPT-4」不讲工程
- 不给数字 / 指标
- 忽视成本（面试官会追问 $/1k tokens）
- 不讲评估集（AI 岗必问）

## 12 个高频追问关键词

- RAG 命中率、Re-rank 必要性
- Agent 工具 Schema、超时重试
- vLLM、KV Cache、PagedAttention
- 量化、蒸馏、Speculative
- Guardrail、PII 过滤
- Eval 集、自动评估

## 下一步

- 想看 [2026 AI 工程师面试考题](/blog/ai-engineer-interview-2026)
- 想看 [FDE JD 拆解](/blog/forward-deployed-engineer-job-description)
- 想看 [LLM 推理优化面试](/blog/llm-inference-optimization-interview)

扫码咨询，发送「**SD**」领 System Design 答题卡 + 高频题清单。
