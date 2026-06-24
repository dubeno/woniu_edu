# AI Agent 工程师面试：MCP、工具调用、多 Agent 系统怎么答

> 蜗牛AI · AI Agent 系列 · 求职专栏

## 2026 招聘现状

Agent 工程师是 2026 增长最快的 AI 岗之一：
- OpenAI / Anthropic / Google 在建 Agent Platform
- 大量企业 SaaS 招 Agent 应用工程师
- LangChain / LlamaIndex / AutoGen / CrewAI 团队扩张

## 面试必答三件套

### 1. Agent vs Workflow vs Copilot

| 形态 | 控制流 | 适用场景 |
|------|--------|---------|
| Workflow | 开发者预定义 | 数据 ETL、审批流 |
| Copilot | 人在回路 | 写作、代码辅助 |
| Agent | 模型自己规划 | 客户支持、研究类任务 |

### 2. ReAct / Plan-and-Execute

- **ReAct**：Thought → Action → Observation 循环
- **Plan-and-Execute**：先生成完整计划，再逐步执行
- 选型：步骤少、需可解释 → ReAct；任务复杂、需并行 → Plan-and-Execute

### 3. MCP（Model Context Protocol）

- Anthropic 主推的「Agent 工具协议」
- 类比 USB-C：标准化 Agent ↔ Tool 通信
- 面试高频问：MCP vs OpenAI Function Calling → MCP 是协议层，Function Calling 是 API 层

## 工具调用设计要点

1. **Schema 设计**：参数语义清晰、避免模糊、必须字段加校验
2. **错误处理**：timeout / retry / fallback
3. **权限沙箱**：工具调用权限分级
4. **可观测性**：每步记录 Thought / Action / Result

## 多 Agent 系统怎么设计

常见模式：
- **Role-based**：PM / Engineer / QA 角色分工
- **Handoff**：当前 Agent 把上下文交给下游
- **Supervisor**：监督 Agent 调度 / 重试 / 终止

> System Design 答法：先讲「为什么需要多 Agent」，再讲 Handoff 协议，最后讲评测与可观测性。

## 简历项目怎么写

三行公式：
1. **场景**：在某业务 / 客户场景中构建 Agent
2. **指标**：任务成功率 X%，幻觉率 Y%
3. **技术亮点**：自定义工具 / 评估流水线 / 多 Agent 协作

## 常见追问

- Agent 怎么控制幻觉？→ 工具约束 + 评估 + 人在回路
- 怎么评估 Agent 效果？→ 自动评估（任务成功率）+ 人类评估
- MCP 和 Function Calling 选哪个？→ MCP 是协议，适合复杂生态；FC 是 API，适合单点集成

## 下一步

- 想看 [AI System Design 通用模板](/blog/ai-engineer-system-design-template)
- 想看 [FDE 是什么](/blog/forward-deployed-engineer-job-description)
- 想看 [2026 AI 工程师面试](/blog/ai-engineer-interview-2026)

扫码咨询，发送「**Agent**」领 Agent 求职地图 + 项目模板。
