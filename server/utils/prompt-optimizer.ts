/**
 * 豆包大模型提示词优化工具
 */

interface OptimizePromptOptions {
  userPrompt: string
  sceneType: string
  apiKey?: string
}

/**
 * 使用豆包大模型优化用户提示词
 */
export async function optimizePromptWithDoubao(options: OptimizePromptOptions): Promise<string> {
  const { userPrompt, sceneType, apiKey } = options
  
  if (!apiKey) {
    // 如果没有API Key，直接返回原提示词
    return userPrompt
  }
  
  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'doubao-pro-32k',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的AI图像生成提示词优化专家。用户会给你一个简单的需求描述，你需要将它扩展为更详细、更专业的提示词，以便AI图像模型生成更好的效果。

场景类型：${sceneType}

优化要求：
1. 保持用户的核心意图不变
2. 添加专业的视觉描述细节（光影、色彩、构图等）
3. 使用简洁的中文表达
4. 不要超过100字
5. 直接输出优化后的提示词，不要有任何前缀或解释`
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    })
    
    if (!response.ok) {
      console.error('豆包API调用失败:', response.statusText)
      return userPrompt
    }
    
    const data = await response.json()
    const optimizedPrompt = data.choices?.[0]?.message?.content?.trim()
    
    return optimizedPrompt || userPrompt
  } catch (error) {
    console.error('提示词优化失败:', error)
    return userPrompt
  }
}

/**
 * 合并提示词：系统预制 + 用户自定义 + 自定义字段
 */
export function mergePrompts(
  systemPrompt: string,
  userPrompt: string,
  template: string,
  customFields: Record<string, string> = {}
): string {
  let finalPrompt = template
  
  // 替换系统提示词
  finalPrompt = finalPrompt.replace('{system_prompt}', systemPrompt)
  
  // 替换用户提示词
  if (userPrompt && userPrompt.trim()) {
    finalPrompt = finalPrompt.replace('{user_prompt}', userPrompt)
  } else {
    // 如果用户没有输入，移除{user_prompt}占位符
    finalPrompt = finalPrompt.replace('。{user_prompt}', '')
    finalPrompt = finalPrompt.replace('{user_prompt}', '')
  }
  
  // 替换自定义字段 (如标题、副标题等)
  for (const [key, value] of Object.entries(customFields)) {
    const placeholder = `{${key}}`
    if (value && value.trim()) {
      finalPrompt = finalPrompt.replace(placeholder, value)
    } else {
      // 如果字段为空，移除占位符及其前缀标点
      finalPrompt = finalPrompt.replace(new RegExp(`[，。、]?\\s*「${placeholder}」`, 'g'), '')
      finalPrompt = finalPrompt.replace(new RegExp(`${placeholder}`, 'g'), '')
    }
  }
  
  // 清理多余的标点和空格
  finalPrompt = finalPrompt
    .replace(/。+/g, '。')
    .replace(/，+/g, '，')
    .replace(/\s+/g, ' ')
    .trim()
  
  return finalPrompt
}







