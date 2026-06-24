# LLM 推理优化面试：vLLM / Continuous Batching / KV Cache 怎么答

> 蜗牛AI · AI Infra 系列 · 求职专栏

## 面试为什么问推理？

MLE / AI Infra / Performance Engineer 几乎必考。OpenAI、Nvidia、Anyscale、Fireworks、DeepMind 都重视。
- 简历写「用过 vLLM」会被追问 PagedAttention
- AI Infra 岗 System Design 第一题就是「设计百万 QPS 推理服务」

## 必答三件套

### 1. Continuous Batching

- 静态批：等整批完成才返回，长尾请求阻塞短请求
- 连续批：每一步插入新请求，吞吐 + 2–4×，延迟 + 30–50%
- 关键：把「请求级」调度换成「token 级」

### 2. PagedAttention & KV Cache

- KV Cache 是 O(seq_len × hidden × layers)，长序列会 OOM
- PagedAttention 把 KV 切成非连续 page，类似 OS 虚拟内存
- 复用：跨请求共享相同 prefix 的 page

### 3. Quantization

- FP16 / BF16：基线，2× 显存下降
- INT8（GPTQ / AWQ）：再 2×
- INT4（AWQ / KIVI）：再 2×
- 精度损失：2–4% 可以接受

## 一句话讲清 vLLM 架构

> vLLM = PagedAttention（内存效率） + Continuous Batching（吞吐） + 多 GPU 并行

## 面试高频追问 + 答法

| 追问 | 一句话答法 |
|------|----------|
| 为什么 PagedAttention 重要？ | 把 KV 切成 page，解决显存碎片 + prefix 复用 |
| Continuous Batching 怎么实现？ | 每 decode 步重新组 batch，长尾请求不阻塞 |
| Speculative Decoding 怎么做？ | 用小模型 draft 多个 token，大模型一次性 verify |
| 量化怎么选？ | 精度敏感选 INT8 / 极致压缩选 INT4，先量化再蒸馏 |
| 延迟与吞吐怎么平衡？ | SLO < 100ms 看 TTFT，SLO < 1s 看 TPOT |

## 项目经验怎么讲

公式：**优化前基线 → 优化手段 → 量化结果**

- 把 P95 latency 从 800ms 降到 200ms（通过 PagedAttention + 连续批）
- 把单卡吞吐从 12 QPS 提升到 80 QPS（量化 + 调度）
- 推理成本从 $0.02 / 千 token 降到 $0.005 / 千 token

## System Design 答题模板

1. **画数据流**：客户端 → API gateway → 路由 → 推理集群 → 输出
2. **挑瓶颈**：KV 内存 / 调度 / 网络
3. **给指标**：P99 延迟、QPS、$/1k tokens
4. **谈权衡**：延迟 vs 吞吐 vs 成本

## 下一步

- 想看 [AI Agent 工程师面试 MCP](/blog/ai-agent-engineer-interview-mcp)
- 想看 [AI System Design 通用模板](/blog/ai-engineer-system-design-template)
- 想看 [2026 AI 工程师面试](/blog/ai-engineer-interview-2026)

扫码咨询，发送「**Infra**」领推理优化 Checklist + 模拟面试题 20 道。
