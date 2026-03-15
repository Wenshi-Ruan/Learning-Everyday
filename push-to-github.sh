#!/bin/bash
# 一键推送到 GitHub（确保修改已提交并 push）
# 用法: ./push-to-github.sh  或  ./push-to-github.sh "你的提交说明"

set -e
cd "$(dirname "$0")"

MSG="${1:-Update: sync code and prompts}"

echo ">>> git add -A"
git add -A

echo ">>> git status"
git status

echo ">>> git commit -m \"$MSG\""
git commit -m "$MSG" || { echo "Nothing to commit, or commit failed (e.g. hook error). Try: git commit --no-verify -m \"$MSG\""; exit 0; }

echo ">>> git push origin main"
git push origin main

echo ">>> Done. Code pushed to GitHub."
