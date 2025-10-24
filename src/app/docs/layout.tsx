import DocsHeader from '@/components/docs/DocsHeader';
import DocsSidebar from '@/components/docs/DocsSidebar';
import TableOfContents from '@/components/docs/TableOfContents';
import type { ReactNode } from 'react';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <DocsHeader />

      <div className="flex relative z-10">
        <DocsSidebar />

        {/* Main content */}
        <main className="flex-1 ml-72 px-16 py-16 xl:mr-80">
          <div className="max-w-5xl">
            <article className="prose prose-invert max-w-none">
              {children}
            </article>
          </div>
        </main>

        <TableOfContents />
      </div>
    </div>
  );
}
