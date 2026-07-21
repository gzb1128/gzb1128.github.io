import { useEffect, useState } from 'react';
import Giscus from '@giscus/react';

interface Props {
  legacyPath?: string;
}

export default function Comments({ legacyPath }: Props) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document === 'undefined') return 'dark';
    const v = document.documentElement.getAttribute('data-theme');
    return v === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const value = document.documentElement.getAttribute('data-theme');
      if (value === 'dark' || value === 'light') {
        setTheme(value);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        marginTop: 'var(--space-3xl)',
        paddingTop: 'var(--space-xl)',
        borderTop: '1px solid var(--border-default)',
      }}
    >
      <Giscus
        repo="gzb1128/gzb1128.github.io"
        repoId="R_kgDOS0Lakg"
        category="Announcements"
        categoryId="DIC_kwDOS0Laks4C-0qf"
        mapping={legacyPath ? 'specific' : 'pathname'}
        term={legacyPath}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'dark' ? 'dark_tritanopia' : 'light'}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
