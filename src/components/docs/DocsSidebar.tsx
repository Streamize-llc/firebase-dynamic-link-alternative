'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Shield, Link as LinkIcon, Home } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs', icon: Home },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Authentication', href: '/docs/authentication', icon: Shield },
      { title: 'Deep Links', href: '/docs/deeplinks', icon: LinkIcon },
    ],
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-16 z-30 h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-white/5 overflow-y-auto bg-transparent">
      <div className="py-10 px-6">
        <nav className="space-y-10">
          {navigation.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em] px-3">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        relative flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200 group
                        ${
                          isActive
                            ? 'bg-white/5 text-white shadow-lg border border-white/10'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl" />
                      )}
                      {Icon && (
                        <Icon
                          className={`h-[18px] w-[18px] relative z-10 ${
                            isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'
                          }`}
                        />
                      )}
                      <span className="relative z-10">{item.title}</span>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
