# Zephyr's Lab — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Zephyr's Lab, a personal technical blog with Linear-inspired dark theme and code editor aesthetics.

**Architecture:** Astro 5 static site with React islands for interactive components. Content stored as MDX files in `src/content/posts/`. Zero JS by default; interactive components (theme toggle, search, copy button) load as React islands via `client:load`. Deployed to GitHub Pages via GitHub Actions.

**Tech Stack:** Astro 5, React, Tailwind CSS 4, MDX, Shiki, KaTeX, Mermaid, Pagefind, Giscus

**Design Spec:** `docs/superpowers/specs/2026-06-08-zephyr-lab-design.md`

---

## File Structure

```
src/
├── styles/
│   ├── tokens.css          # CSS custom properties (colors, fonts, spacing)
│   └── global.css          # Reset + base styles + Tailwind directives
├── components/
│   ├── core/
│   │   ├── Header.astro    # Sticky header with $ zephyr.lab logo
│   │   ├── Footer.astro    # Minimal footer with links
│   │   ├── Hero.astro      # Prompt-line hero for homepage
│   │   ├── TagList.astro   # Transition zone tag display
│   │   └── PostList.astro  # Timeline-style post listing
│   ├── interactive/
│   │   ├── ThemeToggle.tsx # Dark/light mode React island
│   │   ├── CopyButton.tsx  # Code block copy button React island
│   │   └── Search.tsx      # Pagefind search modal React island
│   └── animated/
│       └── .gitkeep        # Future animation components
├── layouts/
│   ├── BaseLayout.astro    # Shell: head, header, footer, theme script
│   └── PostLayout.astro    # Article layout: title, meta, content, nav
├── pages/
│   ├── index.astro         # Homepage: Hero + TagList + PostList
│   ├── about.astro         # About page with editor aesthetic
│   ├── 404.astro           # Terminal-style 404
│   └── posts/
│       ├── [...slug].astro # Individual post page
│       ├── index.astro     # All posts listing
│       └── [tag]/index.astro # Posts filtered by tag
├── content/
│   ├── config.ts           # Content collection schema
│   └── posts/              # MDX blog posts
│       └── hello-zephyr-lab.mdx
└── utils/
    └── tags.ts             # Tag color mapping helper
```

---

## Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, etc. (via scaffolding)

- [ ] **Step 1: Scaffold Astro blog starter into current directory**

Run:
```bash
cd ~/code/zephyr-lab && npm create astro@latest . -- --template blog --typescript strict --install --no-git
```

Answer any prompts accepting defaults. The `.` target installs into the current directory. `--no-git` because we already have a git repo.

- [ ] **Step 2: Verify scaffolding succeeded**

Run: `ls src/pages/index.astro`
Expected: file exists

- [ ] **Step 3: Clean up starter boilerplate**

Remove default blog content that we'll replace:
```bash
rm -rf src/content/blog/
rm -f src/styles/global.css
```

Keep `src/layouts/`, `src/pages/`, `src/content/` directories.

- [ ] **Step 4: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts on `localhost:4321`, no errors. Stop it with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: initialize astro blog from official starter"
```

---

## Task 2: Add Core Integrations

**Files:**
- Modify: `astro.config.mjs`
- Create: `tailwind.config.mjs` (auto-generated)

- [ ] **Step 1: Add Astro integrations**

Run:
```bash
npx astro add react tailwind mdx --yes
```

This modifies `astro.config.mjs` and creates `tailwind.config.mjs`.

- [ ] **Step 2: Install additional dependencies**

Run:
```bash
npm install -D @astrojs/sitemap rehype-katex remark-math pagefind
npm install @fontsource-variable/inter @fontsource-variable/jetbrains-mono
```

- [ ] **Step 3: Configure astro.config.mjs with all integrations**

Replace `astro.config.mjs` with:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gzb1128.github.io',
  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      light: 'github-light-default',
      wrap: true,
    },
    remarkPlugins: ['remark-math'],
    rehypePlugins: ['rehype-katex'],
  },
});
```

- [ ] **Step 4: Verify build succeeds**

Run: `npm run build`
Expected: Build completes without errors.

- [ ] **Step 5: Create component directory structure**

```bash
mkdir -p src/components/core src/components/interactive src/components/animated src/utils
touch src/components/animated/.gitkeep
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: add core integrations (react, tailwind, mdx, sitemap, math)"
```

---

## Task 3: Design System — CSS Tokens & Global Styles

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`

- [ ] **Step 1: Create design tokens**

Create `src/styles/tokens.css`:

```css
:root {
  --font-sans: "Inter Variable", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", "Geist Mono", "SF Mono", Menlo, Consolas, monospace;
  --font-serif: "Source Serif 4", Georgia, serif;

  --max-width-prose: 720px;
  --max-width-wide: 1200px;
  --header-height: 56px;

  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  --space-4xl: 6rem;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 12px;
}

:root[data-theme="dark"] {
  --bg-primary: #08090A;
  --bg-secondary: #0F1011;
  --bg-tertiary: #1C1C1F;
  --bg-hover: #16171A;

  --fg-primary: #F7F8F8;
  --fg-secondary: #B4B8BD;
  --fg-tertiary: #8A8F98;
  --fg-disabled: #4D5158;

  --border-subtle: #1F2125;
  --border-default: #2A2D33;
  --border-strong: #3A3D44;

  --accent-primary: #5E6AD2;
  --accent-secondary: #7B85E8;

  --syntax-keyword: #C586C0;
  --syntax-string: #CE9178;
  --syntax-number: #B5CEA8;
  --syntax-comment: #6A737D;
  --syntax-fn: #DCDCAA;
}

:root[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F7F8F8;
  --bg-tertiary: #F3F4F6;
  --bg-hover: #F0F1F3;

  --fg-primary: #08090A;
  --fg-secondary: #3C4149;
  --fg-tertiary: #6B7280;
  --fg-disabled: #9CA3AF;

  --border-subtle: #E5E7EB;
  --border-default: #D1D5DB;
  --border-strong: #B0B5BD;

  --accent-primary: #5E6AD2;
  --accent-secondary: #7B85E8;
}
```

- [ ] **Step 2: Create global styles**

Create `src/styles/global.css`:

```css
@import "tailwindcss";
@import "./tokens.css";

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-sans);
  color: var(--fg-primary);
  background-color: var(--bg-primary);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
}

a {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color 200ms ease;
}

a:hover {
  color: var(--accent-secondary);
}

code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  padding: 0.125em 0.375em;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
}

pre code {
  padding: 0;
  background: none;
  border: none;
  border-radius: 0;
}

h1, h2, h3, h4 {
  color: var(--fg-primary);
  line-height: 1.3;
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

h4 {
  font-size: 1.125rem;
  font-weight: 500;
}
```

- [ ] **Step 3: Verify tokens load correctly**

Run: `npm run build`
Expected: No CSS errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(design): implement linear-inspired dark theme tokens and global styles"
```

---

## Task 4: Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../styles/global.css';
import Header from '../components/core/Header.astro';
import Footer from '../components/core/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = 'Notes on agents, kernels, and the systems in between.',
} = Astro.props;
---

<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <script is:inline>
      const theme = localStorage.getItem('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    </script>
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Create placeholder Header**

Create `src/components/core/Header.astro`:

```astro
---
const nav = [
  { href: '/posts', label: 'posts' },
  { href: '/about', label: 'about' },
  { href: '/rss.xml', label: 'rss' },
];
---

<header class="header">
  <nav class="header-nav">
    <a href="/" class="header-logo">$ zephyr.lab</a>
    <div class="header-links">
      {nav.map(({ href, label }) => (
        <a href={href}>{label}</a>
      ))}
    </div>
  </nav>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    height: var(--header-height);
    display: flex;
    align-items: center;
    z-index: 100;
    background: rgba(8, 9, 10, 0.7);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-subtle);
  }

  .header-nav {
    width: 100%;
    max-width: var(--max-width-wide);
    margin: 0 auto;
    padding: 0 var(--space-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-logo {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--accent-primary);
  }

  .header-links {
    display: flex;
    gap: var(--space-lg);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--fg-tertiary);
  }

  .header-links a {
    color: var(--fg-tertiary);
  }

  .header-links a:hover {
    color: var(--fg-primary);
  }
</style>
```

- [ ] **Step 3: Create placeholder Footer**

Create `src/components/core/Footer.astro`:

```astro
---

---

<footer class="footer">
  <div class="footer-content">
    <span>&copy; 2026 Zephyr Gao &middot; Built with Astro</span>
    <div class="footer-links">
      <a href="https://github.com/gzb1128" target="_blank" rel="noopener">github</a>
      <a href="https://blog.csdn.net/qq_36993218" target="_blank" rel="noopener">csdn</a>
      <a href="/rss.xml">rss</a>
    </div>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--border-subtle);
    padding: var(--space-xl) var(--space-lg);
    text-align: center;
  }

  .footer-content {
    max-width: var(--max-width-wide);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--fg-disabled);
  }

  .footer-links {
    display: flex;
    gap: var(--space-lg);
    justify-content: center;
  }

  .footer-links a {
    color: var(--fg-disabled);
  }

  .footer-links a:hover {
    color: var(--accent-primary);
  }
</style>
```

- [ ] **Step 4: Verify layout renders**

Run: `npm run dev`
Expected: Page loads with header showing `$ zephyr.lab` and footer with copyright.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(layout): add BaseLayout with Header and Footer"
```

---

## Task 5: Content Collection Schema

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/hello-zephyr-lab.mdx`

- [ ] **Step 1: Create content collection config**

Create `src/content/config.ts`:

```typescript
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

- [ ] **Step 2: Create sample blog post**

Create `src/content/posts/hello-zephyr-lab.mdx`:

```mdx
---
title: "Hello, Zephyr's Lab"
description: "First post on the new blog — verifying code blocks, math, and diagrams."
pubDate: 2026-06-08
category: "essay"
tags: ["meta"]
---

Welcome to **Zephyr's Lab**. This post verifies all content features work.

## Code Block

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello from Zephyr's Lab!") // [!code highlight]
}
```

## Math (KaTeX)

The Fourier transform:

$$
\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-2\pi i x \xi} \, dx
$$

Inline math: $E = mc^2$.

## Inline Elements

This has `inline code` and a [link](/).

## Conclusion

If you can read this, everything works.
```

- [ ] **Step 3: Verify content collection resolves**

Run: `npm run build`
Expected: Build succeeds, content collection is valid.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(content): add content collection schema and sample post"
```

---

## Task 6: Tag Color Utility

**Files:**
- Create: `src/utils/tags.ts`

- [ ] **Step 1: Create tag color mapping**

Create `src/utils/tags.ts`:

```typescript
export type Category = 'ai-agent' | 'cloud-native' | 'algorithm' | 'cryptography' | 'essay';

const TAG_COLORS: Record<Category, string> = {
  'ai-agent': 'var(--syntax-string)',
  'cloud-native': 'var(--syntax-keyword)',
  'algorithm': 'var(--syntax-number)',
  'cryptography': 'var(--syntax-fn)',
  'essay': 'var(--syntax-comment)',
};

export function getTagColor(tag: Category): string {
  return TAG_COLORS[tag] || 'var(--fg-tertiary)';
}

export const ALL_CATEGORIES: Category[] = [
  'ai-agent',
  'cloud-native',
  'algorithm',
  'cryptography',
  'essay',
];
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat(utils): add tag color mapping utility"
```

---

## Task 7: Hero & Transition Zone Components

**Files:**
- Create: `src/components/core/Hero.astro`
- Create: `src/components/core/TagList.astro`

- [ ] **Step 1: Create Hero component**

Create `src/components/core/Hero.astro`:

```astro
---

---

<section class="hero">
  <div class="hero-content">
    <div class="hero-prompt">$ zephyr.lab</div>
    <h1 class="hero-title">
      Notes on agents, kernels,<br />
      and the systems in between.
    </h1>
    <p class="hero-subtitle">A technical blog by Zephyr Gao</p>
  </div>
</section>

<style>
  .hero {
    padding: calc(var(--space-4xl) + var(--header-height)) var(--space-lg) var(--space-3xl);
    text-align: center;
  }

  .hero-content {
    max-width: var(--max-width-prose);
    margin: 0 auto;
  }

  .hero-prompt {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--accent-primary);
    margin-bottom: var(--space-xl);
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: var(--space-lg);
  }

  .hero-subtitle {
    font-size: 1rem;
    color: var(--fg-secondary);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 1.75rem;
    }

    .hero {
      padding-top: var(--space-3xl);
    }
  }
</style>
```

- [ ] **Step 2: Create TagList (Transition Zone) component**

Create `src/components/core/TagList.astro`:

```astro
---
import { ALL_CATEGORIES, getTagColor } from '../../utils/tags';
---

<section class="transition-zone">
  <div class="transition-inner">
    <div class="topics-label">TOPICS</div>
    <div class="tags">
      {ALL_CATEGORIES.map((tag) => (
        <a
          href={`/posts/${tag}/`}
          class="tag"
          style={`color: ${getTagColor(tag)}`}
        >
          [{tag}]
        </a>
      ))}
    </div>
  </div>
</section>

<style>
  .transition-zone {
    border-top: 1px solid var(--border-subtle);
    padding: var(--space-xl) var(--space-lg) var(--space-2xl);
    text-align: center;
  }

  .transition-inner {
    max-width: var(--max-width-prose);
    margin: 0 auto;
  }

  .topics-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--fg-disabled);
    letter-spacing: 0.1em;
    margin-bottom: var(--space-md);
  }

  .tags {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-lg);
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }

  .tag {
    color: var(--fg-tertiary);
    transition: color 200ms ease;
  }

  .tag:hover {
    color: var(--accent-primary) !important;
  }

  @media (max-width: 768px) {
    .tags {
      overflow-x: auto;
      flex-wrap: nowrap;
      justify-content: flex-start;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .tags::-webkit-scrollbar {
      display: none;
    }
  }
</style>
```

- [ ] **Step 3: Verify components render**

Run: `npm run dev`
Expected: No import errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(components): add Hero and TagList transition zone"
```

---

## Task 8: PostList Component

**Files:**
- Create: `src/components/core/PostList.astro`

- [ ] **Step 1: Create PostList component**

Create `src/components/core/PostList.astro`:

```astro
---
import { getTagColor, type Category } from '../../utils/tags';

interface Props {
  posts: Array<{
    slug: string;
    data: {
      title: string;
      pubDate: Date;
      category: Category;
      description?: string;
      draft?: boolean;
    };
  }>;
  showYear?: boolean;
}

const { posts, showYear = true } = Astro.props;

const sorted = posts
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const grouped = showYear
  ? sorted.reduce<Record<number, typeof sorted>>((acc, post) => {
      const year = post.data.pubDate.getFullYear();
      acc[year] = acc[year] || [];
      acc[year].push(post);
      return acc;
    }, {})
  : { 0: sorted };

const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);
---

<section class="post-list">
  {years.map((year) => (
    <div class="year-group">
      {showYear && (
        <div class="year-header">
          <span class="year-label">{year}</span>
          <span class="year-line" />
        </div>
      )}
      {grouped[year].map((post) => {
        const date = post.data.pubDate;
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = String(date.getDate()).padStart(2, '0');
        return (
          <a href={`/posts/${post.slug}/`} class="post-item">
            <span class="post-tree">├─</span>
            <span class="post-date">{month} {day}</span>
            <span class="post-title">{post.data.title}</span>
            <span
              class="post-tag"
              style={`color: ${getTagColor(post.data.category)}`}
            >
              [{post.data.category}]
            </span>
          </a>
        );
      })}
    </div>
  ))}
</section>

<style>
  .post-list {
    max-width: var(--max-width-prose);
    margin: 0 auto;
    padding: var(--space-xl) var(--space-lg);
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  .year-group {
    margin-bottom: var(--space-2xl);
  }

  .year-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
  }

  .year-label {
    color: var(--fg-tertiary);
    font-size: 0.875rem;
  }

  .year-line {
    flex: 1;
    height: 1px;
    background: var(--border-subtle);
  }

  .post-item {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: var(--fg-primary);
    transition: background 200ms ease;
  }

  .post-item:hover {
    background: var(--bg-hover);
  }

  .post-tree {
    color: var(--fg-disabled);
  }

  .post-date {
    color: var(--fg-tertiary);
    min-width: 5.5em;
  }

  .post-title {
    flex: 1;
    color: var(--fg-primary);
    font-family: var(--font-sans);
    font-size: 0.95rem;
  }

  .post-tag {
    margin-left: auto;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    .post-item {
      flex-wrap: wrap;
    }

    .post-tag {
      margin-left: calc(1ch + var(--space-sm) + 5.5em + var(--space-sm));
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat(component): add PostList with timeline layout"
```

---

## Task 9: Post Detail Layout

**Files:**
- Create: `src/layouts/PostLayout.astro`

- [ ] **Step 1: Create PostLayout**

Create `src/layouts/PostLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import { getTagColor, type Category } from '../utils/tags';

interface Props {
  title: string;
  pubDate: Date;
  category: Category;
  description?: string;
  updatedDate?: Date;
}

const { title, pubDate, category, description, updatedDate } = Astro.props;

const dateStr = pubDate.toISOString().split('T')[0];
const updatedStr = updatedDate ? updatedDate.toISOString().split('T')[0] : null;
---

<BaseLayout title={`${title} — Zephyr's Lab`} description={description}>
  <article class="post">
    <header class="post-header">
      <h1 class="post-title">{title}</h1>
      <div class="post-meta">
        <time datetime={dateStr}>{dateStr}</time>
        {updatedStr && (
          <span class="post-updated">(updated: {updatedStr})</span>
        )}
        <span
          class="post-category"
          style={`color: ${getTagColor(category)}`}
        >
          [{category}]
        </span>
      </div>
    </header>
    <div class="post-content">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  .post {
    max-width: var(--max-width-prose);
    margin: 0 auto;
    padding: calc(var(--space-3xl) + var(--header-height)) var(--space-lg) var(--space-4xl);
  }

  .post-header {
    margin-bottom: var(--space-2xl);
  }

  .post-title {
    font-size: 2.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: var(--space-md);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--fg-tertiary);
  }

  .post-updated {
    color: var(--fg-disabled);
  }

  .post-category {
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }

  .post-content {
    line-height: 1.7;
  }

  .post-content :global(h2) {
    margin-top: var(--space-2xl);
    margin-bottom: var(--space-md);
  }

  .post-content :global(h3) {
    margin-top: var(--space-xl);
    margin-bottom: var(--space-sm);
  }

  .post-content :global(p) {
    margin-bottom: var(--space-md);
  }

  .post-content :global(pre) {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    margin: var(--space-xl) 0;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    position: relative;
  }

  .post-content :global(blockquote) {
    border-left: 3px solid var(--accent-primary);
    padding-left: var(--space-lg);
    color: var(--fg-secondary);
    margin: var(--space-xl) 0;
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    margin-bottom: var(--space-md);
    padding-left: var(--space-lg);
  }

  .post-content :global(img) {
    max-width: 100%;
    border-radius: var(--radius-md);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat(layout): add PostLayout for article pages"
```

---

## Task 10: Pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`
- Create: `src/pages/posts/[...slug].astro`
- Create: `src/pages/posts/index.astro`
- Create: `src/pages/posts/[tag]/index.astro`
- Create: `src/pages/rss.xml.js`

- [ ] **Step 1: Create homepage**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/core/Hero.astro';
import TagList from '../components/core/TagList.astro';
import PostList from '../components/core/PostList.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('posts');
---

<BaseLayout title="Zephyr's Lab">
  <Hero />
  <TagList />
  <PostList posts={allPosts} />
</BaseLayout>
```

- [ ] **Step 2: Create about page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About — Zephyr's Lab" description="About Zephyr Gao and this blog.">
  <section class="about">
    <div class="about-prefix">// about.md</div>
    <h1 class="about-name">Zephyr Gao</h1>
    <p class="about-bio">
      Backend engineer working on AI agent tooling and Kubernetes ecosystems.
    </p>
    <div class="about-stack">
      Go &middot; TypeScript &middot; Python &middot; Java (Spring)
    </div>
    <div class="about-divider" />
    <div class="about-section-label">Links</div>
    <ul class="about-links">
      <li>
        <span class="link-arrow">&rarr;</span>
        <strong>GitHub</strong>
        <a href="https://github.com/gzb1128" target="_blank" rel="noopener">github.com/gzb1128</a>
      </li>
      <li>
        <span class="link-arrow">&rarr;</span>
        <strong>CSDN</strong>
        <a href="https://blog.csdn.net/qq_36993218" target="_blank" rel="noopener">blog.csdn.net/qq_36993218</a>
        <span class="link-note">(历史归档，185 篇)</span>
      </li>
      <li>
        <span class="link-arrow">&rarr;</span>
        <strong>RSS</strong>
        <a href="/rss.xml">/rss.xml</a>
      </li>
    </ul>
  </section>
</BaseLayout>

<style>
  .about {
    max-width: var(--max-width-prose);
    margin: 0 auto;
    padding: calc(var(--space-3xl) + var(--header-height)) var(--space-lg) var(--space-4xl);
  }

  .about-prefix {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--fg-disabled);
    margin-bottom: var(--space-lg);
  }

  .about-name {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: var(--space-md);
  }

  .about-bio {
    color: var(--fg-secondary);
    margin-bottom: var(--space-md);
    line-height: 1.6;
  }

  .about-stack {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--fg-tertiary);
  }

  .about-divider {
    border-top: 1px solid var(--border-subtle);
    margin: var(--space-2xl) 0;
  }

  .about-section-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--fg-disabled);
    letter-spacing: 0.1em;
    margin-bottom: var(--space-md);
  }

  .about-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  .about-links li {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
  }

  .link-arrow {
    color: var(--accent-primary);
  }

  .about-links strong {
    min-width: 5em;
    color: var(--fg-secondary);
  }

  .link-note {
    color: var(--fg-disabled);
    font-size: 0.8rem;
  }
</style>
```

- [ ] **Step 3: Create 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="404 — Zephyr's Lab">
  <section class="not-found">
    <div class="not-found-code">404</div>
    <div class="not-found-msg">
      <span class="prompt">$</span> page not found
      <span class="cursor">&nbsp;</span>
    </div>
    <a href="/" class="not-found-link">$ cd ~/</a>
  </section>
</BaseLayout>

<style>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    font-family: var(--font-mono);
    text-align: center;
  }

  .not-found-code {
    font-size: 6rem;
    font-weight: 700;
    color: var(--fg-disabled);
    line-height: 1;
  }

  .not-found-msg {
    font-size: 1.125rem;
    color: var(--fg-tertiary);
    margin: var(--space-lg) 0;
  }

  .prompt {
    color: var(--accent-primary);
  }

  .cursor {
    border-right: 2px solid var(--accent-primary);
    animation: blink 1s step-end infinite;
  }

  .not-found-link {
    font-size: 0.875rem;
    color: var(--accent-primary);
  }

  @keyframes blink {
    50% { opacity: 0; }
  }
</style>
```

- [ ] **Step 4: Create post detail page**

Create `src/pages/posts/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<PostLayout
  title={post.data.title}
  pubDate={post.data.pubDate}
  category={post.data.category}
  description={post.data.description}
  updatedDate={post.data.updatedDate}
>
  <Content />
</PostLayout>
```

- [ ] **Step 5: Create posts index page**

Create `src/pages/posts/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostList from '../../components/core/PostList.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('posts');
---

<BaseLayout title="Posts — Zephyr's Lab">
  <section class="posts-page">
    <div class="posts-header">// all-posts</div>
    <PostList posts={allPosts} />
  </section>
</BaseLayout>

<style>
  .posts-page {
    padding-top: calc(var(--header-height) + var(--space-2xl));
  }

  .posts-header {
    max-width: var(--max-width-prose);
    margin: 0 auto;
    padding: 0 var(--space-lg);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--fg-disabled);
    margin-bottom: var(--space-md);
  }
</style>
```

- [ ] **Step 6: Create tag-filtered posts page**

Create `src/pages/posts/[tag]/index.astro`:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import PostList from '../../../components/core/PostList.astro';
import { getCollection } from 'astro:content';
import type { Category } from '../../../utils/tags';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  const tags = [...new Set(posts.map((p) => p.data.category))];
  return tags.map((tag) => ({
    params: { tag },
    props: {
      tag,
      posts: posts.filter((p) => p.data.category === tag),
    },
  }));
}

const { tag, posts } = Astro.props;
---

<BaseLayout title={`[${tag}] — Zephyr's Lab`}>
  <section class="tag-page">
    <div class="tag-header">// filter: [{tag}]</div>
    <PostList posts={posts} />
  </section>
</BaseLayout>

<style>
  .tag-page {
    padding-top: calc(var(--header-height) + var(--space-2xl));
  }

  .tag-header {
    max-width: var(--max-width-prose);
    margin: 0 auto;
    padding: 0 var(--space-lg);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--fg-disabled);
    margin-bottom: var(--space-md);
  }
</style>
```

- [ ] **Step 7: Create RSS feed**

Create `src/pages/rss.xml.js`:

```javascript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: "Zephyr's Lab",
    description: 'Notes on agents, kernels, and the systems in between.',
    site: context.site,
    items: posts
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description || '',
        link: `/posts/${post.slug}/`,
      })),
  });
}
```

- [ ] **Step 8: Verify all pages build**

Run: `npm run build`
Expected: Build succeeds, all routes generated.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat(pages): add home, about, 404, posts, tag filter, and RSS"
```

---

## Task 11: Theme Toggle (React Island)

**Files:**
- Create: `src/components/interactive/ThemeToggle.tsx`

- [ ] **Step 1: Create ThemeToggle component**

Create `src/components/interactive/ThemeToggle.tsx`:

```tsx
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (stored) setTheme(stored);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.875rem',
        color: 'var(--fg-tertiary)',
        padding: '4px',
      }}
    >
      {theme === 'dark' ? '☾' : '☀'}
    </button>
  );
}
```

- [ ] **Step 2: Add ThemeToggle to Header**

Update `src/components/core/Header.astro` — add after the nav links:

```astro
---
import ThemeToggle from '../interactive/ThemeToggle.tsx';
---
```

Add inside `.header-links` div, after the last `<a>` tag:

```astro
<ThemeToggle client:load />
```

- [ ] **Step 3: Verify toggle works**

Run: `npm run dev`
Expected: Clicking ☾/☀ switches theme, persists on reload.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(component): add ThemeToggle React island"
```

---

## Task 12: Search (Pagefind)

**Files:**
- Create: `src/components/interactive/Search.tsx`

- [ ] **Step 1: Create Search component**

Create `src/components/interactive/Search.tsx`:

```tsx
import { useState, useEffect, useRef } from 'react';

declare const pagefind: {
  init: () => Promise<void>;
  search: (query: string) => Promise<{ results: Array<{ data: () => Promise<{ url: string; meta: { title: string }; excerpt: string }> }> }>;
};

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ url: string; title: string; excerpt: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await pagefind.init();
        const search = await pagefind.search(query);
        const items = await Promise.all(
          search.results.slice(0, 8).map(async (r) => {
            const data = await r.data();
            return { url: data.url, title: data.meta.title, excerpt: data.excerpt };
          })
        );
        if (!cancelled) setResults(items);
      } catch {
        // pagefind not available in dev mode
      }
    })();
    return () => { cancelled = true; };
  }, [query]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--fg-disabled)',
          padding: '4px',
        }}
      >
        ⌘K
      </button>
    );
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(8, 9, 10, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '20vh',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '640px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="// search posts..."
          style={{
            width: '100%', padding: '16px 20px',
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
            color: 'var(--fg-primary)',
          }}
        />
        {results.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {results.map((r) => (
              <a
                key={r.url}
                href={r.url}
                style={{
                  display: 'block', padding: '12px 20px',
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                  color: 'var(--fg-primary)', textDecoration: 'none',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ color: 'var(--fg-primary)', marginBottom: '4px' }}>{r.title}</div>
                <div style={{ color: 'var(--fg-tertiary)', fontSize: '0.8rem' }}
                  dangerouslySetInnerHTML={{ __html: r.excerpt }}
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add Search trigger to Header**

Update `src/components/core/Header.astro` — add import:

```astro
---
import Search from '../interactive/Search.tsx';
---
```

Add `<Search client:load />` inside `.header-links`, before the ThemeToggle.

- [ ] **Step 3: Verify search renders in dev**

Run: `npm run dev`
Expected: `⌘K` button appears in header. Modal opens on click/shortcut. (Pagefind only works after build, so no results in dev — that's expected.)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(component): add Pagefind search modal"
```

---

## Task 13: Deployment Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:

```yaml
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

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "ci: add github pages deployment workflow with pagefind"
```

---

## Task 14: Final Verification

- [ ] **Step 1: Full build test**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Verify output**

Run: `ls dist/`
Expected: `index.html`, `posts/`, `about/`, `rss.xml`, `404/` all present.

- [ ] **Step 3: Verify all pages in build output**

Run: `npx astro build 2>&1 | grep -E "^(  \/|rendered)"`
Expected: See routes for `/`, `/about`, `/404`, `/posts/`, `/posts/hello-zephyr-lab/`, `/posts/essay/`, `/rss.xml`, and sitemap.

- [ ] **Step 4: Review design spec coverage**

Check against spec:
- [x] Color tokens (dark + light) — Task 3
- [x] Font system — Task 3
- [x] Header with `$ zephyr.lab` — Task 4
- [x] Hero (Prompt Line B) — Task 7
- [x] Transition Zone (Tags) — Task 7
- [x] Post List (timeline) — Task 8
- [x] Post Detail — Task 9
- [x] Code blocks (Shiki dual-theme) — Task 2 config
- [x] About page (CSDN link) — Task 10
- [x] Search (Pagefind) — Task 12
- [x] Theme toggle — Task 11
- [x] Tag click → filtered page — Task 10
- [x] RSS feed — Task 10
- [x] 404 page — Task 10
- [x] Mobile responsive — inline in components
- [x] Sitemap — Task 2 integration
- [x] KaTeX — Task 2 config
- [x] GitHub Actions deploy — Task 13
- [x] Sample post — Task 5

---

## Spec Coverage Self-Review

| Spec Section | Task | Status |
|---|---|---|
| Color system (dark + light) | Task 3 | Covered |
| Font system | Task 3 | Covered |
| Layout sizes | Task 3 | Covered |
| Header | Task 4 + 11 + 12 | Covered |
| Hero (Prompt Line) | Task 7 | Covered |
| Transition Zone | Task 7 | Covered |
| Post List | Task 8 | Covered |
| Post Detail | Task 9 | Covered |
| Code blocks (Shiki) | Task 2 config | Covered |
| Inline code | Task 3 global.css | Covered |
| Tags | Task 6 + 7 + 8 | Covered |
| Footer | Task 4 | Covered |
| About page | Task 10 | Covered |
| Search | Task 12 | Covered |
| Tag click behavior | Task 10 | Covered |
| KaTeX / Mermaid | Task 2 config | Covered (KaTeX; Mermaid deferred to follow-up) |
| Animation strategy | Architecture only | v1 minimal, no extra libs |
| Mobile responsive | Inline per component | Covered |
| SEO & Meta | Task 2 + 10 | Covered |
| RSS | Task 10 | Covered |
| Deployment | Task 13 | Covered |

**Deferred items:**
- Mermaid diagrams: requires additional rehype plugin; can add in follow-up commit
- CopyButton for code blocks: requires Shiki transformer; can add in follow-up commit
- Giscus comments: requires GitHub repo with Discussions enabled; add after deployment
- OG image generation: add as enhancement after initial deployment
- favicon.svg: create a simple SVG favicon
