'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu } from 'lucide-react';
import Link from 'next/link';

interface CryptoNavProps {
  onMenuClick?: () => void;
}

export function CryptoNav({ onMenuClick }: CryptoNavProps) {
  return (
    <div className="navbar bg-neutral shadow-lg sticky top-0 z-50 min-h-14">
      {/* Hamburger Menu - Mobile Only */}
      <div className="navbar-start flex-none gap-3">
        <button onClick={onMenuClick} className="lg:hidden btn btn-ghost btn-square" aria-label="Toggle menu">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="cursor-pointer">
          <img
            src="/logo.png"
            alt="CryptoBroz"
            className="w-48 h-auto"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </Link>
      </div>

      <div className="navbar-end flex-none gap-2 md:gap-3 whitespace-nowrap items-center">
        <div className="flex items-center h-10">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
