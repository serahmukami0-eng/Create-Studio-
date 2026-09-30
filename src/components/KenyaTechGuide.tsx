import React, { useState } from 'react';
import { Smartphone, Globe, Shield, Terminal, CheckCircle2, ChevronRight, AlertCircle, HelpCircle } from 'lucide-react';
import { Currency } from '../types';

interface KenyaTechGuideProps {
  currency: Currency;
  onOpenCalculator: () => void;
}

export const KenyaTechGuide: React.FC<KenyaTechGuideProps> = ({
  currency,
  onOpenCalculator,
}) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'bit-stack' | 'nft-guide'>('payments');

  return (
    <div className="space-y-10 py-6">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <span>06. Strategic Integration</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Kenyan Infrastructure & BIT Advantage</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Payment Rails & Technology Synergy
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              Setting up friction-free payments in Kenya (M-Pesa Till & Pochi) and leveraging your Business Information Technology background to out-compete purely artistic studios.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Kenyan Payments
            </button>
            <button
              onClick={() => setActiveTab('bit-stack')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'bit-stack'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              BIT Tech Advantage
            </button>
            <button
              onClick={() => setActiveTab('nft-guide')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'nft-guide'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              The NFT Reality
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Kenyan & Global Payment Rails */}
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Smartphone className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Local Option 1</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pochi la Biashara</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                The fastest way to separate business money from personal funds on your existing Safaricom line without creating a registered company.
              </p>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs space-y-2 text-zinc-300">
              <div className="font-semibold text-white">How to Set Up:</div>
              <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-[11px]">
                <li>Dial <span className="text-amber-400 font-mono font-bold">*334#</span></li>
                <li>Select "Pochi la Biashara"</li>
                <li>Opt in as an individual business owner</li>
                <li>Customers send money directly via Lipa na M-Pesa &gt; Pochi</li>
              </ol>
            </div>
          </div>

          <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Shield className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Local Option 2</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">M-Pesa Buy Goods Till</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Gives your studio an executive feel. Clients pay via Buy Goods and Services with zero transaction fees on their side.
              </p>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs space-y-2 text-zinc-300">
              <div className="font-semibold text-white">Setup Requirements:</div>
              <ul className="space-y-1 text-zinc-400 text-[11px]">
                <li>• Register online at m-pesaforbusiness.co.ke</li>
                <li>• National ID copy & KRA PIN certificate</li>
                <li>• Access via M-Pesa for Business App for real-time alerts</li>
                <li>• Separate business statement for tax hygiene</li>
              </ul>
            </div>
          </div>

          <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">International (USD)</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">PayPal to M-Pesa & Wise</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Charge global clients in USD ($30–$250+) via PayPal, card, or Wise, then withdraw straight into your M-Pesa wallet.
              </p>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs space-y-2 text-zinc-300">
              <div className="font-semibold text-white">Withdrawal Pipeline:</div>
              <ul className="space-y-1 text-zinc-400 text-[11px]">
                <li>• Link via <span className="text-amber-400 font-mono">paypal-mobilemoney.com/safaricom</span></li>
                <li>• Funds arrive in M-Pesa within 2 hours</li>
                <li>• Use Wise or Remitly for direct bank transfer</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: BIT (Business Information Technology) Synergy */}
      {activeTab === 'bit-stack' && (
        <div className="p-6 md:p-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              The BIT Advantage
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              Why Combining Technology + Business + Creative Design is Your Superpower
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
              Most digital artists only draw. They have no understanding of databases, web development, conversion rates, or client management systems. By packaging your Business Information Technology skills with visual design, you can charge 3x to 5x higher project fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="font-bold text-white text-sm">1. Brand + Portfolio Websites</div>
              <p className="text-zinc-400 leading-relaxed">
                Offer clients not just a logo or flyer, but a complete digital landing page (React, Tailwind, or Webflow). A flyer is KSh 3,000; a landing page bundle is KSh 35,000+.
              </p>
            </div>

            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="font-bold text-white text-sm">2. Automated Client Delivery Cloud</div>
              <p className="text-zinc-400 leading-relaxed">
                Use Google Drive API or structured cloud storage with expiring download links. Give clients a dashboard instead of clunky WhatsApp photo compression.
              </p>
            </div>

            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="font-bold text-white text-sm">3. Conversion & Analytics Focus</div>
              <p className="text-zinc-400 leading-relaxed">
                Design with purpose. Add trackable QR codes (UTM tags) to flyers so restaurant or startup clients can see exactly how many people scanned their posters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: The NFT Reality Check */}
      {activeTab === 'nft-guide' && (
        <div className="p-6 md:p-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Realistic Market Analysis</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              Why You Should Start with Commissions & Prints First, Not NFTs
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
              "Buying an NFT doesn't automatically mean buying the copyright to the artwork. Also, don't think of NFTs as guaranteed income." Here is why focusing on local and global commissions first builds real wealth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
              <div className="font-bold text-rose-400 text-sm">The NFT Pitfalls for Beginners</div>
              <ul className="space-y-2 text-zinc-400 leading-relaxed">
                <li>• Gas fees & wallet setup can cost money before making a single sale.</li>
                <li>• Requires an existing loyal community of crypto collectors to generate bids.</li>
                <li>• Highly speculative: 95% of NFT collections trade at zero volume.</li>
                <li>• Legal confusion over commercial rights vs token ownership.</li>
              </ul>
            </div>

            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
              <div className="font-bold text-emerald-400 text-sm">The Commission & Prints Advantage</div>
              <ul className="space-y-2 text-zinc-400 leading-relaxed">
                <li>• Guaranteed income: 50% cash deposit paid upfront before drawing.</li>
                <li>• Immediate real-world demand: birthdays, weddings, flyers, and YouTube covers happen every day.</li>
                <li>• Direct M-Pesa cash in your pocket with zero crypto conversion friction.</li>
                <li>• Builds real client relationships and recurring corporate retainers.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
