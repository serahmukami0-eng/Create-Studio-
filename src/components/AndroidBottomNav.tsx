import React from 'react';
import {
  Calendar,
  Calculator,
  Layers,
  ShoppingBag,
  Crown,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAndroidInstall: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAndroidInstall,
}) => {
  const { isInstalled, isInstallable } = usePWAInstall();

  const navItems = [
    { id: 'roadmap', label: 'Roadmap', icon: Calendar },
    { id: 'business-hub', label: 'Flyers', icon: ShoppingBag },
    { id: 'pricing', label: 'Pricing', icon: Calculator },
    { id: 'commissions', label: 'Pipeline', icon: Layers },
    { id: 'monetization', label: 'Pro', icon: Crown },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#090A0F]/95 backdrop-blur-lg border-t border-zinc-800 pb-[env(safe-area-inset-bottom)] select-none">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
                isActive ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-0.5 w-8 h-1 bg-amber-400 rounded-full" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              />
              <span
                className={`text-[10px] mt-1 tracking-tight truncate max-w-[62px] ${
                  isActive ? 'font-bold text-white' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Optional quick install button if not installed */}
        {!isInstalled && (
          <button
            onClick={onOpenAndroidInstall}
            className="flex-1 flex flex-col items-center justify-center py-1 text-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            title="Download & Install Mobile App"
          >
            <div className="relative">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="text-[10px] font-bold mt-1 tracking-tight text-amber-400">Download</span>
          </button>
        )}
      </div>
    </div>
  );
};
