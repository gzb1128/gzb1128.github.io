import type { Root, Element, Text } from 'hast';
import { visit } from 'unist-util-visit';

// Extract the raw text of a Shiki-highlighted <code> block.
// Astro runs Shiki *before* rehype plugins, so by the time we see a fenced
// code block it is already <pre data-language="..."><code><span class="line">...
// We rebuild the original source by concatenating every text node.
function codeText(code: Element): string {
	const out: string[] = [];
	const walk = (node: Element | Text) => {
		if (node.type === 'text') {
			out.push((node as Text).value);
			return;
		}
		for (const child of (node as Element).children ?? []) {
			walk(child as Element | Text);
		}
	};
	walk(code);
	return out.join('');
}

export default function rehypeMermaid() {
	return (tree: Root) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'pre' || !parent || index == null) return;

			// Shiki stores the language on <pre> as data-language (hast: dataLanguage).
			const lang = node.properties?.dataLanguage ?? node.properties?.['data-language'];
			if (lang !== 'mermaid') return;

			const code = node.children.find(
				(child) => child.type === 'element' && child.tagName === 'code',
			) as Element | undefined;
			if (!code) return;

			const text = codeText(code);

			parent.children[index] = {
				type: 'element',
				tagName: 'figure',
				properties: { className: ['mermaid-figure'] },
				children: [
					{
						type: 'element',
						tagName: 'pre',
						properties: { className: ['mermaid'] },
						children: [{ type: 'text', value: text }],
					},
				],
			};
		});
	};
}
