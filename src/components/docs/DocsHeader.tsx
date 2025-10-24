'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/70 backdrop-blur-2xl">
      <div className="max-w-[1800px] mx-auto flex h-16 items-center px-8">
        <Link href="/" className="mr-8 group">
          <span className="text-xl font-bold text-white tracking-tight font-space-grotesk">
            DEPL
          </span>
        </Link>

        <nav className="flex items-center gap-1 mr-auto">
          <Link
            href="/docs"
            className="px-4 py-2 text-sm text-white font-medium rounded-lg bg-white/5"
          >
            Documentation
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            Dashboard
          </Link>
        </nav>

        <Button
          size="sm"
          className="bg-white text-black hover:bg-gray-200 font-medium"
          asChild
        >
          <Link href="/dashboard">
            Get Started
          </Link>
        </Button>
      </div>
    </header>
  );
}
