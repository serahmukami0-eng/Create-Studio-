import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, Crown } from 'lucide-react';
import { Currency, UserSubscription } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  currency: Currency;
  onToggleCurrency: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAndroidInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onToggleCurrency,
  activeTab,
  onSelectTab,
  onOpenAndroidInstall,
}) => {
  const { isInstalled, isInstallable } = usePWAInstall();
  const [subPlan, setSubPlan] = useState<string>('free');

  useEffect(() => {
    const checkSub = () => {
      const saved = localStorage.getItem('mukami_user_subscription');
      if (saved) {
        try {
          const parsed: UserSubscription = JSON.parse(saved);
          setSubPlan(parsed.plan);
        } catch (e) {}
      }
    };
    checkSub();
    window.addEventListener('storage', checkSub);
    return () => window.removeEventListener('storage', checkSub);
  }, []);

  const navItems = [
    { id: 'roadmap', label: '30-Day Plan' },
    { id: 'business-hub', label: 'Business Flyers' },
    { id: 'pricing', label: 'Pricing Calculator' },
    { id: 'commissions', label: 'Client Pipeline' },
    { id: 'portfolio', label: 'Gallery' },
    { id: 'monetization', label: 'Monetization' },
    { id: 'app-store', label: 'Play Store App' },
    { id: 'about', label: 'About Studio' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090A0F]/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('roadmap');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-white font-display whitespace-nowrap hover:text-amber-400 transition-colors flex items-center gap-2"
          >
            <img src="/icon.svg" alt="App Icon" className="w-6 h-6 object-contain" />
            <span>Mukami Studio</span>
          </a>

          {/* Membership Badge */}
          <button
            onClick={() => onSelectTab('monetization')}
            className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
              subPlan === 'premium'
                ? 'bg-amber-400 text-black shadow-sm'
                : subPlan.includes('business')
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
            }`}
            title="View Subscription & Monetization"
          >
            {subPlan === 'premium' ? (
              <>
                <Crown className="w-3 h-3 text-black" />
                <span>PRO</span>
              </>
            ) : subPlan.includes('business') ? (
              <>
                <Crown className="w-3 h-3 text-black" />
                <span>VIP</span>
              </>
            ) : (
              <span>FREE</span>
            )}
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-zinc-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`transition-colors whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === item.id
                  ? 'text-amber-400 font-bold border-b-2 border-amber-400 py-1'
                  : 'hover:text-white py-1 text-zinc-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {/* Play Store App Launchpad Button */}
          <button
            onClick={() => onSelectTab('app-store')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 cursor-pointer"
            title="Open Google Play Store Launchpad"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Play Store</span>
          </button>

          {/* Universal Mobile Download App Button */}
          <button
            onClick={onOpenAndroidInstall}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isInstalled
                ? 'bg-zinc-900 border-emerald-800 text-emerald-400'
                : 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/30 text-amber-400 hover:text-amber-300'
            }`}
            title="Download & Install Studio App to your phone"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{isInstalled ? 'App Active' : 'Download App'}</span>
            <span className="xs:hidden">{isInstalled ? 'Active' : 'Download'}</span>
          </button>

          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-500 hover:text-white transition-colors cursor-pointer"
            title="Toggle between Kenyan Shillings (KSh) and US Dollars ($)"
          >
            <span className={currency === 'KSH' ? 'text-amber-400 font-bold' : 'text-zinc-400'}>
              KSh
            </span>
            <span className="text-zinc-600">/</span>
            <span className={currency === 'USD' ? 'text-amber-400 font-bold' : 'text-zinc-400'}>
              USD
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2.5 bg-zinc-950 border-t border-zinc-800/80 text-xs no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors cursor-pointer ${
              activeTab === item.id
                ? 'bg-amber-400 text-black font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
