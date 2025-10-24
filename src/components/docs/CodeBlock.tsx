'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  raw?: string;
}

export default function CodeBlock({ children, language, raw }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = raw || (children as any)?.props?.children || '';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6">
      {/* Language label */}
      {language && (
        <div className="absolute -top-3 left-4 z-10">
          <span className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm text-white text-xs font-mono px-3 py-1 rounded-full border border-white/10">
            {language}
          </span>
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 p-2"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-gray-300" />
        )}
      </button>

      {/* Code content */}
      <pre className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 overflow-x-auto border border-gray-800/50 shadow-xl">
        <code className="text-sm font-mono">{children}</code>
      </pre>
    </div>
  );
}
