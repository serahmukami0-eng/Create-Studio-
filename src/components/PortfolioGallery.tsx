import React, { useState } from 'react';
import { Sparkles, Maximize2, Tag, Clock, Layers, DollarSign, X } from 'lucide-react';
import { INITIAL_PORTFOLIO } from '../data/initialData';
import { PortfolioItem, Currency } from '../types';

interface PortfolioGalleryProps {
  currency: Currency;
  onOpenCalculator: () => void;
  onOpenAiStudio: () => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  currency,
  onOpenCalculator,
  onOpenAiStudio,
}) => {
  const [filter, setFilter] = useState<'all' | 'commissions' | 'marketing' | 'prints'>('all');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

  const filteredItems = INITIAL_PORTFOLIO.filter(
    (item) => filter === 'all' || item.category === filter
  );

  return (
    <div className="space-y-10 py-6">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <span>04. Creative Showcase</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Proof of Craft & Commercial Value</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Curated Portfolio & Starter Collection
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              "A portfolio is simply proof of what you can create." Explore luxury celebration posters, couple portraits, tech business flyers, and minimalist mobile wallpapers.
            </p>
          </div>

          {/* Interactive Filter Tabs (Functional button controls allowed per constitution) */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Works' },
              { id: 'commissions', label: 'Custom Portraits' },
              { id: 'marketing', label: 'Posters & Flyers' },
              { id: 'prints', label: 'Digital Prints' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Bento Grid of Artworks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {filteredItems.map((item, index) => {
          // Dynamic layout weighting
          const isLarge = index === 0 || index === 2;
          const colSpan = isLarge ? 'lg:col-span-7' : 'lg:col-span-5';

          const priceText =
            currency === 'KSH'
              ? `KSh ${item.suggestedPriceKSh.toLocaleString()}`
              : `$${item.suggestedPriceUSD.toLocaleString()}`;

          return (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className={`${colSpan} group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 cursor-pointer hover:border-zinc-700 transition-all flex flex-col justify-between`}
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Corner Affordance */}
                <div className="absolute top-3.5 right-3.5 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Overlay Metadata on Image (clean unboxed text per Section 1A) */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-zinc-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span>{item.tools.join(' · ')}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {priceText}
                  </span>
                </div>
              </div>

              {/* Card Footer Text */}
              <div className="p-5 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-zinc-500 capitalize">{item.category}</span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Client prompt context line */}
                <div className="pt-1 text-[11px] text-zinc-500 italic truncate font-mono">
                  Prompt: {item.clientPrompt}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Media Display */}
            <div className="lg:w-1/2 bg-black flex items-center justify-center relative p-4">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="max-h-[60vh] lg:max-h-[75vh] w-auto object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right: Detailed Story & Commercial Specs */}
            <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                    {activeModalItem.category} Case Study
                  </span>
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    {activeModalItem.title}
                  </h3>
                  <div className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {activeModalItem.description}
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Client Brief / Prompt Story
                  </div>
                  <div className="text-xs text-amber-300 font-mono italic">
                    {activeModalItem.clientPrompt}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                    <div className="text-zinc-500">Standard Pricing</div>
                    <div className="text-base font-bold text-white font-mono mt-0.5">
                      {currency === 'KSH'
                        ? `KSh ${activeModalItem.suggestedPriceKSh.toLocaleString()}`
                        : `$${activeModalItem.suggestedPriceUSD.toLocaleString()}`}
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                    <div className="text-zinc-500">License</div>
                    <div className="text-xs font-semibold text-zinc-200 mt-1">
                      {activeModalItem.license}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase">
                    Software & Creative Tools
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    {activeModalItem.tools.map((t, idx) => (
                      <React.Fragment key={t}>
                        <span>{t}</span>
                        {idx < activeModalItem.tools.length - 1 && (
                          <span className="text-zinc-600">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveModalItem(null);
                    onOpenCalculator();
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Order Similar Artwork →
                </button>
                <button
                  onClick={() => {
                    setActiveModalItem(null);
                    onOpenAiStudio();
                  }}
                  className="py-2.5 px-4 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
                >
                  Remix in AI Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
