// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from './src/plugins/rehype-mermaid';
import { transformerNotationHighlight } from '@shikijs/transformers';

export default defineConfig({
	site: 'https://gzb1128.github.io',
	integrations: [mdx(), sitemap(), react()],
	markdown: {
		shikiConfig: {
			themes: {
				dark: 'github-dark-default',
				light: 'github-light-default',
			},
			// `// [!code highlight]` is a *notation* (inline comment marker),
			// so it needs the notation transformer, not the meta-highlight one
			// (that handles fence-level `highlight` meta). Adds `.highlighted`
			// to matched lines so we can style them in global.css.
			transformers: [transformerNotationHighlight()],
		},
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex, rehypeMermaid],
	},
	vite: {
		plugins: [tailwindcss()],
		build: {
			rollupOptions: {
				external: ['/pagefind/pagefind.js'],
			},
		},
	},
});
