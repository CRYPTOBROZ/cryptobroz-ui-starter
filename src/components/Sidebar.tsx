'use client';

import { Home, Send, Wallet, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/portfolio', label: 'Portfolio', icon: Wallet },
    { href: '/send', label: 'Send', icon: Send },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 z-[60] lg:z-0
          h-screen w-64
          bg-neutral shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Sidebar Header - Mobile Only */}
        <div className="p-4 border-b border-base-300 lg:hidden">
          <div className="flex items-center justify-end">
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-square" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 lg:pt-6">
          <ul className="menu menu-lg gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 rounded-lg
                      ${isActive ? 'active bg-white text-black' : 'hover:bg-base-200'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-inter font-semibold">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-base-300">
          <div className="text-xs text-base-content/50 font-inter text-center">CryptoBroz &copy; 2024</div>
        </div>
      </div>
    </>
  );
}
