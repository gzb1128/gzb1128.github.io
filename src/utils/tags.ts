export type Category = 'ai-agent' | 'cloud-native' | 'algorithm' | 'cryptography' | 'essay' | 'network' | 'systems';

const TAG_COLORS: Record<Category, string> = {
  'ai-agent': 'var(--syntax-string)',
  'cloud-native': 'var(--syntax-keyword)',
  'algorithm': 'var(--syntax-number)',
  'cryptography': 'var(--syntax-fn)',
  'essay': 'var(--syntax-comment)',
  'network': 'var(--syntax-fn)',
  'systems': 'var(--syntax-number)',
};

export function getTagColor(tag: Category): string {
  return TAG_COLORS[tag] || 'var(--fg-tertiary)';
}

export const ALL_CATEGORIES: Category[] = [
  'ai-agent',
  'cloud-native',
  'network',
  'systems',
  'algorithm',
  'cryptography',
  'essay',
];
