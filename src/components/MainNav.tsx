'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/send', label: 'Send' },
    { href: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-base-200 shadow-sm">
      <div className="navbar-start flex items-center gap-3 px-4 py-2 overflow-x-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                px-5 py-2 rounded-full font-inter font-semibold text-xs uppercase tracking-wider
                transition-all whitespace-nowrap flex-shrink-0
                ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'bg-base-300/50 text-base-content/80 hover:bg-base-300 hover:text-base-content hover:shadow-md'
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
