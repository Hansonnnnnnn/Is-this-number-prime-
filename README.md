# Is this number prime?

这个仓库现在已经配置好 **GitHub Pages 自动部署**。

## 站点发布方式
- 当你把代码推送到 `main` / `master` / `work` 分支时，GitHub Actions 会自动把 `Is this number prime/` 目录发布到 GitHub Pages。
- 也可以在 Actions 页面手动运行 `Deploy static site to GitHub Pages` 工作流。

## 首次启用（GitHub 网页端）
1. 打开仓库 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **Source: GitHub Actions**。
3. 等待 Actions 里的 `Deploy static site to GitHub Pages` 运行完成。
4. 发布地址通常是：
   - `https://<你的用户名>.github.io/<仓库名>/`

## 本地预览
因为页面会读取 Markdown 文件（`content-en.md` / `content-zh.md`），请使用本地服务器而不是直接双击 `index.html`：

```bash
cd "Is this number prime"
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。
