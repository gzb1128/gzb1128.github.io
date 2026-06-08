# Implementation Plan

下一个 agent 在此项目目录下接手时的执行计划。按顺序执行，每完成一个 phase commit 一次。

## Prerequisites

- Node.js ≥ 20（Astro 5 要求）
- pnpm 或 npm
- 已确认 GitHub 用户名 `gzb1128`

## Phase 1: 项目初始化

```bash
cd ~/code/zephyr-lab

# 用 Astro 官方 blog starter（最简洁的起点，便于后续定制）
npm create astro@latest . -- --template blog --typescript strict --install --no-git
```

**注意**：
- 用 `.` 作为 target，安装到当前目录（不要新建子目录）
- `--no-git` 因为后续会手动 `git init`
- 选择 strict TypeScript

完成后初始化 git：

```bash
git init -b main
git add .
git commit -m "feat: initialize astro blog from official starter"
```

## Phase 2: 添加核心集成

```bash
npx astro add react tailwind mdx
```

后续手动安装：

```bash
npm install -D \
  @astrojs/sitemap \
  @astrojs/rss \
  rehype-katex \
  remark-math \
  rehype-pretty-code \
  shiki \
  pagefind

npm install \
  @fontsource-variable/inter \
  @fontsource-variable/jetbrains-mono
```

Commit：`chore: add core integrations (react, tailwind, mdx, search, math)`

## Phase 3: 设计系统落地

按 `docs/design.md` 实现：

1. `src/styles/tokens.css` — 配色、字体、间距 CSS variables
2. `src/styles/global.css` — reset + 基础样式
3. `tailwind.config.mjs` — 接入 design tokens
4. `src/layouts/BaseLayout.astro` — 全局 layout，引入字体和 tokens

Commit：`feat(design): implement linear-inspired dark theme tokens`

## Phase 4: 核心组件

按 design.md 的组件清单实现：

1. `src/components/core/Header.astro`
2. `src/components/core/Footer.astro`
3. `src/components/core/PostList.astro`（时间轴风格）
4. `src/components/core/CodeBlock.astro`（macOS 三色按钮 + 行号 + 语言标签）
5. `src/components/interactive/ThemeToggle.tsx`（React，dark/light 切换）
6. `src/components/interactive/CopyButton.tsx`

Commit：分多个，每个组件一个 commit，如 `feat(component): add Header with editor-style logo`

## Phase 5: 页面

1. `src/pages/index.astro` — 首页，terminal 风格 hero + 最新文章
2. `src/pages/posts/[...slug].astro` — 文章详情页
3. `src/pages/posts/index.astro` — 文章列表（按年份分组）
4. `src/pages/about.astro` — About 页（含 CSDN 归档链接）
5. `src/pages/rss.xml.js` — RSS feed
6. `src/pages/404.astro` — 404 页（terminal 风格 `command not found`）

Commit：`feat(pages): implement core pages (home, posts, about, rss)`

## Phase 6: 内容配置

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['ai-agent', 'cloud-native', 'algorithm', 'cryptography', 'essay']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

创建一篇示例文章 `src/content/posts/hello-world.mdx`，含代码块、KaTeX 公式、Mermaid 图，验证所有功能。

Commit：`feat(content): add content collection schema and example post`

## Phase 7: 搜索 & 评论

1. 配置 Pagefind 在 build 后生成索引
2. 添加 `src/components/interactive/Search.tsx`
3. 配置 Giscus（需要先在 GitHub 仓库启用 Discussions）

Commit：`feat: add pagefind search and giscus comments`

## Phase 8: 部署

1. 创建 GitHub 仓库 `gzb1128.github.io`：
   ```bash
   gh repo create gzb1128/gzb1128.github.io --public --source=. --remote=origin
   ```

2. 添加 `.github/workflows/deploy.yml`（见下方模板）

3. 推送：
   ```bash
   git push -u origin main
   ```

4. 在 GitHub 仓库设置中开启 Pages：
   - Settings → Pages → Source: GitHub Actions

5. 验证 `https://gzb1128.github.io` 可访问

Commit：`ci: add github pages deployment workflow`

### Workflow 模板

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Generate Pagefind search index
        run: npx pagefind --site dist
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

## Phase 9: 收尾

- [ ] 在 CSDN 个人简介添加 Zephyr's Lab 链接
- [ ] 写一篇「迁移公告」文章（CSDN + 新博客双发）
- [ ] 在 README.md 写明项目结构
- [ ] 添加 LICENSE（MIT 或 CC BY-SA 4.0，文章和代码可分别授权）

## 验收

参考 `docs/design.md` 的「验收标准」section。

## 不要做的事

- ❌ 不要套用现成主题（AstroPaper、Cactus 等）— 用户明确要求自定义
- ❌ 不要在第一版加 GSAP/Lenis 等动画库 — 保持轻量
- ❌ 不要迁移 CSDN 旧文章 — 增量策略，新内容才发新博客
- ❌ 不要 commit `node_modules`、`dist`、`.astro`、`.DS_Store`
- ❌ 不要在 commit 信息里加 emoji 或 AI 署名
