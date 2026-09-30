import React, { useState } from 'react';
import { Sparkles, Copy, Check, Palette, Type, Clock, DollarSign, MessageSquare, ArrowRight, RefreshCw } from 'lucide-react';
import { AiConceptResult, Currency } from '../types';

interface AiCreativeStudioProps {
  currency: Currency;
  onOpenPricing: () => void;
}

const PRESET_IDEAS = [
  {
    title: 'Luxury Birthday Celebration Poster',
    category: 'Celebration Poster',
    prompt: 'Create a luxury birthday poster for a woman wearing an elegant black dress, gold decorations, and the words Happy Birthday in chic typography.',
  },
  {
    title: 'Nairobi Tech Startup Flyer',
    category: 'Corporate Flyer',
    prompt: 'A sleek, modern business flyer for an AI & Fintech startup in Nairobi, featuring clean dark blue glassmorphism, geometric lines, and QR code placement.',
  },
  {
    title: 'Afropolitan Couple Sunset Portrait',
    category: 'Custom Commission',
    prompt: 'A warm, romantic couple portrait with golden hour ambient sunset lighting, painterly textured skin tones, and rich earthy backdrop.',
  },
  {
    title: 'Minimalist Celestial Phone Wallpaper',
    category: 'Digital Print',
    prompt: 'A tranquil OLED phone wallpaper with fluid terracotta and navy gradient waves, delicate gold constellation lines, and minimal typography.',
  },
];

export const AiCreativeStudio: React.FC<AiCreativeStudioProps> = ({
  currency,
  onOpenPricing,
}) => {
  const [promptInput, setPromptInput] = useState<string>(PRESET_IDEAS[0].prompt);
  const [categoryInput, setCategoryInput] = useState<string>('Celebration Poster');
  const [audienceInput, setAudienceInput] = useState<string>('VIP Event & Social Media');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AiConceptResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/creative-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryInput,
          title: promptInput.slice(0, 50),
          details: promptInput,
          targetAudience: audienceInput,
          currency: currency,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
      }
    } catch (err) {
      console.error('Error generating concept:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-10 py-6">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>05. AI Visual Engine</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>From Text Prompt to Sellable Commercial Art</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Creative Director & Brief Synthesizer
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              "Create a luxury birthday poster for a woman wearing an elegant black dress, gold decorations..." Transform rough client ideas into full production specs, Canva/Procreate canvas dimensions, color palettes, and WhatsApp conversion scripts.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Generator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Prompting Form */}
        <div className="lg:col-span-5 space-y-5 bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl">
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Quick One-Click Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_IDEAS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(preset.prompt);
                    setCategoryInput(preset.category);
                  }}
                  className="px-2.5 py-1 text-xs bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg transition-colors cursor-pointer text-left"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Artwork / Client Prompt
              </label>
              <textarea
                rows={4}
                required
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe what the artwork should look like (e.g. A luxury birthday poster for a woman in an elegant black dress with gold confetti...)"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Category</label>
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Target Audience</label>
                <input
                  type="text"
                  value={audienceInput}
                  onChange={(e) => setAudienceInput(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-400 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Creative Specs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Full Production Brief</span>
                </>
              )}
            </button>
          </form>

          {/* Prompting Advice */}
          <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
            <span className="font-semibold text-amber-300">Commercial Art Tip:</span>
            <p>
              When combining AI with Canva or Procreate, use AI to generate the core hero subject or texture, then bring it into Canva/Photoshop to set crisp vector typography, dates, and client names.
            </p>
          </div>
        </div>

        {/* Right Column: Structured Output Display */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="bg-zinc-900/90 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-2">
                <div>
                  <span className="text-[11px] font-mono uppercase text-amber-400 tracking-wider">
                    Generated Studio Production Spec
                  </span>
                  <h3 className="text-xl font-bold text-white font-display mt-0.5">
                    {result.conceptTitle}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400">Suggested Rate</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {currency === 'KSH' ? result.suggestedPriceKSh : result.suggestedPriceUSD}
                  </div>
                </div>
              </div>

              {/* Visual Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Artistic Direction & Composition
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  {result.artisticDirection}
                </p>
              </div>

              {/* Technical Canvas & Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Palette */}
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    <span>Curated Color Palette</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {result.colorPalette?.map((hex, i) => (
                      <button
                        key={i}
                        onClick={() => copyToClipboard(hex, `hex-${i}`)}
                        className="group relative flex-1 h-9 rounded-lg border border-white/10 transition-transform hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: hex }}
                        title={`Click to copy ${hex}`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-white/90 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg">
                          {hex}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-zinc-500">Click any swatch to copy HEX code</div>
                </div>

                {/* Dimensions & Fonts */}
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                    <Type className="w-3.5 h-3.5 text-amber-400" />
                    <span>Canvas & Typography</span>
                  </div>
                  <div className="text-xs text-zinc-300">
                    <span className="text-zinc-500">Canvas:</span> {result.recommendedDimensions}
                  </div>
                  <div className="text-xs text-zinc-300">
                    <span className="text-zinc-500">Fonts:</span> {result.typographyPairing}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Tools: {result.recommendedTools?.join(', ')}
                  </div>
                </div>
              </div>

              {/* WhatsApp Client Pitch Script */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    WhatsApp Client Inquiry Reply
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.whatsappClientPitch, 'pitch')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    {copiedKey === 'pitch' ? 'Copied!' : 'Copy Script'}
                  </button>
                </div>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {result.whatsappClientPitch}
                </div>
              </div>

              {/* Social Media 3-Second Hook */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5 text-xs">
                <div className="font-semibold text-amber-400">
                  TikTok / Instagram Reel Hook (First 3 Seconds):
                </div>
                <div className="text-white font-medium italic">"{result.socialMediaHook}"</div>
                <div className="text-zinc-400 text-[11px] pt-1 leading-snug">
                  {result.socialMediaCaption}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-400 space-y-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              <Sparkles className="w-8 h-8 text-amber-400/80 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">Generate Your First Studio Brief</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Type any design idea on the left or click a preset to receive an instant commercial blueprint with pricing, color hexes, and WhatsApp copy.
                </p>
              </div>
              <button
                onClick={() => handleGenerate()}
                className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Try "Luxury Birthday Poster" Example
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
