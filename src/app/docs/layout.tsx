import DocsHeader from '@/components/docs/DocsHeader';
import DocsSidebar from '@/components/docs/DocsSidebar';
import TableOfContents from '@/components/docs/TableOfContents';
import type { ReactNode } from 'react';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <DocsHeader />

      <div className="flex">
        <DocsSidebar />

        {/* Main content */}
        <main className="flex-1 ml-64 px-12 py-8">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-invert prose-lg max-w-none">
              {children}
            </article>
          </div>
        </main>

        <TableOfContents />
      </div>
    </div>
  );
}
