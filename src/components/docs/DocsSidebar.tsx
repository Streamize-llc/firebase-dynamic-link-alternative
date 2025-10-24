'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Shield, Link as LinkIcon } from 'lucide-react';

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
      { title: 'Introduction', href: '/docs', icon: FileText },
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
    <aside className="fixed top-16 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-gray-800/50 overflow-y-auto bg-black/40">
      <div className="py-8 px-6">
        <nav className="space-y-8">
          {navigation.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest px-3">
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
                        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-2 border-blue-500'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
                      `}
                    >
                      {Icon && <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`} />}
                      {item.title}
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
