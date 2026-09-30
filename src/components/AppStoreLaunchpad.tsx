import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Code2,
  ExternalLink,
  Layers,
  Sparkles,
  Apple,
  FileText,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AppStoreLaunchpadProps {
  onOpenInstallModal: () => void;
}

export const AppStoreLaunchpad: React.FC<AppStoreLaunchpadProps> = ({
  onOpenInstallModal,
}) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'play-store' | 'app-store' | 'packaging'>('play-store');

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const bubblewrapCommand = `# 1. Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize project from current web manifest
bubblewrap init --manifest=${window.location.origin}/manifest.json

# 3. Build signed Android App Bundle (.aab) ready for Google Play
bubblewrap build

# Result: app-release-bundle.aab (Upload directly to Google Play Console!)`;

  const assetLinksJson = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.mukamistudio.app",
      "sha256_cert_fingerprints": [
        "14:6D:E9:7F:0F:25:CF:EA:CE:2F:9E:04:A2:97:94:71:B8:31:02:61:3F:B4:73:76:70:E3:43:F1:C0:2D:0C:5D"
      ]
    }
  }
]`;

  const fullDescription = `Mukami Creative Studio is Kenya's premier digital art, client commission management, and commercial business design platform. 

Created by Mukami Serah, the app bridges Business Information Technology (BIT) with high-impact digital art, empowering artists, restaurants, salons, fashion boutiques, and event organizers to create and monetize professional visual collateral.

🌟 KEY FEATURES:
• 30-Day Step-by-Step Art Business Roadmap
• Dual Currency (KSh & USD) Pricing Calculator for Kenya and Global clients
• Client Pipeline & 50% Deposit Security Milestones
• Watermarked Draft Review Protection Simulator
• Business Flyer & Poster Design Hub for Nairobi Cafes, Salons & Boutiques
• AI Artistic Concept Studio & Client WhatsApp Pitch Generator
• Instant CSV Financial & Commission Ledger Backup

💼 DESIGN PACKAGES FOR LOCAL BUSINESSES:
- Restaurant brunch menus & daily special flyers
- Salon & spa service price boards
- Boutique new collection drops & clearance posters
- Nightclub, DJ & Church event announcements
- Tech startup pitch deck branding & LinkedIn banners

🔒 SECURE PAYMENT INTEGRATION:
Supports Safaricom M-Pesa (Buy Goods Till & Pochi la Biashara) and USD payment gateways. 

Download today to launch, manage, and scale your digital design business!`;

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
          <span>Official Distribution Kit</span>
          <span className="text-zinc-600">·</span>
          <span>Google Play & Apple App Store</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Play Store & App Store Launchpad
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              Everything required to package, sign, and publish Mukami Creative Studio as an official Android App Bundle (.aab) on Google Play and an iOS app on Apple App Store.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={onOpenInstallModal}
              className="px-4 py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install to Device</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Badges Card */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 p-2 shrink-0 shadow-inner flex items-center justify-center">
            <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white font-display">Mukami Creative Studio</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded">
                v1.2.0 Production Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Package: <code className="text-amber-400">com.mukamistudio.app</code> · Target SDK 34 (Android 14) & iOS 17
            </p>
          </div>
        </div>

        {/* Store Download Mockup Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Google Play Button */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-3 px-4 py-2.5 bg-black hover:bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-xl transition-all cursor-pointer shadow-md group"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white">
                <path d="M3.609 1.814L13.793 12 3.61 22.186c-.305-.203-.497-.552-.497-.946V2.76c0-.394.192-.743.496-.946z" fill="#4285F4"/>
                <path d="M17.155 8.638L4.35 1.34c-.234-.133-.5-.187-.741-.126l10.184 10.785 3.362-3.361z" fill="#EA4335"/>
                <path d="M17.155 15.362l-3.362-3.362L3.609 22.785c.241.061.507.007.741-.126l12.805-7.297z" fill="#34A853"/>
                <path d="M21.144 10.916l-3.989-2.278-3.362 3.362 3.362 3.362 3.989-2.278c.856-.489.856-1.679 0-2.168z" fill="#FBBC05"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">GET IT ON</div>
              <div className="text-xs font-bold text-white leading-tight font-display">Google Play</div>
            </div>
          </button>

          {/* Apple App Store Button */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-3 px-4 py-2.5 bg-black hover:bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-xl transition-all cursor-pointer shadow-md group"
          >
            <Apple className="w-6 h-6 text-white" />
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">Download on the</div>
              <div className="text-xs font-bold text-white leading-tight font-display">App Store</div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('play-store')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'play-store'
              ? 'bg-amber-400 text-black shadow-sm font-bold'
              : 'text-zinc-400 hover:text-white bg-zinc-900'
          }`}
        >
          Google Play Store Listing Kit
        </button>
        <button
          onClick={() => setActiveTab('packaging')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'packaging'
              ? 'bg-amber-400 text-black shadow-sm font-bold'
              : 'text-zinc-400 hover:text-white bg-zinc-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Build .aab (Bubblewrap CLI)</span>
        </button>
        <button
          onClick={() => setActiveTab('app-store')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'app-store'
              ? 'bg-amber-400 text-black shadow-sm font-bold'
              : 'text-zinc-400 hover:text-white bg-zinc-900'
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>Apple App Store iOS Guide</span>
        </button>
      </div>

      {/* Tab 1: Google Play Store Production Listing Kit */}
      {activeTab === 'play-store' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: App Title & Short Description */}
            <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  App Name & Short Description
                </span>
                <button
                  onClick={() => handleCopy('title', 'Mukami Creative Studio: Digital Art & Business Designs')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'title' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400">App Name (up to 50 chars):</label>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs text-white">
                  Mukami Creative Studio: Digital Art & Business Designs
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
                  <span>Short Description (max 80 chars):</span>
                  <span className="font-mono text-zinc-500">77 / 80 chars</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-200">
                  Digital art commissions, restaurant flyers & business branding made easy in Kenya.
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800/80 text-xs">
                <span className="font-semibold text-zinc-300">Google Play Store Categorization:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 font-mono text-[11px]">
                    Category: Art & Design
                  </span>
                  <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 font-mono text-[11px]">
                    Content Rating: PEGI 3 (Everyone)
                  </span>
                  <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 font-mono text-[11px]">
                    Target Age: 13+ (Teens & Adults)
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Full ASO Store Description */}
            <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    Full Description (ASO Keyword-Optimized)
                  </span>
                  <button
                    onClick={() => handleCopy('desc', fullDescription)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'desc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 max-h-60 overflow-y-auto whitespace-pre-line leading-relaxed font-sans">
                  {fullDescription}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Optimized for Kenya, East Africa & Global creatives</span>
                <span className="text-emerald-400 font-semibold">100% Policy Compliant</span>
              </div>
            </div>
          </div>

          {/* Google Play Console 5-Step Checklist */}
          <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Google Play Console Publication Roadmap</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-amber-400 font-bold font-mono">Step 1</span>
                <div className="font-bold text-white">Console Account</div>
                <p className="text-zinc-400 text-[11px]">Pay $25 one-time developer registration on play.google.com/console.</p>
              </div>

              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-amber-400 font-bold font-mono">Step 2</span>
                <div className="font-bold text-white">Generate .aab Bundle</div>
                <p className="text-zinc-400 text-[11px]">Run Bubblewrap CLI to compile the signed production bundle.</p>
              </div>

              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-amber-400 font-bold font-mono">Step 3</span>
                <div className="font-bold text-white">AssetLinks Verification</div>
                <p className="text-zinc-400 text-[11px]">Host assetlinks.json to verify ownership and remove browser URL bar.</p>
              </div>

              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-amber-400 font-bold font-mono">Step 4</span>
                <div className="font-bold text-white">Privacy & Rating</div>
                <p className="text-zinc-400 text-[11px]">Submit the Privacy Policy URL and answer the IARC questionnaire.</p>
              </div>

              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-emerald-400 font-bold font-mono">Step 5</span>
                <div className="font-bold text-white">Publish to Store</div>
                <p className="text-zinc-400 text-[11px]">Roll out to Closed Testing or Production for review & public download!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Build .aab using Bubblewrap CLI */}
      {activeTab === 'packaging' && (
        <div className="space-y-6">
          <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Official Google Bubblewrap CLI Packaging Instructions
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Bubblewrap is Google Chrome team's official tool that packages Progressive Web Apps into native Android App Bundles (.aab).
                </p>
              </div>
              <button
                onClick={() => handleCopy('bubblewrap', bubblewrapCommand)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'bubblewrap' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>

            <pre className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed">
              {bubblewrapCommand}
            </pre>
          </div>

          {/* Digital Asset Links */}
          <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Digital Asset Links (<code className="text-amber-400">/.well-known/assetlinks.json</code>)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Proves ownership between the domain and your Google Play package to enable true full-screen mode without address bar.
                </p>
              </div>
              <button
                onClick={() => handleCopy('assetlinks', assetLinksJson)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'assetlinks' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'assetlinks' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto">
              {assetLinksJson}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Apple App Store iOS Guide */}
      {activeTab === 'app-store' && (
        <div className="space-y-6">
          <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                <Apple className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Apple App Store Packaging Guide (Capacitor / Xcode)
                </h3>
                <p className="text-xs text-zinc-400">
                  Convert this web application into an iOS `.ipa` project for iPhone & iPad App Store submission.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed pt-2">
              <div className="p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center">1</span>
                  <span>Add Capacitor iOS Container</span>
                </div>
                <pre className="p-2.5 bg-black rounded-lg font-mono text-[11px] text-amber-300 mt-1">
                  npm install @capacitor/core @capacitor/cli @capacitor/ios{'\n'}npx cap init "Mukami Studio" "com.mukamistudio.app"{'\n'}npx cap add ios
                </pre>
              </div>

              <div className="p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center">2</span>
                  <span>Sync Assets & Open in Xcode</span>
                </div>
                <pre className="p-2.5 bg-black rounded-lg font-mono text-[11px] text-amber-300 mt-1">
                  npm run build{'\n'}npx cap sync{'\n'}npx cap open ios
                </pre>
              </div>

              <div className="p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center">3</span>
                  <span>Archive & Upload via App Store Connect</span>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  In Xcode, select <em>Product → Archive → Distribute App → App Store Connect</em>. Complete the compliance questionnaire and submit for Apple TestFlight or public review.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
};
