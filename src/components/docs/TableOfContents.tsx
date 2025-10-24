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
    <div className="fixed right-8 top-28 hidden xl:block w-56">
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
          On This Page
        </p>
        <nav className="space-y-2 border-l-2 border-gray-800">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`
                block text-sm transition-all pl-4 py-1 border-l-2 -ml-[2px]
                ${heading.level === 3 ? 'pl-6 text-xs' : ''}
                ${
                  activeId === heading.id
                    ? 'text-white font-medium border-blue-500'
                    : 'text-gray-400 hover:text-gray-300 border-transparent hover:border-gray-600'
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
