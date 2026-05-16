# 💩 Poop Logger 2.0

一个有趣的拉屎记录应用，纯前端版本，数据安全存储在本地！

## ✨ 功能特点

- 🎨 屎相图鉴系统
- 🏆 成就系统
- 📊 数据统计
- 👥 好友系统
- 📸 分享功能
- 🛒 商店/皮肤系统
- 💾 IndexedDB 本地存储
- 🧪 单元测试

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📦 部署到 GitHub Pages

### 方法1：使用 GitHub Actions 自动部署（推荐）

1. 创建一个新的 Personal Access Token，确保勾选 `repo` 和 `workflow` 权限
2. 取消注释 `.github/workflows/deploy.yml` 文件中的内容（如果需要）
3. 在仓库设置中：
   - 进入 Settings -> Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 `gh-pages` 分支
4. 每次推送到 main 分支都会自动部署

### 方法2：手动部署（当前已配置）

1. 在仓库页面点击 Settings -> Pages
2. 在 "Build and deployment" 部分：
   - Source: 选择 "GitHub Actions"
   - 或者选择 "Deploy from a branch" 然后手动构建并推送

3. 本地构建：
```bash
npm run build
```

4. 将 dist 目录的内容推送到 `gh-pages` 分支，或者使用其他部署工具

### 方法3：使用 gh-pages 工具

```bash
npm install -D gh-pages
npm run deploy
```

## 🎯 访问地址

部署成功后访问：
```
https://sunkaixin19890530-netizen.github.io/poop-logger/
```

## 🧪 测试页面

测试页面已隐藏，可以通过以下方式访问：

- 直接访问：`#/test`
- 或者在设置页面连续点击版本号 7 次

## 📝 技术栈

- Vue 3
- Vite
- Vue Router
- Pinia
- IndexedDB
- html2canvas

## 📄 许可证

AGPL-3.0
