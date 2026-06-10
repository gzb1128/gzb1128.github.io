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
├── network/        # 计算机网络
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

**配色系统**（已定稿）：

权威设计规范见 `docs/superpowers/specs/2026-06-08-zephyr-lab-design.md`。`docs/design.md` 是历史草稿，如有冲突以后者为准。

```
背景：#08090A (Linear 同款 near-black)
前景：#F7F8F8
次要文字：#8A8F98
强调色：#5E6AD2 (Linear 紫蓝)
代码块：#1C1C1F
边框：#1F2125 / #2A2D33 / #3A3D44
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

### 组件目录约定

```
src/components/
  core/          → 静态 UI 组件，零 JS（Header, Footer, PostItem, TagList...）
  interactive/   → 需要水合的组件（CopyButton, SearchModal...），使用 client:visible
  animated/      → 预留，v3 使用（GSAP / Framer Motion 动画组件）
```

规则：
- core/ 下的组件不引入任何 `<script>` 或 `client:*` 指令
- interactive/ 下的组件使用 client:visible 水合（最小化 JS 体积）
- animated/ 目录 v1 创建但保持空，放一个 .gitkeep

### Tailwind CSS Token 规则

- 颜色来源以设计规约的 hex 值为准，不引入未经验证的 oklch 转换
- 通过 Tailwind 4 @theme 注册自定义 token（见 src/styles/global.css）
- 模板中统一使用 token 类名：bg-bg-primary, text-fg-primary, border-border-subtle
- 禁止使用 Tailwind 内置灰色系：bg-gray-900, text-gray-200, border-gray-700 等
- 新增颜色必须先在规约中定义 token，再注册到 @theme

## 技术文章撰写原则

每条原则下都有 RED（错误示范）和 GREEN（正确做法）。这些是从实际写作中沉淀的踩坑教训。

### 1. 结构承诺必须兑现

如果文章开头声明了"分N个阶段/步骤"，后续每个章节必须严格归属于其中一个阶段，不要塞入孤立小节破坏框架。

- RED：声明"三阶段"，但在阶段1和阶段2之间塞入"数据封装顺序"这种既不属于接入也不属于决策的章节
- GREEN：要么把孤立内容并入某个阶段，要么修改框架声明，让结构和内容匹配

### 2. 概念先铺垫，再使用

读者第一次遇到术语前，必须已经知道它是什么。不要让读者一边读一边自己拼图。

- RED：在"一跳的本质"章节才解释"网段"，但前面章节已经反复使用过
- GREEN：开篇就有"核心概念"章节铺垫接口、网段、掩码、网关，后续直接引用

**核心概念表格的使用边界**：核心概念表格用于全文反复引用的术语。只在文章中出现 1-2 次的术语不应加入表格，而应在首次出现处行内解释（括号补充或短句说明）。

- RED：在核心概念表格中为"三层网关"单独开一行，但全文只出现一次
- GREEN：在首次使用处行内解释——"跨 VNI 通信需要经过三层网关（在广播域之间做 IP 路由转发的设备）"

### 3. 内容去重

同一个知识点不要在两个章节分别讲一遍。

- RED：在"路由表自动构建"和"路由表来源"两节都讲了"直连路由是怎么生成的"
- GREEN：知识点出现一次，需要再次引用时只做交叉链接，例如"详见上文 [路由表来源](#路由表来源)"

### 4. 语言风格统一为技术陈述

技术博客的正文风格应当克制、陈述性、客观。避免口语化短句和俚语。

- RED：「网络层的发包逻辑就两步」「剩下的XX是XX的事」「就这么简单」
- GREEN：「网络层的发包逻辑包含两步」「MAC寻址和物理传输由数据链路层处理」

### 5. 不要中英混用做语法连接

技术名词可以保留英文（如 ARP、TCP），但**连接词、谓词**必须用中文。

- RED：「命中直连 or 非直连」「这个网段 vs 那个网段」
- GREEN：「命中直连或非直连」「这个网段与那个网段」

### 6. ASCII 图必须中英对齐

等宽字体下，一个中文字符占两个英文字符的宽度。中英混合的 ASCII 框图容易错位。

- RED：在 ASCII 图里用中文标签（如"路由器"），导致框线对不齐
- GREEN：要么 ASCII 图纯英文标签（Router/Switch/Host），要么改用 Mermaid 等渲染图表

### 7. 限定语境，避免绝对化

特殊场景的结论不能写成通用结论。家庭网络、教学示例都属于特定语境。

- RED：「路由器作为 DHCP 服务器」（其实只有家庭网络是这样，企业网用独立 DHCP 服务器）
- GREEN：「家庭网络中，路由器通常充当 DHCP 服务器；企业网中可能有独立的 DHCP 服务器」

### 8. 不要引入未铺垫的概念

文章末尾、表格、附录里出现的概念，正文必须铺垫过。

- RED：正文从未讲过传输层，但在"延伸阅读"里突然出现 BBR、CUBIC 拥塞控制算法
- GREEN：要么删除未铺垫的引用，要么补充一节简短说明

### 9. 段落收尾避免重复套路

不要每个章节都以"**xxx**：加粗短句"结尾，节奏会变得机械。

- RED：连续三个章节都以加粗标语收尾
- GREEN：根据章节内容选择不同的收尾方式 —— 总结句、过渡到下一节、留一个开放问题

### 10. 协议归属要严谨

涉及协议分层时，注意权威机构的划分差异。

- RED：「ARP 是数据链路层协议」（IEEE 划分为数据链路层，IETF 划分为网络层）
- GREEN：说明归属争议，或者明确选择一种标准并标注理由

### Self-Review 检查清单

提交文章前自查：

- [ ] 结构声明的章节框架，每个小节是否都归属其中？
- [ ] 每个术语第一次出现时是否已经解释或链接到定义？
- [ ] 有没有同一个知识点被讲了两次？
- [ ] 全文是否统一为技术陈述风格，没有口语化短句？
- [ ] 中英文之间的连接词是否都用中文？
- [ ] ASCII 图框线对齐了吗？
- [ ] 限定语境的结论是否标明了适用范围？
- [ ] 末尾/附录里的概念正文都铺垫过吗？
- [ ] 各章节收尾是否避免了重复套路？

## 当前进度

- [x] 技术选型确认
- [x] 视觉风格方向确认
- [x] 项目目录创建（`~/code/zephyr-lab/`）
- [x] AGENTS.md（本文件）
- [x] docs/design.md（历史草稿，已废弃）
- [x] docs/superpowers/specs/2026-06-08-zephyr-lab-design.md（已验证设计规范）
- [ ] Astro 项目初始化
- [ ] Linear 风格主题定制
- [ ] GitHub 仓库创建 + Actions 配置
- [ ] 第一篇文章
- [ ] CSDN 侧添加新博客链接
