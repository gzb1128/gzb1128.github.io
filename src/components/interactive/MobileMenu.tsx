import { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../../data/nav';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: 'var(--fg-tertiary)',
        }}
        className="mobile-toggle"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          {open ? (
            <>
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </>
          ) : (
            <>
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 150,
            background: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--space-xl) var(--space-lg)',
            gap: 'var(--space-lg)',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.125rem',
          }}
        >
          {NAV_ITEMS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                color: 'var(--fg-tertiary)',
                textDecoration: 'none',
                padding: 'var(--space-sm) 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
