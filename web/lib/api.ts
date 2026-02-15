/**
 * API 客户端：调用 Next.js API Route 生成公司故事
 * API Route 会代理调用 FastAPI 后端
 */

export interface GenerateRequest {
  company_input: string;
  use_cache?: boolean;
  enable_web_search?: boolean;
  max_output_tokens?: number;
}

export interface GenerateResponse {
  success: boolean;
  company_name: string;
  ticker: string | null;
  article: string;
  factpack: any;
  sources: any[];
  reading_time_minutes: number;
  error?: string;
}

/**
 * 生成公司故事
 * 使用 Next.js API Route 作为代理，避免 CORS 问题和 localhost 访问问题
 */
export async function generateCompanyStory(
  request: GenerateRequest
): Promise<GenerateResponse> {
  // 使用相对路径调用 Next.js API Route
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      company_input: request.company_input,
      use_cache: request.use_cache ?? true,
      enable_web_search: request.enable_web_search ?? false,
      max_output_tokens: request.max_output_tokens ?? 12000,  // 优化：从 16000 降低到 12000，加快生成
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: '生成失败' }));
    throw new Error(errorData.error || errorData.detail || '生成失败');
  }

  return response.json();
}

/**
 * 解析 Markdown 文章为章节结构
 */
export function parseArticleSections(article: string): Array<{ title: string; content: string }> {
  const sections: Array<{ title: string; content: string }> = [];
  const lines = article.split('\n');
  
  let currentTitle = '';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    // 检测二级标题 (##)
    if (line.startsWith('## ')) {
      // 保存上一章节
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          content: currentContent.join('\n').trim(),
        });
      }
      // 开始新章节
      currentTitle = line.replace('## ', '').trim();
      currentContent = [];
    } else if (line.startsWith('# ')) {
      // 一级标题（通常是文章标题），跳过或作为第一个章节
      if (!currentTitle && currentContent.length === 0) {
        currentTitle = line.replace('# ', '').trim();
      }
    } else {
      currentContent.push(line);
    }
  }
  
  // 保存最后一个章节
  if (currentTitle) {
    sections.push({
      title: currentTitle,
      content: currentContent.join('\n').trim(),
    });
  }
  
  return sections;
}

