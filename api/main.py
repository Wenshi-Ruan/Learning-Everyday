"""
FastAPI 包装公司故事生成器
"""
import os
import sys
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# 添加父目录到路径，以便导入核心代码
sys.path.insert(0, str(Path(__file__).parent.parent))

from company_story import CompanyStoryGenerator
from utils import normalize_ticker_or_name

app = FastAPI(title="Company Story Generator API")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://*.vercel.sh",  # Vercel 预览环境
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    company_input: str
    use_cache: bool = True
    enable_web_search: bool = False
    max_output_tokens: int = 16000


class GenerateResponse(BaseModel):
    success: bool
    company_name: str
    ticker: Optional[str]
    article: str
    factpack: dict
    sources: list
    reading_time_minutes: int = 5
    error: Optional[str] = None


@app.get("/")
async def root():
    return {"message": "Company Story Generator API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/generate", response_model=GenerateResponse)
async def generate_story(request: GenerateRequest):
    """
    生成公司故事
    
    Args:
        request: 生成请求，包含公司名/代码和配置
        
    Returns:
        生成的公司故事文章和相关信息
    """
    try:
        # 规范化输入
        ticker, name = normalize_ticker_or_name(request.company_input)
        company_identifier = ticker or name
        
        # 创建生成器
        generator = CompanyStoryGenerator(
            api_key=os.getenv("OPENAI_API_KEY"),
            model=os.getenv("OPENAI_MODEL", "gpt-4o"),
            max_output_tokens=request.max_output_tokens,
            enable_web_search=request.enable_web_search,
            market_days=90,
            use_cache=request.use_cache
        )
        
        # 生成文章
        article, factpack = generator.generate(company_identifier)
        
        # 提取 sources
        sources = [s.model_dump() for s in factpack.sources]
        
        return GenerateResponse(
            success=True,
            company_name=factpack.company.full_name or company_identifier,
            ticker=factpack.company.ticker or ticker,
            article=article,
            factpack=factpack.model_dump(),
            sources=sources,
            reading_time_minutes=5
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成失败: {str(e)}")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

