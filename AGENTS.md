# Zephyr's Lab — Agent Context

## 项目概述

这是 **Zephyr Gao**（GitHub: [gzb1128](https://github.com/gzb1128)）的个人技术博客项目。最终部署到 GitHub Pages，仓库名 `gzb1128.github.io`，访问地址 `https://gzb1128.github.io`。

**站点名**：Zephyr's Lab
**Tagline**：Notes on agents, kernels, and the systems in between.
**当前目录**：`~/code/zephyr-lab/`（本地开发名）
**GitHub 仓库**（待创建）：`gzb1128/gzb1128.github.io`

## 用户画像

- **本名**：Zephyr Gao（GitHub `gzb1128`）
- **技术栈**：Go（K8s 生态、CLI 工具）、TypeScript、Python、Java（Spring）
- **当前重心**：AI Agent 工具链（OpenCode 插件、Claude Code 周边）+ K8s 生态
- **前端基础**：HTML/CSS/JS 三件套熟悉，React 了解概念但没实操经验，**不写 Vue**
- **工作模式**：**前端代码主要由 AI Agent 生成**，用户负责审阅、提需求、做架构决策
- **历史博客**：CSDN [@qq_36993218](https://blog.csdn.net/qq_36993218)（185 篇原创，算法竞赛 + 密码学 + 后端基础，活跃期 2017-2018）

## 内容策略

CSDN 旧内容**保留不迁移**，新内容发布到 Zephyr's Lab。两侧做交叉引用：

- CSDN 个人简介添加新博客链接
- Zephyr's Lab About 页注明历史归档在 CSDN

**新博客内容方向**：
- AI Agent 工具开发（OpenCode、Claude Code 生态）
- Cloud Native（K8s、controller-runtime、KubeVela）
- 杂谈（technical essays、reading notes）
- 偶尔回顾算法/密码学话题

**内容分类规划**：
```
src/content/posts/
├── ai-agent/       # AI Agent 工具与生态
├── cloud-native/   # K8s、controller-runtime
├── algorithm/      # 算法笔记（与 CSDN 互补）
├── cryptography/   # 密码学
└── essay/          # 杂谈
```

## 视觉风格

**核心要求**：**Linear.app 黑暗风格 + Code Editor 亲切感 + 保留动画扩展性**

参考站点：
- **Linear.app**（首选）— 深色、克制、精致的细节
- **nexu.io**（动画参考）— 滚动驱动的隧道动画、badge 收拢、毛玻璃 header
- **Vercel.com Blog** — 简洁的列表 + 优秀的代码块呈现

**设计原则**：
1. **Code Editor 美学**：等宽字体（JetBrains Mono / Geist Mono）、syntax-highlight 调色板、行号、文件标签等元素的隐喻
2. **深色优先**：默认 dark mode（参考 Linear 的 `#08090A` 背景），保留 light mode 切换
3. **动画可扩展**：不要锁死在某个主题的样式系统里，要能后续加入 GSAP / Framer Motion 实现 nexu.io 级别的滚动动画
4. **零 JS 默认**：纯静态页面不引入 JS，动画组件按需 hydrate（`client:visible`）

**配色草案**（待 design.md 细化）：
```
背景：#08090A (Linear 同款 near-black)
前景：#F7F8F8
次要文字：#8A8F98
强调色：#5E6AD2 (Linear ��蓝) 或 #00FFAA (terminal green，更极客)
代码块：#1C1C1F
边框：#23252A
```

## 技术选型（已确认）

```
Astro 5
├── React (按需引入，给 AI 写动画组件用)
├── Tailwind CSS 4
├── MDX (Markdown + React 组件)
├── Shiki (代码高亮，Astro 内置)
├── KaTeX (密码学公式)
├── Mermaid (算法流程图)
├── Pagefind (本地全文搜索)
└── Giscus (评论，基于 GitHub Issues)
```

**部署**：GitHub Pages（免费）+ GitHub Actions 自动构建。

**未来可能引入**（不要现在加，但代码结构要预留）：
- GSAP / Framer Motion（滚动动画）
- Lenis（平滑滚动，模仿 nexu.io 流畅感）
- View Transitions API（Astro 5 原生支持）

## 拒绝的方案及理由

| 方案 | 拒绝原因 |
|------|---------|
| Hexo | 模板语法（EJS/Stylus）老旧，与 AI Agent 写前端的工作流不匹配 |
| Hugo | Go 模板对自定义不友好，限制后续动画扩展 |
| Vue 技术栈 | 用户明确不写 Vue |
| 套用 AstroPaper 等现成主题 | 主题作者的样式系统会限制后续动画扩展，且 AI Agent 改主题代码不如改原生代码顺手 |
| Hexo Butterfly/Fluid 等 | 同上，限制扩展性 |

## 仓库与命名

- **本地目录**：`~/code/zephyr-lab/`
- **GitHub 仓库**：`gzb1128/gzb1128.github.io`（待创建，必须用此名才能拿到根路径）
- **默认分支**：`main`
- **部署分支**：GitHub Actions 直接部署到 Pages，不用单独的 `gh-pages` 分支

## 关键决策点（后续 agent 需要注意）

1. **不要套现成主题** — 从 Astro 官方 `blog` starter 起步，由 AI Agent 按 Linear 风格定制
2. **保留组件化结构** — 即使前期不写复杂动画，目录结构和组件边界要为后续 GSAP / Framer Motion 留好空间
3. **代码高亮是重点** — 用户是程序员博客，代码块的视觉质量直接决定整体质感。Shiki 的 dual-theme（light/dark）必须配好
4. **不要过度配置** — 用户期望快速上线后增量迭代，不要在第一版就堆砌所有功能
5. **保持英文文案** — 站点元数据、配置、commit 都用英文（与用户的 GitHub 项目风格一致）；正文文章中英文皆可

## 工作流约定

- **commit 风格**：conventional commits（`feat:`、`fix:`、`docs:`、`style:`、`chore:`）
- **PR 不需要** — 单人项目直接推 main
- **每个独立功能一个 commit** — 方便回滚 AI 改坏的代码
- **不要 commit `node_modules`、`dist`、`.astro` 缓存**

## 当前进度

- [x] 技术选型确认
- [x] 视觉风格方向确认
- [x] 项目目录创建（`~/code/zephyr-lab/`）
- [x] AGENTS.md（本文件）
- [ ] docs/design.md（设计规范细化 — 配色、字体、组件清单）
- [ ] Astro 项目初始化
- [ ] Linear 风格主题定制
- [ ] GitHub 仓库创建 + Actions 配置
- [ ] 第一篇文章
- [ ] CSDN 侧添加新博客链接
