# 推送到 GitHub

每次改完代码需要让 Vercel / Railway 用上新版本时，要把代码推到 GitHub。

## 方法一：用脚本一键推送（推荐）

在项目根目录执行：

```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

自定义提交说明：

```bash
./push-to-github.sh "fix: 财务数据搜索与单语标题"
```

## 方法二：手动命令

```bash
cd "/Users/wenshiruan/Desktop/歹爷爷爷爷爷爷/Cursor Project/Learning Everyday"
git add -A
git status
git commit -m "Update: 你的修改说明"
git push origin main
```

## 若 commit 报错 `unknown option trailer`

可能是本机 git 的 commit 模板或 hook 导致。可先跳过 hook 再推送：

```bash
git add -A
git commit --no-verify -m "你的说明"
git push origin main
```

或用脚本时在脚本里把 `git commit` 改为 `git commit --no-verify`。

## 推送后

- **Vercel**：一般会自动检测 `main` 更新并重新部署（若未自动，到 Deployments 里点 Redeploy）。
- **Railway**：若已连同一仓库，也会自动部署；否则在 Railway 里 Redeploy。

推送完成后，确保在对应平台看到新的 deployment 再测试。
