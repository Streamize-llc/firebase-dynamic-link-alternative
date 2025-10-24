'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('article h2, article h3'))
      .map((elem) => ({
        id: elem.id,
        text: elem.textContent || '',
        level: Number(elem.tagName.charAt(1)),
      }));
    setHeadings(elements);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    elements.forEach((heading) => {
      const elem = document.getElementById(heading.id);
      if (elem) observer.observe(elem);
    });

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="fixed right-12 top-32 hidden xl:block w-64">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em] mb-4">
          On This Page
        </p>
        <nav className="space-y-2">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`
                block text-[13px] transition-all duration-200 py-1.5 px-3 rounded-lg
                ${heading.level === 3 ? 'pl-6' : ''}
                ${
                  activeId === heading.id
                    ? 'text-white font-medium bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
