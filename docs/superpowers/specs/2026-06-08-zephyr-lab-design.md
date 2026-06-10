# Zephyr's Lab — Design Spec (Validated)

**Date**: 2026-06-08  
**Status**: Approved  
**Source**: Brainstorming session validating `docs/design.md`  
**Note**: 本文档覆盖并替代 `docs/design.md`。如有冲突，以本文档为准。

### Editor 风格细节（已吸收）

design.md 的 Editor 风格细节部分已拆解到各组件：
- Logo `$ zephyr.lab` → Header §1
- Tag `[tag-name]` 风格 → Tag §8
- ISO 8601 时间戳（`2026-06-08T10:44:00Z`）→ Post Detail 元信息 §5
- 页面标题注释前缀 `// about.md` → About Page §10

## 设计哲学

**Linear.app 的克制 × Code Editor 的亲切 × 保留动画扩展空间**

三条准则，按优先级排序：

1. **Content first** — 内容（文字、代码）是主角，UI 是衬托
2. **Editor metaphor** — 借用代码编辑器的隐喻（等宽字体、syntax 配色），让程序员一进站就觉得"自己人"
3. **Performance budget** — 默认零 JS，动画按需引入；首屏 LCP < 1.5s

## 配色系统

### Dark Mode（默认）

```css
/* Backgrounds */
--bg-primary:    #08090A;  /* 页面背景 */
--bg-secondary:  #0F1011;  /* 卡片/侧边栏 */
--bg-tertiary:   #1C1C1F;  /* 代码块 */
--bg-hover:      #16171A;  /* hover 态 */

/* Foregrounds */
--fg-primary:    #F7F8F8;  /* 主文字 */
--fg-secondary:  #B4B8BD;  /* 副文字 */
--fg-tertiary:   #8A8F98;  /* 元信息（时间、tag）*/
--fg-disabled:   #4D5158;

/* Borders */
--border-subtle: #1F2125;
--border-default:#2A2D33;
--border-strong: #3A3D44;

/* Brand */
--accent-primary:   #5E6AD2;  /* Linear 紫蓝 */
--accent-secondary: #7B85E8;  /* hover 态 */

/* Semantic (借自 syntax highlight) */
--syntax-keyword: #C586C0;  /* 紫粉，关键字 */
--syntax-string:  #CE9178;  /* 橘，字符串 */
--syntax-number:  #B5CEA8;  /* 绿，数字 */
--syntax-comment: #6A737D;  /* 灰，注释 */
--syntax-fn:      #DCDCAA;  /* 黄，函数名 */
```

### Light Mode（次要）

```css
--bg-primary:    #FFFFFF;
--bg-secondary:  #F7F8F8;
--bg-tertiary:   #F3F4F6;
--bg-hover:      #F0F1F3;
--fg-primary:    #08090A;
--fg-secondary:  #3C4149;
--fg-tertiary:   #6B7280;
--fg-disabled:   #9CA3AF;
--border-subtle: #E5E7EB;
--border-default:#D1D5DB;
--border-strong: #B0B5BD;
--accent-primary:#5E6AD2;
--accent-secondary:#7B85E8;
/* syntax 色用于 tag 配色，dark/light 共用，需验证对比度 */
```

## 字体系统

### 字体栈

```css
/* Sans (UI、正文) */
--font-sans: "Inter Variable", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* Mono (代码、技术元素、数字) */
--font-mono: "JetBrains Mono Variable", "Noto Sans Mono CJK SC", "Geist Mono", "SF Mono", Menlo, Consolas, monospace;

/* Serif (可选，用于长文章引用) */
--font-serif: "Source Serif 4", Georgia, serif;
```

### 中英文混排

- 盘古之白：中英文之间自动加空格，构建时处理（remark 插件或 pangu.js）
- 中文标点：使用全角标点，不混用半角
- Noto Sans SC 加载策略：子集化（GB2312 常用字），font-display: swap，按需加载

### 正文排版间距

用于文章详情页 `.prose` 容器内的元素间距。
间距值为建议值，可基于 space token 微调。

| 元素        | margin-top       | margin-bottom    |
|------------|------------------|------------------|
| `p`        | 0                | 24px (space-lg)  |
| `h2`       | 48px (space-2xl) | 16px (space-md)  |
| `h3`       | 32px (space-xl)  | 8px  (space-sm)  |
| `h4`       | 24px (space-lg)  | 8px  (space-sm)  |
| `ul`/`ol`  | 0                | 24px (space-lg)  |
| `blockquote` | 24px (space-lg)| 24px (space-lg)  |
| `pre`      | 24px (space-lg)  | 24px (space-lg)  |

紧邻规则：h2 紧跟 h1 时（文章第一个小节），margin-top 减半为 32px。

### 类型层级

```
Display  clamp(2.5rem, 4vw, 3.25rem)  weight 510  lh 1.1   ls -0.04em  ← Hero 专用
H1   2.25rem  font-bold  letter-spacing -0.02em   (文章主标题)
H2   1.625rem font-semibold letter-spacing -0.01em (二级标题)
H3   1.25rem  font-semibold
H4   1.125rem font-medium
Body 1rem     line-height 1.7   (正文，长行高便于阅读)
Meta 0.875rem font-mono color-tertiary (时间、tag、面包屑)
Code 0.9rem   font-mono                (内联代码)
```

Display 层级仅用于首页 Hero 的 `$ zephyr.lab`。文章详情页的标题使用 H1 (2.25rem)。不在其他任何地方使用 Display 尺寸。

### 字体加载策略

v1 策略（基础）：
- 所有 @font-face 使用 font-display: swap
- Inter Variable：`<link rel="preload">` 异步预加载，不阻塞渲染
- JetBrains Mono：仅在包含代码块的页面预加载
- 中文 web font（如需加载 Noto Sans SC）：子集化 + font-display: swap + 按需

渲染回退链：系统 sans-serif → Inter → 正式排版
确保回退期间文字可读，无布局偏移（size-adjust 可选）。

v2 可选增强：
- 首屏关键路径只加载 Inter Regular + Semibold 静态文件（~40KB gzip）
- Variable 版本异步加载，用 `<link rel="preload">` 而非 @import

## 关键尺寸

```css
--max-width-prose:    720px;   /* 文章正文 */
--max-width-wide:     1200px;  /* 列表、首页 */
--header-height:      56px;
--space-xs: 0.25rem;  --space-sm: 0.5rem;
--space-md: 1rem;     --space-lg: 1.5rem;
--space-xl: 2rem;     --space-2xl: 3rem;
--space-3xl: 4rem;    --space-4xl: 6rem;
--radius-sm: 4px; --radius-md: 6px; --radius-lg: 12px;
```

## 全局布局

```
┌──────────────────────────────────────────────────┐
│  Header (sticky, 56px)                           │
│  $ zephyr.lab              [posts] [about] [rss] │
├──────────────────────────────────────────────────┤
│                                                  │
│  Hero                                            │
│  $ zephyr.lab                                    │
│  Notes on agents, kernels,                       │
│  and the systems in between.                     │
│  A technical blog by Zephyr Gao                  │
│                                                  │
├──────────────────────────────────────────────────┤
│  Transition Zone                                 │
│  TOPICS                                          │
│  [ai-agent]  [cloud-native]  [essay]             │
├──────────────────────────────────────────────────┤
│  Post List (max-width: 1200px, items 720px)      │
│                                                  │
├──────────────────────────────────────────────────┤
│  Footer (color-tertiary, font-mono)              │
└──────────────────────────────────────────────────┘
```

## 关键组件

### 1. Header

- **高度**：56px，sticky，初始透明
- **滚动后**：背景变 `rgba(8,9,10,0.7)` + `backdrop-filter: blur(12px)` + 底部细边框
- **logo**：`$ zephyr.lab`（等宽字体）
  - `"$"` → `--accent-primary` (#5E6AD2)，视觉锚点，与正文标题中的 `$` prompt 形成系统级呼应
  - `"zephyr.lab"` → `--fg-primary` (#F7F8F8)，用前景色保持可读性，不与 accent 色竞争注意力
- **导航**：Posts / About / RSS
- **不要**做 nexu.io 那种胶囊变形，保持克制

### 2. Hero（首页）

简洁的垂直分层介绍，每行一个元素，大量留白：

```
$ zephyr.lab

Notes on agents, kernels,
and the systems in between.

A technical blog by Zephyr Gao
```

- `$ zephyr.lab` 使用 accent 蓝色
- 标题分两行，字重 600，letter-spacing -0.02em
- 副文字使用 `fg-secondary`
- 结构上预留 hero slot，未来可替换为带动画的版本

### 3. Transition Zone（Tags）

位于 Hero 和 Post List 之间，用细线分隔：

```
─────────────────────────────
TOPICS
[ai-agent]  [cloud-native]  [essay]
```

- "TOPICS" 标签使用 `fg-disabled`，letter-spacing 0.1em
- 分类标签等宽字体，固定配色映射：
  - `[ai-agent]` → `--syntax-string` (#CE9178, 橘)
  - `[cloud-native]` → `--syntax-keyword` (#C586C0, 紫粉)
  - `[algorithm]` → `--syntax-number` (#B5CEA8, 绿)
  - `[cryptography]` → `--syntax-fn` (#DCDCAA, 黄)
  - `[essay]` → `--syntax-comment` (#6A737D, 灰)
- 标签 hover 时统一变 accent 蓝色
- Transition Zone 展示全部 5 个分类（与 content collection schema 一致）

#### 已知问题（v2 解决）

上述 syntax 色在 Light Mode (#FFFFFF 背景) 上的对比度：
  ai-agent  (#CE9178) → 3.0:1 ❌
  cloud-native (#C586C0) → 3.5:1 ❌
  algorithm (#B5CEA8) → 2.6:1 ❌
  cryptography (#DCDCAA) → 1.8:1 ❌
  essay     (#6A737D) → 4.5:1 ✅

v1 不包含 Light Mode，此问题不影响当前交付。
实现 Light Mode 时需要为 tag 定义加深色或改用色块方案。

### 4. Post List

时间轴样式，等宽字体：

```
2026 ──────────────────────────────────────
├─ Jun 08  Building OpenCode Plugins         [ai-agent]
├─ May 24  K8s Controller Patterns           [cloud-native]
└─ Apr 15  Why I Left CSDN                   [essay]

2025 ──────────────────────────────────────
└─ Sep 17  从位运算角度重新理解树状数组     [algorithm]
```

- 年份分隔线用 `border-subtle`
- 每行：日期 + 标题左对齐，tag 右对齐
- 行 hover 时背景变 `bg-hover`

### 5. Post Detail

- 顶部：标题 + 元信息（日期 ISO 8601 格式 `2026-06-08`、tags、阅读时长、字数）
- 正文：720px 居中，行高 1.7
- 代码块：见下方 §代码块 详细规范
- 底部：上一篇/下一篇导航 + Giscus 评论

### 6. 代码块（重点）

这是程序员博客的灵魂，必须做好。

**规范**：
- 高亮引擎：Shiki（Astro 内置），dual-theme 配置
- Dark theme：`github-dark-default`
- Light theme：`github-light-default`
- **必备元素**：
  - 顶部 macOS 三色按钮（红黄绿）— 增强 editor 亲切感
  - 右上角语言标签（`go` / `tsx` / `bash`）
  - 复制按钮（hover 时出现）
  - 行号（可选，长代码必备）
  - 行高亮（用 `// [!code highlight]` 注释驱动）
- 圆角 12px，背景 `--bg-tertiary`，边框 `--border-subtle`

### 7. 内联代码

```css
font-family: var(--font-mono);
font-size: 0.9em;
padding: 0.125em 0.375em;
background: var(--bg-tertiary);
border: 1px solid var(--border-subtle);
border-radius: 4px;
```

### 8. Tag

`[tag-name]` 风格，等宽字体。在 post list 中右对齐，在 transition zone 中居中。hover 时变 accent。

### 9. Footer

```
─────────────────────────────────────────────
© 2026 Zephyr Gao · Built with Astro
[github] [csdn] [rss] [feeds]
```

颜色 tertiary，字体 mono。

### 10. About Page

简洁的个人介绍页，沿用 editor 美学：

```
// about.md

Zephyr Gao
Backend engineer working on AI agent tooling and Kubernetes ecosystems.

Go · TypeScript · Python · Java (Spring)

Links
  → GitHub    github.com/gzb1128
  → CSDN      blog.csdn.net/qq_36993218 (历史归档，185 篇)
  → RSS       /rss.xml
```

- 标题用 `// about.md` 注释前缀（editor metaphor）
- 链接列表用 prompt `→` 风格
- CSDN 归档链接必须保留（验收标准要求）
- 布局：720px 居中，与 Post Detail 同宽

### 11. Search（Pagefind）

- **触发**：Header 右侧搜索图标（放大镜 / `⌘K` 快捷键提示）
- **交互**：点击打开全屏 modal overlay
- **Modal 样式**：深色半透明遮罩 + 居中搜索框（640px 宽）
  - 搜索框：等宽字体，placeholder 显示 `// search posts...`
  - 结果列表：标题 + 日期 + 高亮匹配文字，等宽字体
- **集成**：Pagefind 在 build 后生成索引，`Search.tsx` 为 React island

### 12. Tag 点击行为

点击任何 tag（Transition Zone 或 Post List 中）**导航到 `/posts/[tag]/`**，显示该分类下的所有文章。页面复用 Post List 组件，年份分组不变，只过滤对应分类。

### 13. 数学公式 & 图表

- **KaTeX**：通过 `remark-math` + `rehype-katex` 在 MDX 中渲染 LaTeX 公式
  - 行内公式：`$E = mc^2$`
  - 块级公式：`$$...$$`，居中显示，带编号（可选）
  - 样式：沿用 `--font-mono` 配色，公式背景用 `--bg-tertiary`
- **Mermaid**：通过 rehype 插件渲染流程图/序列图
  - 深色主题：`dark` base，节点填充用 `--bg-secondary`，边框用 `--border-default`
  - 字体：`--font-mono`
  - 圆角与整体设计一致（`--radius-md`）

## 动画策略

### 第一版（极简）

只做最基础的微交互：

- 链接 hover：颜色过渡 200ms ease
- 按钮 hover：背景过渡 200ms ease
- 代码块复制按钮：fade in/out
- 主题切换：使用 Astro 5 的 View Transitions（原生 API）
- 页面切换：View Transitions（无需 JS）

### 第二版（增强，预留扩展点）

后续添加，但架构上要预留：

- 文章入场：fade up + stagger（`@fadeIn` 工具类）
- 滚动进度条：顶部 1px 进度条
- 图片懒加载 + blur-up
- 长文 TOC 高亮当前章节

### 第三版（nexu.io 级别）

如果未来想做 hero 动画或专题页：

- 引入 GSAP + ScrollTrigger
- 引入 Lenis 实现平滑滚动
- 创建独立的 `landing-pages/` 目录
- **关键**：博客主体不引入这些库，保持轻量

### 架构预留

```
src/
├── components/
│   ├── core/          # 主体组件，零 JS
│   │   ├── Header.astro
│   │   ├── PostList.astro
│   │   └── CodeBlock.astro
│   ├── interactive/   # 需要 JS 的组件，独立目录
│   │   ├── Search.tsx     # Pagefind UI
│   │   └── CopyButton.tsx
│   └── animated/      # 未来动画组件预留
│       └── .gitkeep
├── layouts/
│   ├── BaseLayout.astro      # 默认，零 JS
│   ├── PostLayout.astro      # 文章页
│   └── LandingLayout.astro   # 未来动画 landing 用
└── pages/
    ├── index.astro
    ├── posts/
    └── about.astro
```

## 响应式断点

```css
--bp-sm:  640px;   /* 手机横屏 */
--bp-md:  768px;   /* 平板 */
--bp-lg:  1024px;  /* 笔记本 */
--bp-xl:  1280px;
```

设计先做 desktop（Linear 风格本身偏 desktop），再做 mobile 适配。

### Mobile 行为（v1 简要规范）

- **Header**：768px 以下导航收起为汉堡菜单，logo 保留
- **Hero**：字号缩小（标题 28px → 24px），保持垂直分层
- **Transition Zone**：标签横向滚动（overflow-x: auto）
- **Post List**：时间轴简化，日期和标题堆叠而非并排
- **Post Detail**：720px max-width 自然适配，无需额外处理

## SEO & Meta

- 每篇文章自动生成 OG 图（用 Astro 的 `@vercel/og` 或 `satori`）
- OG 图风格：黑底 + 标题 + tag + 站点名（沿用 editor 美学）
- `<title>` 格式：`{文章标题} — Zephyr's Lab`
- 站点 description：`Notes on agents, kernels, and the systems in between.`
- robots.txt + sitemap.xml + RSS（Astro 集成插件）

## Content Schema

### Frontmatter

每篇文章的 frontmatter 字段：

```yaml
---
title: string        # 文章标题
date: YYYY-MM-DD     # 发布日期
tags: string[]       # 分类标签，与 Transition Zone 配色映射一致
draft: boolean?      # 草稿标记，构建时排除
hasMath: boolean?    # 文章包含 LaTeX 公式 → 加载 KaTeX CSS（构建时已由 rehype-katex 渲染）
hasDiagram: boolean? # 文章包含 Mermaid 图表 → 动态加载 Mermaid JS
---
```

`hasMath: true` 的唯一作用是条件加载 KaTeX CSS (~25KB gzip)。KaTeX 的数学渲染已在构建时完成（remark-math + rehype-katex），运行时零 JS。Mermaid 必须在客户端运行，`hasDiagram: true` 触发动态 import。

## 不做的事

明确**不做**以下，避免 scope creep：

- ❌ 评论手写实现（直接用 Giscus）
- ❌ 后台 CMS（文件即数据库，Markdown 写文章）
- ❌ 多语言切换（用户单语言写作）
- ❌ 用户登录/会员体系
- ❌ 复杂的卡片式布局（Matery 那种）
- ❌ 第一版加滚动动画（保持轻量）
- ❌ 自建评论/点赞系统

## 阶段划分

### v1 — 核心体验（Dark Mode Only）

**页面**
- 文章列表页（首页）
- 文章详情页
- About 页

**组件**
- Header（滚动背景切换，无 theme toggle）
- Footer
- PostItem（文章列表行）
- TagList
- CodeBlock（Shiki dark theme）
- CopyButton（代码块复制）

**排版**
- 完整排版系统（含间距规范）
- Inter + JetBrains Mono + 中文 fallback
- font-display: swap + preload

**内容**
- Shiki 代码高亮（dark theme only）
- KaTeX 构建时渲染（条件加载 CSS）

**响应式**
- 桌面端优先，移动端基本可用

### v2 — 功能增强

- Light mode 主题 + tag 对比度修复
- Theme toggle 组件
- Giscus 评论系统（懒加载）
- Pagefind 搜索
- Mermaid 图表支持
- OG 图自动生成（含中文字体处理）
- RSS feed
- Post list 分页策略

### v3 — 动画层

- 入场动画（GSAP / Framer Motion）
- 滚动驱动动画
- 页面过渡动画
- 交互反馈微动画

## 验收标准

第一版上线时，应该满足：

- [ ] Lighthouse 性能分 ≥ 95（mobile + desktop）
- [ ] 首屏 LCP < 1.5s
- [x] Dark mode only（Light mode 延后至 v2）
- [ ] 代码块高亮 + 复制 + 行号 + 语言标签
- [ ] RSS feed 可订阅
- [ ] 站内搜索可用
- [ ] 至少一篇示例文章（含代码、公式、图表）
- [ ] About 页有 CSDN 历史归档链接
- [ ] 部署到 `https://gzb1128.github.io` 可访问

## 决策记录

| 决策项 | 选择 | 理由 |
|--------|------|------|
| Accent 色 | #5E6AD2 Linear 蓝 | 专业、克制、与 dark 背景协调 |
| 代码主题 | github-dark / github-light | 最熟悉、最广泛使用的主题 |
| Header Logo | `$ zephyr.lab` | Prompt 风格，code editor 隐喻 |
| Hero 风格 | Prompt Line (B) | 垂直分层，$ 作为视觉锚点，醒目但不喧宾夺主 |
| Tags 位置 | Transition Zone (A3) | 不破坏 hero 极简，作为 hero 到内容的自然过渡 |
| 全量/分阶段 | 9 phases 一次完成 | 用户确认 |
