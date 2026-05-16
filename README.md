# 💩 Poop Logger 2.0

> 一个有趣的拉屎记录应用，纯前端版本，数据安全存储在本地！

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-AGPL--3.0-green.svg)
![Vue](https://img.shields.io/badge/vue-3.x-brightgreen.svg)
![Vite](https://img.shields.io/badge/vite-5.x-purple.svg)

## ✨ 功能特点

### 🎮 核心功能
- 💩 **屎相图鉴系统** - 7种不同的屎相类型，从完美香蕉到稀里哗啦
- 📝 **环境记录** - 记录音乐、温度、空气质量、娱乐方式、姿势
- ⏱️ **时长记录** - 精确记录每次拉屎时长
- 📊 **数据统计** - 详细的健康趋势和数据分析

### 🏆 游戏化系统
- **成就系统** - 10+种成就等你解锁
- **每日任务** - 每天都有新挑战
- **积分系统** - 积分兑换皮肤
- **连续打卡** - 保持记录习惯

### 👥 社交功能
- **好友系统** - 添加好友，本地排行榜
- **分享功能** - 生成精美分享卡片和链接
- **挑战系统** - 发起和接受挑战

### 🛒 个性化
- **马桶皮肤** - 多种皮肤等你解锁
- **数据安全** - 完全本地存储，隐私无忧
- **导出/导入** - 数据备份和迁移

## 📱 应用预览

### 🎨 屎相图鉴
| 编号 | 名称 | 表情 | 描述 | 得分 |
|------|------|------|------|------|
| 1 | 完美香蕉 | 🍌 | 形状完美，色泽金黄 | +100 |
| 2 | 一气呵成 | 🚀 | 顺畅到底，一气呵成 | +80 |
| 3 | 分道扬镳 | 🎭 | 分成两段，但都很健康 | +60 |
| 4 | 软乎乎 | 🧈 | 有点软，但成型 | +40 |
| 5 | 小绵羊 | 🐑 | 颗粒状，有点干 | +20 |
| 6 | 艰难险阻 | 🏔️ | 便秘，努力很久 | -10 |
| 7 | 稀里哗啦 | 💧 | 腹泻，完全不成型 | -30 |

### 🏆 成就列表
- 📅 每日一屎 - 连续7天记录
- 🐦 早起鸟 - 早上6-8点拉屎10次
- 🌙 夜猫子 - 凌晨0-4点拉屎10次
- 💯 完美主义者 - 连续10次完美香蕉
- 🏃 马拉松选手 - 单次超过30分钟（5次）
- ⚡ 闪电侠 - 单次少于2分钟（10次）
- 👑 屎王 - 总得分超过10000分
- 📚 收藏夹 - 收集所有屎相类型
- 🔍 考古学家 - 查看一年前的记录

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/sunkaixin19890530-netizen/poop-logger.git

# 进入目录
cd poop-logger

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 访问应用
- 本地开发：http://localhost:3000
- GitHub Pages：https://sunkaixin19890530-netizen.github.io/poop-logger/

## 📦 部署指南

### 部署到 GitHub Pages

#### 方法1：使用 GitHub Actions（推荐，自动化）

1. 确保 GitHub Pages 源设置为 "GitHub Actions"
2. 创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. 在仓库 Settings -> Pages 中设置：
   - Source: GitHub Actions
   - 分支: gh-pages (自动创建)

#### 方法2：手动部署

```bash
# 构建项目
npm run build

# 使用 gh-pages 工具部署
npm install -D gh-pages
npx gh-pages -d dist
```

## 🧪 测试页面

测试页面已隐藏，可以通过以下方式访问：

1. **直接访问**：在 URL 后面添加 `#/test`
2. **彩蛋方式**：
   - 进入 "设置" 页面
   - 在 "版本：2.0.0" 上连续快速点击 7 次
   - 自动跳转到测试页面！

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.x | 渐进式 JavaScript 框架 |
| Vite | 5.x | 下一代前端构建工具 |
| Vue Router | 4.x | 官方路由管理器 |
| Pinia | 2.x | 新一代状态管理 |
| IndexedDB | - | 本地 NoSQL 数据库 |
| html2canvas | 1.x | 生成分享图片 |

## 📁 项目结构

```
poop-logger/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions 部署配置
├── src/
│   ├── components/          # 组件目录
│   ├── views/               # 页面视图
│   │   ├── Home.vue         # 首页
│   │   ├── Record.vue       # 记录页
│   │   ├── History.vue      # 历史页
│   │   ├── Stats.vue        # 统计页
│   │   ├── Achievements.vue # 成就页
│   │   ├── Share.vue        # 分享页
│   │   ├── Friends.vue      # 好友页
│   │   ├── Shop.vue         # 商店页
│   │   ├── Settings.vue     # 设置页
│   │   └── Test.vue         # 测试页
│   ├── stores/              # Pinia 状态管理
│   │   ├── record.js        # 记录状态
│   │   └── user.js          # 用户状态
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── utils/               # 工具函数
│   │   ├── constants.js     # 常量定义
│   │   ├── db.js            # IndexedDB 封装
│   │   ├── helpers.js       # 辅助函数
│   │   └── share.js         # 分享功能
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   └── style.css            # 全局样式
├── docs/                    # 文档目录
├── index.html               # HTML 模板
├── vite.config.js           # Vite 配置
├── package.json             # 项目配置
└── README.md                # 项目说明
```

## 🎯 核心功能详情

### 💾 数据存储
- 所有数据完全存储在用户本地 IndexedDB 中
- 支持数据导出为 JSON 格式
- 支持数据导入功能
- 可清除所有数据

### 🎨 屎相评分
- 根据屎相类型自动计算得分
- 完美香蕉：+100分
- 稀里哗啦：-30分
- 每日任务额外加分

### 🏆 成就解锁
- 根据统计数据自动检查成就条件
- 成就一旦解锁永久保留
- 可查看已解锁和未解锁成就列表

### 👥 本地好友
- 通过好友码添加好友
- 好友数据存储在本地
- 本地排行榜展示好友积分排名

## 📄 许可证

[AGPL-3.0](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，欢迎通过 GitHub Issues 联系。

---

<div align="center">
  <p>💩 Happy Pooping! 💩</p>
  <p>Made with ❤️ by sunkaixin19890530-netizen</p>
</div>
