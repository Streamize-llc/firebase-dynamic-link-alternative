'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';

export default function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-black/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center px-8 max-w-screen-2xl mx-auto">
        <div className="mr-12 flex">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold text-white tracking-tight font-space-grotesk">DEPL</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-8 text-sm font-medium">
            <Link
              href="/docs"
              className="text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-white"
            >
              Documentation
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <a
              href="https://github.com/yourusername/depl"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all hover:bg-gray-800/50 h-9 px-4 gap-2"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
