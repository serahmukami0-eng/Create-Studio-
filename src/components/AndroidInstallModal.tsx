import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Check,
  X,
  ShieldCheck,
  Zap,
  Share2,
  Apple,
  ExternalLink,
  Sparkles,
  ArrowRight,
  HardDriveDownload,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [selectedPlatform, setSelectedPlatform] = useState<'auto' | 'android' | 'ios' | 'package'>('auto');

  if (!isOpen) return null;

  // Resolved platform view
  const currentView =
    selectedPlatform === 'auto'
      ? isIOS
        ? 'ios'
        : 'android'
      : selectedPlatform;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  const handleDownloadOfflineHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Mukami Creative Studio Mobile App</title>
  <meta name="theme-color" content="#090A0F">
  <style>
    body { margin: 0; background: #090A0F; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 24px; box-sizing: border-box; }
    .card { background: #12131C; border: 1px solid #27272A; padding: 32px 24px; border-radius: 24px; max-width: 400px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    h1 { color: #F59E0B; margin: 0 0 8px 0; font-size: 24px; }
    p { color: #A1A1AA; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0; }
    .btn { display: block; background: #F59E0B; color: #000; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-weight: 700; font-size: 15px; margin-bottom: 12px; }
    .footer { font-size: 11px; color: #71717A; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 48px; margin-bottom: 12px;">🎨</div>
    <h1>Mukami Studio App</h1>
    <p>Saved offline package. Tap below to launch your complete studio hub, 30-day roadmap, and pricing engine.</p>
    <a href="${window.location.origin}" class="btn">Open Mukami Creative Studio</a>
    <div class="footer">Mukami Serah · BIT & Digital Design · Kenya / Global</div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mukami_Creative_Studio_App.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-zinc-950 border border-zinc-800 p-2 flex items-center justify-center shrink-0 shadow-inner">
              <img
                src="/icon.svg"
                alt="Mukami Studio Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  Download Mobile App
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-400/15 border border-amber-400/30 text-amber-400 rounded-md">
                  Any Phone
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Install as a full-screen app on Android, iPhone, or iPad
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedPlatform('android')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'android'
                ? 'bg-amber-400 text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('ios')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'ios'
                ? 'bg-amber-400 text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iPhone / iOS</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('package')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'package'
                ? 'bg-amber-400 text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Save Offline</span>
          </button>
        </div>

        {/* Main Content Area by Platform */}
        {currentView === 'android' && (
          <div className="space-y-4">
            {/* If 1-click install prompt is supported */}
            {isInstallable ? (
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-400/20 active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download & Install to Android (1-Tap)</span>
                </button>
                <p className="text-[11px] text-center text-zinc-400">
                  Adds the official WebAPK directly to your Android home screen and app launcher.
                </p>
              </div>
            ) : isInstalled ? (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-center space-y-1">
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>App Already Installed on this Device</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  You are currently using the installed standalone mobile app.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3 text-xs">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-extrabold flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>How to Install on Any Android Phone (Chrome / Samsung):</span>
                </div>
                <ol className="space-y-2 text-zinc-300 text-xs leading-relaxed pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>
                      In your mobile browser, tap the <strong className="text-white">three dots menu (⋮)</strong> at top-right.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>
                      Tap <strong className="text-amber-400">"Install app"</strong> or <strong className="text-amber-400">"Add to Home screen"</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>
                      Tap <strong className="text-white">"Install"</strong> to confirm. The app icon appears on your home screen and operates full-screen with offline support!
                    </span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}

        {currentView === 'ios' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3.5">
              <div className="font-bold text-white flex items-center gap-2">
                <Apple className="w-4 h-4 text-amber-400" />
                <span>How to Install on iPhone / iPad (Safari):</span>
              </div>
              <div className="space-y-3 text-zinc-300 text-xs leading-relaxed">
                <div className="flex items-start gap-3 p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                  <span className="text-sm font-bold text-amber-400 px-2 py-0.5 bg-amber-400/10 rounded-md">
                    1
                  </span>
                  <div>
                    Open this page in <strong>Safari</strong> on your iPhone, then tap the{' '}
                    <strong className="text-white">Share button</strong> (the square with an arrow pointing up at the bottom).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                  <span className="text-sm font-bold text-amber-400 px-2 py-0.5 bg-amber-400/10 rounded-md">
                    2
                  </span>
                  <div>
                    Scroll down the options list and tap{' '}
                    <strong className="text-amber-400">"Add to Home Screen"</strong> (+ icon).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                  <span className="text-sm font-bold text-amber-400 px-2 py-0.5 bg-amber-400/10 rounded-md">
                    3
                  </span>
                  <div>
                    Tap <strong className="text-white">"Add"</strong> in the top-right corner. Mukami Studio will launch like a native iOS app with full-screen dark background!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'package' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
              <div className="font-bold text-white flex items-center gap-2">
                <HardDriveDownload className="w-4 h-4 text-cyan-400" />
                <span>Download Standalone Offline App File</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Download a self-contained mobile web application file straight into your phone's <strong>Downloads</strong> folder. Open it anytime without requiring an internet connection.
              </p>
              <button
                onClick={handleDownloadOfflineHTML}
                className="w-full py-3 px-4 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download App File (.html)</span>
              </button>
            </div>
          </div>
        )}

        {/* Feature Highlights for Mobile */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/60 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-zinc-300 text-[11px] font-medium">Instant 0-Lag Launch</span>
          </div>
          <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/60 flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-zinc-300 text-[11px] font-medium">Native WhatsApp Share</span>
          </div>
        </div>

        {/* Close action */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer text-center"
          >
            Continue in Browser
          </button>
        </div>
      </div>
    </div>
  );
};

