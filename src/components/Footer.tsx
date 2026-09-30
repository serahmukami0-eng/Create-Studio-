import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-zinc-800 bg-[#090A0F] py-12 mt-16 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-sm font-bold text-white font-display">
            Mukami Creative Studio
          </div>
          <div className="text-zinc-500">
            Business Information Technology & Digital Artistry · Nairobi, Kenya & Worldwide
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-5 text-zinc-400">
          <button
            onClick={() => onSelectTab('roadmap')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            30-Day Plan
          </button>
          <button
            onClick={() => onSelectTab('business-hub')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Business Flyers
          </button>
          <button
            onClick={() => onSelectTab('pricing')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            onClick={() => onSelectTab('commissions')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Pipeline
          </button>
          <button
            onClick={() => onSelectTab('monetization')}
            className="hover:text-amber-400 transition-colors cursor-pointer font-semibold"
          >
            Monetization (Pro)
          </button>
          <button
            onClick={() => onSelectTab('app-store')}
            className="hover:text-emerald-400 transition-colors cursor-pointer font-semibold"
          >
            Play Store & App
          </button>
          <button
            onClick={() => onSelectTab('about')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About Studio
          </button>
        </nav>

        <div className="text-zinc-500 text-[11px] text-center sm:text-right">
          © {new Date().getFullYear()} Mukami Creative Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
