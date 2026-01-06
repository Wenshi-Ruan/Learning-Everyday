#!/bin/bash
# 推送代码到 GitHub 的命令
# 在终端中运行这些命令

cd "/Users/wenshiruan/Desktop/歹爷爷爷爷爷爷/Cursor Project/Learning Everyday"

# 添加远程仓库
git remote add origin https://github.com/Wenshi-Ruan/Learning-Everyday.git

# 设置主分支为 main
git branch -M main

# 推送代码
git push -u origin main

