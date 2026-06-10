import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeMermaid() {
	return (tree: Root) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'pre' || !parent || index == null) return;

			const code = node.children.find(
				(child) =>
					child.type === 'element' &&
					child.tagName === 'code' &&
					child.properties?.className &&
					Array.isArray(child.properties.className) &&
					child.properties.className.includes('language-mermaid'),
			);

			if (!code || code.type !== 'element') return;

			const text = code.children
				.filter((child) => child.type === 'text')
				.map((child) => (child as { value: string }).value)
				.join('');

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
