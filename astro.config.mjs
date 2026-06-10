// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from './src/plugins/rehype-mermaid';

export default defineConfig({
	site: 'https://gzb1128.github.io',
	integrations: [mdx(), sitemap(), react()],
	markdown: {
		shikiConfig: {
			themes: {
				dark: 'github-dark-default',
				light: 'github-light-default',
			},
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
