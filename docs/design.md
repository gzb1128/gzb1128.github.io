# Zephyr's Lab — Design Spec (Draft)

> **已废弃** — 本文档已被 `docs/superpowers/specs/2026-06-08-zephyr-lab-design.md` 替代。
> 如有冲突，以新 spec 为准。

视觉与交互设计规范。后续 AI Agent 实现 UI 时以此为准。

## 设计哲学

**Linear.app 的克制 × Code Editor 的亲切 × 保留动画扩展空间**

三条准则，按优先级排序：

1. **Content first** — 内容（文字、代码）是主角，UI 是衬托
2. **Editor metaphor** — 借用代码编辑器的隐喻（等宽字体、行号、文件标签、syntax 配色），让程序员一进站就觉得"自己人"
3. **Performance budget** — 默认零 JS，动画按需引入；首屏 LCP < 1.5s

## 配色系统

### Dark Mode（默认）

参考 Linear 的 `#08090A` 但稍作调整，让黑色不那么死板：

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

只做基本兼容，不投入过多优化（用户偏好 dark）：

```css
--bg-primary:    #FFFFFF;
--bg-secondary:  #F7F8F8;
--bg-tertiary:   #F3F4F6;
--fg-primary:    #08090A;
--fg-secondary:  #3C4149;
--fg-tertiary:   #6B7280;
--border-subtle: #E5E7EB;
--border-default:#D1D5DB;
--accent-primary:#5E6AD2;
```

## 字体系统

### 字体栈

```css
/* Sans (UI、正文) */
--font-sans: "Inter Variable", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* Mono (代码、技术元素、数字) */
--font-mono: "JetBrains Mono Variable", "Geist Mono", "SF Mono", Menlo, Consolas, monospace;

/* Serif (可选，用于长文章引用) */
--font-serif: "Source Serif 4", Georgia, serif;
```

### 类型层级

```
H1   2.25rem  font-bold  letter-spacing -0.02em   (文章主标题)
H2   1.5rem   font-semibold letter-spacing -0.01em (二级标题)
H3   1.25rem  font-semibold
H4   1.125rem font-medium
Body 1rem     line-height 1.7   (正文，长行高便于阅读)
Meta 0.875rem font-mono color-tertiary (时间、tag、面包屑)
Code 0.9rem   font-mono                (内联代码)
```

### Editor 风格细节

- **导航栏 logo**：用等宽字体显示 `~/zephyr` 或 `$ zephyr` 的 prompt 风格
- **页面标题前缀**：可选地添加 `// ` 或 `# `（像注释）
- **时间戳**：`2026-06-08T10:44:00Z` 格式，等宽字体
- **Tag**：用 `[tag-name]` 或 `#tag` 风格，等宽

## 布局

### 全局栅格

```
┌──────────────────────────────────────────────────┐
│  Header (sticky, 56px)                           │
│  $ zephyr.lab          [posts] [about] [rss] [☾] │
├──────────────────────────────────────────────────┤
│                                                  │
│  Main Content (max-width: 720px center)          │
│                                                  │
│                                                  │
├──────────────────────────────────────────────────┤
│  Footer (color-tertiary, font-mono)              │
└──────────────────────────────────────────────────┘
```

### 关键尺寸

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

## 关键组件

### 1. Header

- **高度**：56px，sticky，初始透明
- **滚动后**：背景变 `rgba(8,9,10,0.7)` + `backdrop-filter: blur(12px)` + 底部细边框
- **logo**：`$ zephyr.lab`（等宽字体）
- **导航**：Posts / About / RSS / 主题切换
- **不要**做 nexu.io 那种胶囊变形（过度设计），保持克制

### 2. Hero（首页）

简洁的 terminal 风格自我介绍：

```
$ whoami
> Zephyr Gao

$ ls ~/work
> ai-agent/   cloud-native/   algorithm/   essay/

$ cat tagline.txt
> Notes on agents, kernels, and the systems in between.
```

不需要 nexu.io 的复杂动画，但**结构上预留 hero slot**，未来可替换为带动画的版本。

### 3. Post List

```
2026 ──────────────────────────────────────
├─ Jun 08  Building OpenCode Plugins         [ai-agent]
├─ May 24  K8s Controller Patterns           [cloud-native]
└─ Apr 15  Why I Left CSDN                   [essay]

2025 ──────────────────────────────────────
└─ Sep 17  从位运算角度重新理解树状数组    [algorithm]
```

时间轴样式，等宽字体，tag 用方括号风格。

### 4. Post Detail

- 顶部：标题 + 元信息（日期、tags、阅读时长、字数）
- 正文：720px 居中，行高 1.7
- 代码块：见下方 §代码块 详细规范
- 底部：上一篇/下一篇导航 + Giscus 评论

### 5. 代码块（**重点**）

这是程序员博客的灵魂，必须做好。

**规范**：
- 高亮引擎：Shiki（Astro 内置），dual-theme 配置
- Dark theme：`github-dark-default` 或 `vitesse-dark`
- Light theme：`github-light-default` 或 `vitesse-light`
- **必备元素**：
  - 顶部 macOS 三色按钮（红黄绿）— 增强 editor 亲切感
  - 右上角语言标签（`go` / `tsx` / `bash`）
  - 复制按钮（hover 时出现）
  - 行号（可选，长代码必备）
  - 行高亮（用 `// [!code highlight]` 注释驱动）
- 圆角 12px，背景 `--bg-tertiary`，边框 `--border-subtle`

```
┌─ ● ● ●                              go ─┐
│ 1  package main                          │
│ 2                                        │
│ 3  func main() {                         │
│ 4      fmt.Println("hello")              │
│ 5  }                                     │
└──────────────────────────────────────────┘
```

### 6. 内联代码

```css
font-family: var(--font-mono);
font-size: 0.9em;
padding: 0.125em 0.375em;
background: var(--bg-tertiary);
border: 1px solid var(--border-subtle);
border-radius: 4px;
```

### 7. Tag

`[tag-name]` 风格，等宽字体，颜色可与 syntax-string 同色。hover 时变 accent。

### 8. Footer

```
─────────────────────────────────────────────
© 2026 Zephyr Gao · Built with Astro
[github] [csdn] [rss] [feeds]
```

颜色 tertiary，字体 mono。

## 动画策略

### 第一版（极简）

只做最基础的微交互：

- 链接 hover：颜色过渡 200ms ease
- 按钮 hover：背景过渡 200ms ease
- 代码块复制按钮：fade in/out
- 主题切换：使用 Astro 5 的 View Transitions（原生 API）
- 页面切换：View Transitions（无需 JS）

### 第二版（增强，预留扩展点）

后续添加，但**架构上要预留**：

- 文章入场：fade up + stagger（`@fadeIn` 工具类）
- 滚动进度条：顶部 1px 进度条
- 图片懒加载 + blur-up
- 长文 TOC 高亮当前章节

### 第三版（nexu.io 级别）

如果未来想做 hero 动画或专题页：

- 引入 GSAP + ScrollTrigger
- 引入 Lenis 实现平滑滚动
- 创建独立的 `landing-pages/` 目录，每个 landing page 是一个 Astro page，可以注入重度动画
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
│   │   ├── ThemeToggle.tsx
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

## SEO & Meta

- 每篇文章自动生成 OG 图（用 Astro 的 `@vercel/og` 或 `satori`）
- OG 图风格：黑底 + 标题 + tag + 站点名（沿用 editor 美学）
- `<title>` 格式：`{文章标题} — Zephyr's Lab`
- 站点 description：`Notes on agents, kernels, and the systems in between.`
- robots.txt + sitemap.xml + RSS（Astro 集成插件）

## 不做的事

明确**不做**以下，避免 scope creep：

- ❌ 评论手写实现（直接用 Giscus）
- ❌ 后台 CMS（文件即数据库，Markdown 写文章）
- ❌ 多语言切换（用户单语言写作）
- ❌ 用户登录/会员体系
- ❌ 复杂的卡片式布局（Matery 那种）
- ❌ 第一版加滚动动画（保持轻量）
- ❌ 自建评论/点赞系统

## 验收标准

第一版上线时，应该满足：

- [ ] Lighthouse 性能分 ≥ 95（mobile + desktop）
- [ ] 首屏 LCP < 1.5s
- [ ] 默认 dark mode，可切换 light
- [ ] 代码块高亮 + 复制 + 行号 + 语言标签
- [ ] RSS feed 可订阅
- [ ] 站内搜索可用
- [ ] 至少一篇示例文章（含代码、公式、图表）
- [ ] About 页有 CSDN 历史归档链接
- [ ] 部署到 `https://gzb1128.github.io` 可访问
