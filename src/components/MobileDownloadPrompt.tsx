import React, { useState } from 'react';
import { Download, Smartphone, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileDownloadPromptProps {
  onOpenInstallModal: () => void;
}

export const MobileDownloadPrompt: React.FC<MobileDownloadPromptProps> = ({
  onOpenInstallModal,
}) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('mukami_install_banner_dismissed') === 'true';
  });

  if (isInstalled || dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    sessionStorage.setItem('mukami_install_banner_dismissed', 'true');
  };

  const handleAction = async () => {
    if (isInstallable) {
      const res = await install();
      if (!res) {
        onOpenInstallModal();
      }
    } else {
      onOpenInstallModal();
    }
  };

  return (
    <aside 
      aria-label="Download Mobile App"
      className="lg:hidden fixed top-18 inset-x-3 z-30 animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
    >
      <div 
        onClick={handleAction}
        className="bg-zinc-950/90 hover:bg-zinc-900/95 border border-amber-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 p-1 flex items-center justify-center shrink-0">
            <img src="/icon.svg" alt="App" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white font-display truncate">
                Mukami Studio App
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-amber-400 text-black rounded">
                FREE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
              Download to your phone for instant offline access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
            className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
