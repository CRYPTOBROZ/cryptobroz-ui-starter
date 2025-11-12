'use client';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-neutral shadow-lg border-t border-primary/20 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="text-xs font-inter text-base-content/50">Built with Next.js + Wagmi + RainbowKit</div>

        {/* Theme Switcher */}
        <div className="theme-switcher">
          <input type="radio" name="theme" id="theme-dark" className="theme-radio" defaultChecked />
          <input type="radio" name="theme" id="theme-light" className="theme-radio" />
          <div className="flex gap-1 bg-base-300 p-1 rounded-lg shadow-sm">
            <label
              htmlFor="theme-dark"
              className="btn btn-xs font-inter cursor-pointer border-0 bg-transparent hover:bg-primary/20 dark-label"
            >
              🌙
            </label>
            <label
              htmlFor="theme-light"
              className="btn btn-xs font-inter cursor-pointer border-0 bg-transparent hover:bg-primary/20 light-label"
            >
              ☀️
            </label>
          </div>
        </div>
      </div>
    </footer>
  );
}
