import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, TrendingUp, Smartphone, Download } from 'lucide-react';
import { Currency } from '../types';

interface HeroProps {
  currency: Currency;
  onExplorePlan: () => void;
  onCalculatePricing: () => void;
  onOpenAiStudio: () => void;
  onOpenAppDownload?: () => void;
  onOpenBusinessHub?: () => void;
  onOpenPlayStore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currency,
  onExplorePlan,
  onCalculatePricing,
  onOpenAiStudio,
  onOpenAppDownload,
  onOpenBusinessHub,
  onOpenPlayStore,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-zinc-800/80">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Strategic Value */}
          <div className="lg:col-span-7 space-y-6">
            {/* Context meta line - clean unboxed text */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 tracking-wider uppercase">
              <span>Business Information Technology</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Digital Art Studio</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Nairobi & Global</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight leading-[1.15] text-balance">
              Monetize digital art with disciplined business systems and smart technology.
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
              Turn custom commissions, celebration posters, corporate flyers, and digital prints into a predictable, thriving business. Built specifically for Kenyan market dynamics (M-Pesa, Pochi la Biashara) and worldwide scaling in USD.
            </p>

            {/* Strategic Pillars / Proof Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 pb-2">
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl">
                <div className="text-xs text-zinc-400">Target Pricing</div>
                <div className="text-lg font-bold text-white tabular-nums mt-0.5">
                  {currency === 'KSH' ? 'KSh 1,500 – 35,000' : '$15 – $300'}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">Tiered commission matrix</div>
              </div>

              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl">
                <div className="text-xs text-zinc-400">Payment Security</div>
                <div className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5">
                  50% Upfront
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">Watermarked draft protection</div>
              </div>

              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl col-span-2 sm:col-span-1">
                <div className="text-xs text-zinc-400">First 10 Clients</div>
                <div className="text-lg font-bold text-amber-400 tabular-nums mt-0.5">
                  30-Day Plan
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">Week-by-week blueprint</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplorePlan}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-all cursor-pointer shadow-md hover:translate-y-[-1px]"
              >
                <span>Explore 30-Day Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCalculatePricing}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded-lg transition-colors cursor-pointer"
              >
                <span>Pricing Calculator</span>
              </button>

              {onOpenBusinessHub && (
                <button
                  onClick={onOpenBusinessHub}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Business Flyers</span>
                </button>
              )}

              {onOpenPlayStore && (
                <button
                  onClick={onOpenPlayStore}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                  title="Prepare Google Play & App Store distribution"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Play Store App</span>
                </button>
              )}
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero scope creep contract limits
              </span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Canva, Procreate & AI ready
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950">
              <img
                src="/src/assets/images/hero_creative_workspace_1790695951659.jpg"
                alt="Modern creative digital studio and technology workstation in Nairobi"
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Bottom Visual Caption & Interactive Highlight */}
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-semibold text-white">Mukami Creative Lab</span>
                  <span className="text-amber-400 font-mono">Nairobi, Kenya</span>
                </div>
                <p className="text-xs text-zinc-300 leading-snug">
                  "Blending software engineering precision with contemporary African visual art to deliver high-converting design assets."
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                  <span className="text-zinc-200">Tools:</span>
                  <span>Canva</span>
                  <span>·</span>
                  <span>Procreate</span>
                  <span>·</span>
                  <span>Photoshop</span>
                  <span>·</span>
                  <span>Gemini AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
