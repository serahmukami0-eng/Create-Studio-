/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RoadmapView } from './components/RoadmapView';
import { PricingCalculator } from './components/PricingCalculator';
import { CommissionManager } from './components/CommissionManager';
import { PortfolioGallery } from './components/PortfolioGallery';
import { AiCreativeStudio } from './components/AiCreativeStudio';
import { KenyaTechGuide } from './components/KenyaTechGuide';
import { BusinessDesignHub } from './components/BusinessDesignHub';
import { MonetizationHub } from './components/MonetizationHub';
import { AppStoreLaunchpad } from './components/AppStoreLaunchpad';
import { AboutStudio } from './components/AboutStudio';
import { Footer } from './components/Footer';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { MobileDownloadPrompt } from './components/MobileDownloadPrompt';
import { Currency, ServiceItem } from './types';

export default function App() {
  const [currency, setCurrency] = useState<Currency>('KSH');
  const [activeTab, setActiveTab] = useState<string>('roadmap');
  const [showAndroidInstall, setShowAndroidInstall] = useState<boolean>(false);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'KSH' ? 'USD' : 'KSH'));
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCommissionCreated = (service: ServiceItem, total: number) => {
    setActiveTab('commissions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[100dvh] bg-[#090A0F] text-slate-100 flex flex-col font-sans pb-18 lg:pb-0 relative selection:bg-amber-500 selection:text-black">
      {/* Universal Fixed Phone Background Atmosphere */}
      <div className="mobile-app-bg" aria-hidden="true" />

      {/* Offline Status Bar */}
      <OfflineBanner />

      {/* Floating Download Prompt for Mobile Phones */}
      <MobileDownloadPrompt onOpenInstallModal={() => setShowAndroidInstall(true)} />

      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        <Header
          currency={currency}
          onToggleCurrency={toggleCurrency}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenAndroidInstall={() => setShowAndroidInstall(true)}
        />

        <main className="flex-1">
          {/* Hero Section shown on the primary views or collapsible */}
          <Hero
            currency={currency}
            onExplorePlan={() => handleSelectTab('roadmap')}
            onCalculatePricing={() => handleSelectTab('pricing')}
            onOpenAiStudio={() => handleSelectTab('ai-studio')}
            onOpenAppDownload={() => setShowAndroidInstall(true)}
            onOpenBusinessHub={() => handleSelectTab('business-hub')}
            onOpenPlayStore={() => handleSelectTab('app-store')}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === 'roadmap' && (
              <RoadmapView
                currency={currency}
                onOpenPricing={() => handleSelectTab('pricing')}
                onOpenAiStudio={() => handleSelectTab('ai-studio')}
              />
            )}

            {activeTab === 'business-hub' && (
              <BusinessDesignHub
                currency={currency}
                onOpenPricing={() => handleSelectTab('pricing')}
                onSelectTab={handleSelectTab}
              />
            )}

            {activeTab === 'pricing' && (
              <PricingCalculator
                currency={currency}
                onToggleCurrency={toggleCurrency}
                onCommissionCreated={handleCommissionCreated}
                onOpenAiStudio={() => handleSelectTab('ai-studio')}
              />
            )}

            {activeTab === 'commissions' && (
              <CommissionManager
                currency={currency}
                onOpenPricing={() => handleSelectTab('pricing')}
              />
            )}

            {activeTab === 'portfolio' && (
              <PortfolioGallery
                currency={currency}
                onOpenCalculator={() => handleSelectTab('pricing')}
                onOpenAiStudio={() => handleSelectTab('ai-studio')}
              />
            )}

            {activeTab === 'monetization' && (
              <MonetizationHub
                currency={currency}
                onOpenPricing={() => handleSelectTab('pricing')}
                onSelectTab={handleSelectTab}
              />
            )}

            {activeTab === 'app-store' && (
              <AppStoreLaunchpad
                onOpenInstallModal={() => setShowAndroidInstall(true)}
              />
            )}

            {activeTab === 'ai-studio' && (
              <AiCreativeStudio
                currency={currency}
                onOpenPricing={() => handleSelectTab('pricing')}
              />
            )}

            {activeTab === 'kenya-tech' && (
              <KenyaTechGuide
                currency={currency}
                onOpenCalculator={() => handleSelectTab('pricing')}
              />
            )}

            {activeTab === 'about' && (
              <AboutStudio
                currency={currency}
                onSelectTab={handleSelectTab}
              />
            )}
          </div>
        </main>

        <Footer onSelectTab={handleSelectTab} />
      </div>

      {/* Android & Mobile Phone Native Bottom Navigation Dock */}
      <AndroidBottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenAndroidInstall={() => setShowAndroidInstall(true)}
      />

      {/* Universal Mobile Phone App Download & Install Modal */}
      <AndroidInstallModal
        isOpen={showAndroidInstall}
        onClose={() => setShowAndroidInstall(false)}
      />
    </div>
  );
}
