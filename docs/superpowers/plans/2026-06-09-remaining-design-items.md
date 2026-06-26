# Zephyr's Lab Remaining Design Spec Items

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete all remaining design spec items for Zephyr's Lab blog v1.

**Architecture:** Incremental additions to existing Astro components — no structural changes. Each task touches 1-3 files and produces a working build.

**Tech Stack:** Astro 6, React 19, Tailwind CSS 4 (via `@tailwindcss/vite`), Shiki (built-in), Pagefind

---

## Task 1: Post Navigation (Prev/Next)

**Files:**
- Modify: `src/pages/posts/[...slug].astro` — compute prev/next posts
- Modify: `src/layouts/PostLayout.astro` — render prev/next links

Add previous/next post navigation at the bottom of each article, above the Giscus comments.

- [ ] **Step 1: Compute prev/next in `[...slug].astro`**

In `src/pages/posts/[...slug].astro`, after rendering the post collection, compute the previous and next posts by date:

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

const allPosts = (await getCollection('posts'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());

const currentIndex = allPosts.findIndex((p) => p.id === post.id);
const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
---

<PostLayout
  title={post.data.title}
  pubDate={post.data.pubDate}
  category={post.data.category}
  description={post.data.description}
  updatedDate={post.data.updatedDate}
  prevPost={prev ? { title: prev.data.title, slug: prev.id } : undefined}
  nextPost={next ? { title: next.data.title, slug: next.id } : undefined}
>
  <Content />
</PostLayout>
```

- [ ] **Step 2: Update PostLayout Props and render navigation**

In `src/layouts/PostLayout.astro`, add prev/next props and render a navigation section between the article content and the Comments component:

Update the Props interface:

```typescript
interface Props {
  title: string;
  pubDate: Date;
  category: Category;
  description?: string;
  updatedDate?: Date;
  prevPost?: { title: string; slug: string };
  nextPost?: { title: string; slug: string };
}

const { title, pubDate, category, description, updatedDate, prevPost, nextPost } = Astro.props;
```

Add the nav HTML between the closing `</div>` of `.post-content` and `<Comments client:visible />`:

```astro
    </div>
    {prevPost || nextPost ? (
      <nav class="post-nav">
        <div class="post-nav-row">
          {prevPost ? (
            <a href={`/posts/${prevPost.slug}/`} class="post-nav-link post-nav-prev">
              <span class="post-nav-label">← prev</span>
              <span class="post-nav-title">{prevPost.title}</span>
            </a>
          ) : <div />}
          {nextPost ? (
            <a href={`/posts/${nextPost.slug}/`} class="post-nav-link post-nav-next">
              <span class="post-nav-label">next →</span>
              <span class="post-nav-title">{nextPost.title}</span>
            </a>
          ) : <div />}
        </div>
      </nav>
    ) : null}
    <Comments client:visible />
```

Add styles for `.post-nav` in the `<style>` block:

```css
.post-nav {
  margin-top: var(--space-3xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-default);
}

.post-nav-row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-lg);
}

.post-nav-link {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  text-decoration: none;
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  transition: background 200ms ease;
}

.post-nav-link:hover {
  background: var(--bg-hover);
}

.post-nav-prev { align-items: flex-start; }
.post-nav-next { align-items: flex-end; text-align: right; }

.post-nav-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--fg-disabled);
}

.post-nav-title {
  font-size: 0.9rem;
  color: var(--fg-secondary);
}

.post-nav-link:hover .post-nav-title {
  color: var(--fg-primary);
}

@media (max-width: 640px) {
  .post-nav-row {
    flex-direction: column;
  }
  .post-nav-next { align-items: flex-start; text-align: left; }
}
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: 14 pages built, 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/posts/\[...slug\].astro src/layouts/PostLayout.astro
git commit -m "feat: add prev/next post navigation to article pages"
```

---

## Task 2: Reading Time & Word Count

**Files:**
- Modify: `src/layouts/PostLayout.astro` — add reading time/word count to meta

We'll compute reading time from the slot content. Since Astro components can't easily measure the rendered slot length, we'll pass `wordCount` as a prop computed from the raw markdown content.

- [ ] **Step 1: Compute word count in `[...slug].astro`**

In `src/pages/posts/[...slug].astro`, compute word count from the rendered post body. Add after the `const { Content } = await render(post);` line:

```typescript
const rawBody = post.body || '';
const wordCount = rawBody.replace(/\s+/g, ' ').trim().split(/\s+/).length;
const readingTime = Math.max(1, Math.ceil(wordCount / 300));
```

Pass to PostLayout:

```astro
<PostLayout
  title={post.data.title}
  pubDate={post.data.pubDate}
  category={post.data.category}
  description={post.data.description}
  updatedDate={post.data.updatedDate}
  wordCount={wordCount}
  readingTime={readingTime}
  prevPost={prev ? { title: prev.data.title, slug: prev.id } : undefined}
  nextPost={next ? { title: next.data.title, slug: next.id } : undefined}
>
```

- [ ] **Step 2: Render reading time in PostLayout**

In `src/layouts/PostLayout.astro`, update Props:

```typescript
interface Props {
  title: string;
  pubDate: Date;
  category: Category;
  description?: string;
  updatedDate?: Date;
  wordCount?: number;
  readingTime?: number;
  prevPost?: { title: string; slug: string };
  nextPost?: { title: string; slug: string };
}

const { title, pubDate, category, description, updatedDate, wordCount, readingTime, prevPost, nextPost } = Astro.props;
```

In the `.post-meta` div, after the category span, add:

```astro
{wordCount != null && readingTime != null && (
  <span class="post-reading">{readingTime} min · {wordCount} words</span>
)}
```

Add style:

```css
.post-reading {
  color: var(--fg-disabled);
}
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: 14 pages built, 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/posts/\[...slug\].astro src/layouts/PostLayout.astro
git commit -m "feat: show reading time and word count on post pages"
```

---

## Task 3: Header Backdrop Light Mode Fix

**Files:**
- Modify: `src/components/core/Header.astro` — adapt backdrop for light mode

Currently the header has a hardcoded dark backdrop `rgba(8, 9, 10, 0.7)`. This needs to work in light mode too.

- [ ] **Step 1: Use CSS custom properties for header background**

In `src/components/core/Header.astro`, replace the hardcoded rgba in `.header` style:

Change:
```css
background: rgba(8, 9, 10, 0.7);
```

To:
```css
background: var(--bg-header);
```

Add the `--bg-header` token to `src/styles/tokens.css`:

In the `[data-theme="dark"]` block add:
```css
--bg-header: rgba(8, 9, 10, 0.7);
```

In the `[data-theme="light"]` block add:
```css
--bg-header: rgba(255, 255, 255, 0.7);
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: 14 pages built, 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/core/Header.astro src/styles/tokens.css
git commit -m "fix: adapt header backdrop color for light mode"
```

---

## Task 4: View Transitions

**Files:**
- Modify: `astro.config.mjs` — enable View Transitions
- Modify: `src/layouts/BaseLayout.astro` — add ViewTransition component

- [ ] **Step 1: Enable View Transitions in Astro config**

No config change needed — Astro 5+ has View Transitions built-in via the `<ViewTransitions />` component. The `transition:animate` and `transition:persist` directives work automatically.

In `src/layouts/BaseLayout.astro`, add the import and component:

After `import Footer from '../components/core/Footer.astro';` add:
```typescript
import { ViewTransitions } from 'astro:transitions';
```

Inside `<head>`, after `<meta name="generator" ... />`, add:
```astro
<ViewTransitions />
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: 14 pages built, 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: enable Astro View Transitions for page navigation"
```

---

## Task 5: Mobile Hamburger Menu

**Files:**
- Create: `src/components/interactive/MobileMenu.tsx`
- Modify: `src/components/core/Header.astro` — add hamburger button + MobileMenu

- [ ] **Step 1: Create MobileMenu.tsx**

Create `src/components/interactive/MobileMenu.tsx`:

```tsx
import { useState, useEffect, useRef } from 'react';

const NAV_ITEMS = [
  { href: '/posts', label: 'posts' },
  { href: '/about', label: 'about' },
  { href: '/rss.xml', label: 'rss' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        class="mobile-toggle"
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '16px' }}>
          <span style={{
            display: 'block', height: '1.5px', background: 'var(--fg-tertiary)',
            borderRadius: '1px', transition: 'all 200ms ease',
            transform: open ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none',
          }} />
          <span style={{
            display: 'block', height: '1.5px', background: 'var(--fg-tertiary)',
            borderRadius: '1px', transition: 'opacity 200ms ease',
            opacity: open ? 0 : 1,
          }} />
          <span style={{
            display: 'block', height: '1.5px', background: 'var(--fg-tertiary)',
            borderRadius: '1px', transition: 'all 200ms ease',
            transform: open ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none',
          }} />
        </span>
      </button>
      {open && (
        <div
          ref={navRef}
          style={{
            position: 'fixed', inset: 0, top: 'var(--header-height)',
            background: 'var(--bg-primary)', zIndex: 99,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-xl)',
            fontFamily: 'var(--font-mono)', fontSize: '1.125rem',
          }}
        >
          {NAV_ITEMS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ color: 'var(--fg-secondary)', textDecoration: 'none' }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Update Header.astro**

In `src/components/core/Header.astro`, add the import:

```typescript
import MobileMenu from '../interactive/MobileMenu.tsx';
```

Add the MobileMenu component inside `.header-links`, after `<ThemeToggle client:load />`:

```astro
      <ThemeToggle client:load />
      <MobileMenu client:load />
```

Add mobile styles to the `<style>` block:

```css
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

@media (max-width: 768px) {
  .header-links :global(a) {
    display: none;
  }
  .header-links :global(.search-wrapper) {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
}
```

Note: The Search and ThemeToggle components need to remain visible in desktop but hidden in mobile (Search via its wrapper, ThemeToggle via its own styles). The MobileMenu handles navigation in mobile. We need to wrap ThemeToggle so it's hidden on mobile too.

Actually, looking at the Header more carefully, the Search button and ThemeToggle are inline in the header-links div. We should hide all navigation links on mobile and show the hamburger instead. Let's also hide ThemeToggle on mobile (it's in the MobileMenu? No, let's keep it visible since it's small). Actually the simplest approach: hide nav `<a>` tags and Search on mobile, keep ThemeToggle, add hamburger.

Add a CSS class approach. In the Header.astro style, update:

```css
@media (max-width: 768px) {
  .header-links {
    gap: var(--space-sm);
  }
  .header-links > :global(a) {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
}
```

This hides all `<a>` direct children of `.header-links` on mobile (posts, about, rss links). Search and ThemeToggle remain visible. The hamburger opens the full-screen overlay with nav links.

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: 14 pages built, 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/interactive/MobileMenu.tsx src/components/core/Header.astro
git commit -m "feat: add mobile hamburger menu for navigation on small screens"
```

---

## Task 6: Mermaid Diagrams

**Files:**
- Modify: `astro.config.mjs` — add rehype-mermaid plugin
- Create: `src/styles/mermaid.css` — Mermaid dark/light theme overrides

- [ ] **Step 1: Install rehype-mermaid**

Run: `npm install rehype-mermaid`

Note: If `rehype-mermaid` is not compatible with the current Astro version, alternative is `remark-mermaid` or a client-side Mermaid component. Check compatibility first.

Actually, for Astro static sites the cleanest approach is to use `@astrojs/markdown-remark`'s `rehypeMermaid` from `rehype-mermaid`, or use the `mermaid` package client-side. Let's use the client-side approach since it's more reliable with Astro 6:

Create `src/components/interactive/MermaidDiagram.tsx`:

```tsx
import { useEffect, useRef } from 'react';

interface Props {
  code: string;
}

export default function MermaidDiagram({ code }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const mermaid = (await import('mermaid')).default;
      const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'default' : 'dark';
      mermaid.initialize({
        startOnLoad: false,
        theme,
        themeVariables: {
          fontFamily: 'var(--font-mono)',
          fontSize: '0.875rem',
        },
      });
      const { svg } = await mermaid.render('mermaid-' + Math.random().toString(36).slice(2), code);
      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
    })();
  }, [code]);

  return <div ref={containerRef} style={{ margin: 'var(--space-xl) 0', textAlign: 'center' }} />;
}
```

- [ ] **Step 2: Install mermaid package**

Run: `npm install mermaid`

- [ ] **Step 3: Create a rehype plugin to transform mermaid code blocks**

Create `src/utils/rehype-mermaid.ts`:

Actually, the simpler approach for MDX/MD is to use the `rehype-mermaid` package or handle it via a custom code component. Since rehype-mermaid can be tricky with Astro 6, let's use the remark/rehype approach that replaces ```mermaid blocks with the Mermaid component.

The simplest approach: use `remark-mermaid` or a custom rehype plugin. Let's go with `rehype-mermaid` which generates static SVGs at build time.

Run: `npm install rehype-mermaid`

Then in `astro.config.mjs`, add to rehypePlugins:

```js
import rehypeMermaid from 'rehype-mermaid';

// In the config:
rehypePlugins: [rehypeKatex, rehypeMermaid],
```

And add Mermaid CSS for dark/light theming in `src/styles/global.css`:

```css
@import "mermaid/dist/mermaid.css";

.mermaid svg {
  font-family: var(--font-mono);
}
```

**Note:** If `rehype-mermaid` has compatibility issues with Astro 6, fall back to client-side rendering using a custom Astro component that detects ```mermaid code blocks. The implementation plan should try `rehype-mermaid` first and fall back if needed.

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: 14 pages built, 0 errors. If rehype-mermaid fails, note the error and switch to client-side approach.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/styles/global.css package.json package-lock.json
git commit -m "feat: add Mermaid diagram support for markdown code blocks"
```

---

## Task 7: OG Image Generation

**Files:**
- Create: `src/pages/posts/[...slug]/og.png.ts` — dynamic OG image endpoint
- Modify: `src/layouts/PostLayout.astro` — add OG meta tags

- [ ] **Step 1: Install satori and sharp (sharp already installed)**

Run: `npm install satori`

- [ ] **Step 2: Create OG image endpoint**

Create `src/pages/posts/[...slug]/og.png.ts`:

```typescript
import satori from 'satori';
import { getCollection } from 'astro:content';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export async function GET({ props }: { props: { post: any } }) {
  const { post } = props;
  const fontPath = join(process.cwd(), 'node_modules/@fontsource-variable/jetbrains-mono/fonts/JetBrainsMono-Variable.woff2');
  const font = readFileSync(fontPath);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          backgroundColor: '#08090A',
          color: '#F7F8F8',
          fontFamily: 'JetBrains Mono',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontSize: '20px', color: '#5E6AD2', marginBottom: '24px' },
              children: `$ zephyr.lab`,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: '36px', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em' },
              children: post.data.title,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: '18px', color: '#8A8F98', marginTop: '20px', fontFamily: 'JetBrains Mono' },
              children: `[${post.data.category}] · ${post.data.pubDate.toISOString().split('T')[0]}`,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'JetBrains Mono', data: font, style: 'normal' }],
    }
  );

  const { Resvg } = await import('@resvg/resvg-js');
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: { 'Content-Type': 'image/png' },
  });
}
```

Wait — `@resvg/resvg-js` needs to be installed. Alternative: use sharp to convert SVG to PNG since it's already installed.

```typescript
import sharp from 'sharp';

// ... after satori generates SVG:
const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
```

- [ ] **Step 3: Add OG meta tags to PostLayout**

In `src/layouts/PostLayout.astro`, inside the `<head>` section of BaseLayout (we need to pass through og:image). Since BaseLayout handles `<head>`, we need to add a slot or modify BaseLayout to accept og:image.

Simpler approach: add a `<head>` slot in BaseLayout. In `src/layouts/BaseLayout.astro`, add `<slot name="head" />` inside `<head>`:

After `<meta name="generator" ... />` and `<ViewTransitions />`, add:
```astro
<slot name="head" />
```

Then in `src/layouts/PostLayout.astro`, pass the OG image:

```astro
<BaseLayout title={`${title} — Zephyr's Lab`} description={description}>
  <Fragment slot="head">
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description || ''} />
    <meta property="og:type" content="article" />
    <meta property="og:image" content={`/posts/${ Astro.params.slug }/og.png`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:image" content={`/posts/${ Astro.params.slug }/og.png`} />
  </Fragment>
```

Wait — `Astro.params.slug` is available in the page, not the layout. We need to pass the slug as a prop too.

Update PostLayout Props to include `slug?: string` and pass it from `[...slug].astro`.

In `src/pages/posts/[...slug].astro`, add `slug={post.id}` to the PostLayout props.

In PostLayout:
```astro
const { title, pubDate, category, description, updatedDate, wordCount, readingTime, prevPost, nextPost, slug } = Astro.props;
```

And the OG meta:
```astro
<Fragment slot="head">
  {slug && (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || ''} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={`/posts/${slug}/og.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={`/posts/${slug}/og.png`} />
    </>
  )}
</Fragment>
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: Pages built with OG images, 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/pages/posts/\[...slug\]/og.png.ts src/layouts/PostLayout.astro src/layouts/BaseLayout.astro src/pages/posts/\[...slug\].astro package.json package-lock.json
git commit -m "feat: generate OG images for social sharing on post pages"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| Post prev/next nav (§5) | Task 1 |
| Reading time + word count (§5) | Task 2 |
| Header backdrop light mode (§1) | Task 3 |
| View Transitions (§Animation v1) | Task 4 |
| Mobile hamburger menu (§Responsive) | Task 5 |
| Mermaid diagrams (§13) | Task 6 |
| OG image generation (§SEO) | Task 7 |
| ~~macOS traffic-light dots~~ | Removed per user decision (2026-06-26) |
| Code block language label | Already implemented (`pre[data-language]::after`) |
| Code block line numbers | Already implemented (CSS counter) |
| Code block copy button | Already implemented (BaseLayout inline script) |
| Code block 12px radius | Already implemented (`--radius-lg`) |
| Inline code style | Already implemented (`code` in global.css) |
| Mobile tag horizontal scroll | Already implemented (TagList.astro) |
| Mobile post list stacking | Already implemented (PostList.astro) |
| Code block line highlight (`// [!code highlight]`) (§6) | Done (2026-06-26) — `transformerMetaHighlight` + `.line.highlighted` style |
| Light mode tag contrast (§3 known issue) | Done (2026-06-26) — darkened syntax tokens in `[data-theme="light"]` |
