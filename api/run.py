#!/usr/bin/env python3
"""
Railway 启动脚本
直接运行这个文件来启动 FastAPI 应用
"""
import os
import uvicorn
from main import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

