import { useState, useEffect, useRef } from 'react';

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
        // @ts-expect-error pagefind is loaded at runtime
        const pagefind = await import('/pagefind/pagefind.js');
        await pagefind.init();
        const search = await pagefind.search(query);
        const items = await Promise.all(
          search.results.slice(0, 8).map(async (r: any) => {
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
