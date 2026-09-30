import React, { useState } from 'react';
import { Calculator, Copy, Check, Clock, ShieldCheck, ArrowRight, Sparkles, Layers, DollarSign, Share2 } from 'lucide-react';
import { INITIAL_SERVICES } from '../data/initialData';
import { ServiceItem, Currency } from '../types';
import { shareToAndroidOrWeb } from '../utils/androidShare';

interface PricingCalculatorProps {
  currency: Currency;
  onToggleCurrency: () => void;
  onCommissionCreated?: (service: ServiceItem, total: number) => void;
  onOpenAiStudio?: () => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  currency,
  onToggleCurrency,
  onCommissionCreated,
  onOpenAiStudio,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('birthday-poster');
  const [extraRevisions, setExtraRevisions] = useState<number>(0);
  const [rushOption, setRushOption] = useState<'standard' | 'rush48' | 'urgent24'>('standard');
  const [commercialRights, setCommercialRights] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  const currentService = INITIAL_SERVICES.find((s) => s.id === selectedServiceId) || INITIAL_SERVICES[0];

  // Base price
  const basePrice = currency === 'KSH' ? currentService.priceKSh : currentService.priceUSD;

  // Add-ons
  const revisionCost = currency === 'KSH' ? extraRevisions * 300 : extraRevisions * 3;

  let rushMultiplier = 1;
  if (rushOption === 'rush48') rushMultiplier = 1.25;
  if (rushOption === 'urgent24') rushMultiplier = 1.5;

  let rushCost = basePrice * (rushMultiplier - 1);
  let commercialCost = commercialRights ? basePrice * 0.6 : 0;

  const totalCalculated = Math.round((basePrice + revisionCost + rushCost + commercialCost) / 10) * 10;
  const depositAmount = Math.round(totalCalculated * 0.5);
  const balanceAmount = totalCalculated - depositAmount;

  let calculatedTurnaround = currentService.turnaroundDays;
  if (rushOption === 'rush48') calculatedTurnaround = Math.min(2, currentService.turnaroundDays);
  if (rushOption === 'urgent24') calculatedTurnaround = 1;

  const currencySymbol = currency === 'KSH' ? 'KSh ' : '$';

  const clientQuoteMessage = `Hello ${clientName ? clientName : 'there'}! Thank you for inquiring about Mukami Creative Studio commissions.

Here is the customized quote for your ${currentService.title}:
-----------------------------------------------
• Package: ${currentService.title}
• Turnaround Time: ${calculatedTurnaround} business days
• Revisions Included: 1 free round ${extraRevisions > 0 ? `(+${extraRevisions} additional)` : ''}
• Usage Rights: ${commercialRights ? 'Full Commercial & Advertising License' : 'Personal & Social Media Use'}

TOTAL QUOTE: ${currencySymbol}${totalCalculated.toLocaleString()}
• 50% Commitment Deposit: ${currencySymbol}${depositAmount.toLocaleString()}
• 50% Balance (Upon Draft Approval): ${currencySymbol}${balanceAmount.toLocaleString()}

Payment Details (Kenya):
• M-Pesa Till / Pochi: [Your Number / Till Here]
• Or International: PayPal / Card

To secure your slot on the studio schedule, kindly send the 50% deposit along with your reference photos/brief. Work commences immediately upon confirmation!`;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(clientQuoteMessage);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const handleShareQuote = async () => {
    await shareToAndroidOrWeb({
      title: `Mukami Studio Quote - ${currentService.title}`,
      text: clientQuoteMessage,
    });
  };

  return (
    <div className="space-y-12 py-6">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <span>02. Financial Engineering</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Dual Currency (KSh & USD)</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Commission & Project Pricing Calculator
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              Calculate profitable quotes with crystal-clear milestone payments, revision buffers, and commercial licensing. No awkward guesswork when answering client inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-xl">
            <span className="text-xs text-zinc-400 px-2">Displaying in:</span>
            <button
              onClick={onToggleCurrency}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                currency === 'KSH'
                  ? 'bg-amber-400 text-black'
                  : 'text-zinc-400 hover:text-white bg-zinc-800'
              }`}
            >
              Kenyan Shillings (KSh)
            </button>
            <button
              onClick={onToggleCurrency}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                currency === 'USD'
                  ? 'bg-amber-400 text-black'
                  : 'text-zinc-400 hover:text-white bg-zinc-800'
              }`}
            >
              US Dollars ($)
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Calculator Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Package Configuration */}
        <div className="lg:col-span-7 space-y-6 bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl">
          {/* Step 1: Select Service */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              1. Select Commission / Artwork Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INITIAL_SERVICES.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    selectedServiceId === srv.id
                      ? 'bg-amber-400/10 border-amber-400/80 text-white'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{srv.title}</span>
                    <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                      {currencySymbol}
                      {(currency === 'KSH' ? srv.priceKSh : srv.priceUSD).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{srv.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Custom Client Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              2. Client Name (For WhatsApp / PDF Quote)
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Wanjiku, Brian, Savanna Coffee..."
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Step 3: Modifiers & Protection Controls */}
          <div className="space-y-4 pt-2 border-t border-zinc-800/80">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              3. Scope & Add-on Modifiers
            </div>

            {/* Revisions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
              <div>
                <div className="text-xs font-semibold text-white">Revision Round Buffer</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  1 round free is standard. Extra rounds charged to prevent scope creep.
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setExtraRevisions(num)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      extraRevisions === num
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {num === 0 ? '1 (Free)' : `+${num} (${currencySymbol}${currency === 'KSH' ? num * 300 : num * 3})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Turnaround Rush */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
              <div>
                <div className="text-xs font-semibold text-white">Turnaround Speed</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Standard {currentService.turnaroundDays} days vs express priority queue.
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { id: 'standard', label: 'Standard', fee: '+0%' },
                  { id: 'rush48', label: '48h Rush', fee: '+25%' },
                  { id: 'urgent24', label: '24h Urgent', fee: '+50%' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setRushOption(opt.id as any)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      rushOption === opt.id
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {opt.label} ({opt.fee})
                  </button>
                ))}
              </div>
            </div>

            {/* Commercial Rights */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
              <div>
                <div className="text-xs font-semibold text-white">Commercial & Advertising License</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Required if used for billboards, packaging, or monetized business ads (+60%).
                </div>
              </div>
              <button
                onClick={() => setCommercialRights(!commercialRights)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  commercialRights
                    ? 'bg-emerald-400 text-black border-emerald-400'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {commercialRights ? 'Commercial Included (+60%)' : 'Personal Use Only'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Quote & WhatsApp Pitch Generator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Quote Breakdown
              </span>
              <span className="text-xs text-amber-400 font-semibold font-mono">
                50/50 Milestone Model
              </span>
            </div>

            {/* Big Total Figures */}
            <div className="space-y-1">
              <div className="text-xs text-zinc-400">Total Client Fee</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tabular-nums tracking-tight">
                {currencySymbol}{totalCalculated.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 pt-1">
                Turnaround: <span className="text-white font-semibold">{calculatedTurnaround} business days</span>
              </div>
            </div>

            {/* Milestones security cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-zinc-950 border border-emerald-900/60 rounded-xl">
                <div className="text-[11px] font-semibold text-emerald-400 uppercase">
                  50% Upfront Deposit
                </div>
                <div className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                  {currencySymbol}{depositAmount.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">To commence initial draft</div>
              </div>

              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase">
                  50% Final Balance
                </div>
                <div className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                  {currencySymbol}{balanceAmount.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Before high-res delivery</div>
              </div>
            </div>

            {/* Deliverables summary */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-zinc-300">Deliverables Included:</div>
              <ul className="text-xs text-zinc-400 space-y-1">
                {currentService.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-amber-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleCopyQuote}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  {copiedQuote ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>Copy Quote</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareQuote}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all cursor-pointer"
                  title="Share directly via Android native share sheet or WhatsApp"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Share via Android / App</span>
                </button>
              </div>

              {onCommissionCreated && (
                <button
                  onClick={() => onCommissionCreated(currentService, totalCalculated)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  Create Commission Order in Pipeline →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reference Pricing Table from User's Prompt */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Digital Art Starting Price Matrix (Kenya KSh vs Global USD)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Calibrated for sustainable growth: competitive local entry in Kenya and premium international value in USD.
            </p>
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            Exchange baseline approx: 1 USD ≈ 125 KSh
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 pr-4">Service Tier</th>
                <th className="py-2.5 px-4">Starting Range (USD)</th>
                <th className="py-2.5 px-4">Kenyan Pricing (KSh)</th>
                <th className="py-2.5 px-4">Turnaround</th>
                <th className="py-2.5 pl-4">Target Market</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Simple Avatar / Icon</td>
                <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">$15 – $40</td>
                <td className="py-3 px-4 font-mono tabular-nums text-amber-400 font-semibold">KSh 1,800 – 4,500</td>
                <td className="py-3 px-4 text-zinc-400">1–2 days</td>
                <td className="py-3 pl-4 text-zinc-400">Creators, Gamers, LinkedIn</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Half-Body Digital Portrait</td>
                <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">$40 – $120</td>
                <td className="py-3 px-4 font-mono tabular-nums text-amber-400 font-semibold">KSh 4,500 – 14,000</td>
                <td className="py-3 px-4 text-zinc-400">3–4 days</td>
                <td className="py-3 pl-4 text-zinc-400">Personal gifts, Anniversaries</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Full Fine-Art Illustration</td>
                <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">$80 – $300</td>
                <td className="py-3 px-4 font-mono tabular-nums text-amber-400 font-semibold">KSh 9,500 – 36,000</td>
                <td className="py-3 px-4 text-zinc-400">5–7 days</td>
                <td className="py-3 pl-4 text-zinc-400">Art collectors, Framed home decor</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Luxury Birthday / Event Poster</td>
                <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">$20 – $40</td>
                <td className="py-3 px-4 font-mono tabular-nums text-amber-400 font-semibold">KSh 2,500 – 4,500</td>
                <td className="py-3 px-4 text-zinc-400">2–3 days</td>
                <td className="py-3 pl-4 text-zinc-400">VIP celebrations, Event planners</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Corporate Flyer / Tech Graphic</td>
                <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">$25 – $60</td>
                <td className="py-3 px-4 font-mono tabular-nums text-amber-400 font-semibold">KSh 3,000 – 7,500</td>
                <td className="py-3 px-4 text-zinc-400">2 days</td>
                <td className="py-3 pl-4 text-zinc-400">Cafes, Tech startups, Real estate</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Digital Prints & Phone Wallpapers</td>
                <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">$3 – $10</td>
                <td className="py-3 px-4 font-mono tabular-nums text-amber-400 font-semibold">KSh 300 – 1,200</td>
                <td className="py-3 px-4 text-zinc-400">Instant</td>
                <td className="py-3 pl-4 text-zinc-400">Repeat passive sales on WhatsApp</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
