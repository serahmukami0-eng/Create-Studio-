import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Zap,
  Star,
  Gem,
  Briefcase,
  Smartphone,
  X,
  Check,
  ArrowRight,
  Download,
  Lock,
} from 'lucide-react';
import { Currency, MonetizationPlan, UserSubscription } from '../types';

interface MonetizationHubProps {
  currency: Currency;
  onOpenPricing: () => void;
  onSelectTab: (tab: string) => void;
}

export const MonetizationHub: React.FC<MonetizationHubProps> = ({
  currency,
  onOpenPricing,
  onSelectTab,
}) => {
  // Subscription state persisted in localStorage
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem('mukami_user_subscription');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // default free
      }
    }
    return {
      plan: 'free',
      active: true,
      activatedAt: new Date().toISOString().slice(0, 10),
    };
  });

  // Modal checkout state
  const [checkoutModalPlan, setCheckoutModalPlan] = useState<MonetizationPlan | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState<string>('0712 345 678');
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');
  const [generatedReceipt, setGeneratedReceipt] = useState<string>('');

  const saveSubscription = (sub: UserSubscription) => {
    setSubscription(sub);
    localStorage.setItem('mukami_user_subscription', JSON.stringify(sub));
  };

  const handleOpenCheckout = (plan: MonetizationPlan) => {
    if (plan === 'free') {
      saveSubscription({
        plan: 'free',
        active: true,
        activatedAt: new Date().toISOString().slice(0, 10),
      });
      return;
    }
    setCheckoutModalPlan(plan);
    setCheckoutStep('details');
  };

  const handleSimulatePayment = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      const receipt = `MK-${Math.floor(100000 + Math.random() * 900000)}X`;
      setGeneratedReceipt(receipt);
      const newSub: UserSubscription = {
        plan: checkoutModalPlan || 'premium',
        active: true,
        activatedAt: new Date().toISOString().slice(0, 10),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        mpesaReceipt: receipt,
        customerPhone: mpesaPhone,
      };
      saveSubscription(newSub);
      setCheckoutStep('success');
    }, 2200);
  };

  const plans = [
    {
      id: 'free' as MonetizationPlan,
      name: '🆓 Free Studio Starter',
      tagline: 'Ideal for aspiring digital artists exploring the Kenyan market.',
      priceKSh: 'KSh 0',
      priceUSD: '$0',
      period: 'forever free',
      color: 'zinc',
      features: [
        'Full access to 30-Day Launch Roadmap',
        'Dual Currency (KSh & USD) Pricing Calculator',
        'Active Commission Pipeline (up to 5 active orders)',
        'Watermarked Portfolio Previews',
        'Standard client contract outlines',
        'Community tips & BIT guides',
      ],
      cta: subscription.plan === 'free' ? 'Current Plan' : 'Downgrade to Free',
      popular: false,
    },
    {
      id: 'premium' as MonetizationPlan,
      name: '⭐ Pro Studio Creator',
      tagline: 'Unlock unrestricted high-res exports, pro templates & VIP AI prompts.',
      priceKSh: 'KSh 299',
      priceUSD: '$2.99',
      period: 'per month',
      color: 'amber',
      features: [
        'Unlimited 300 DPI High-Resolution Art Exports',
        '50+ Editable Canva & Figma Business Flyer Templates',
        'VIP AI Art Generation Prompts & Negative Prompt Bible',
        'Legally-vetted Kenyan Client Contract Agreement Generator',
        'Direct CSV Financial & Commission Ledger Export',
        'No watermarks on generated draft previews',
        'Priority commission intake queue',
      ],
      cta: subscription.plan === 'premium' ? 'Active Membership' : 'Join Pro (KSh 299/mo)',
      popular: true,
    },
    {
      id: 'individual' as MonetizationPlan,
      name: '💎 Pay-Per-Design',
      tagline: 'Single on-demand bespoke commissions without monthly commitments.',
      priceKSh: 'KSh 1,500 – 3,500',
      priceUSD: '$15 – $35',
      period: 'per custom design',
      color: 'cyan',
      features: [
        '100% custom digital artwork tailored to your brief',
        '24 - 48 Hour turnaround guarantee',
        '1 free refinement revision included in agreement',
        '50% upfront deposit security milestone',
        'Print-ready 300 DPI canvas PDF + social media formats',
        'Commercial license certificate upon full clearance',
      ],
      cta: 'Book Single Design',
      popular: false,
    },
    {
      id: 'business_starter' as MonetizationPlan,
      name: '💼 Business Monthly Retainer',
      tagline: 'Dedicated monthly marketing design for restaurants, salons & boutiques.',
      priceKSh: 'KSh 4,999 – 9,999',
      priceUSD: '$40 – $80',
      period: 'per month',
      color: 'emerald',
      features: [
        'Starter: 4 custom promotional flyers per month',
        'Growth: 10 marketing graphics + WhatsApp status flyers',
        'Complete Restaurant Menu or Salon Price List refresh',
        '24-Hour express priority turnaround on all requests',
        'Dedicated WhatsApp VIP design channel with Mukami',
        'Monthly visual marketing consultation for local growth',
      ],
      cta:
        subscription.plan === 'business_starter' || subscription.plan === 'business_growth'
          ? 'Active Business Plan'
          : 'Enroll Business Retainer',
      popular: false,
    },
  ];

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
          <span>Monetization Matrix</span>
          <span className="text-zinc-600">·</span>
          <span>Safaricom M-Pesa & Global USD Rails</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Studio Membership & Monetization Engine
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              Monetize your creative expertise with four structured revenue streams: free starter access, KSh 299/mo creator subscriptions, on-demand single designs, and predictable monthly business retainers.
            </p>
          </div>

          {/* Current Status Pill */}
          <div className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-xs">
              <span className="text-zinc-400 block">Your Current Status:</span>
              <span className="text-white font-bold font-mono">
                {subscription.plan === 'premium'
                  ? '⭐ Pro Member (Active)'
                  : subscription.plan.includes('business')
                  ? '💼 Business Retainer (Active)'
                  : '🆓 Free Studio Starter'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => {
          const isCurrent =
            subscription.plan === p.id ||
            (p.id === 'business_starter' && subscription.plan === 'business_growth');

          return (
            <div
              key={p.id}
              className={`bg-zinc-900/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 relative transition-all duration-300 ${
                p.popular
                  ? 'border-2 border-amber-400 shadow-xl shadow-amber-400/10'
                  : 'border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-black text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
                  Most Popular for Creators
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">{p.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 min-h-[34px] leading-relaxed">
                    {p.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                      {currency === 'KSH' ? p.priceKSh : p.priceUSD}
                    </span>
                    <span className="text-xs text-zinc-400">{p.period}</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                    What’s Included:
                  </span>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {p.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            p.popular ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        />
                        <span className="text-[11px] leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-zinc-800/80">
                <button
                  onClick={() => {
                    if (p.id === 'individual') {
                      onSelectTab('business-hub');
                    } else {
                      handleOpenCheckout(p.id);
                    }
                  }}
                  disabled={isCurrent && p.id !== 'individual'}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isCurrent && p.id !== 'individual'
                      ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : p.popular
                      ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg hover:shadow-amber-400/20 active:scale-[0.98]'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  {isCurrent && p.id !== 'individual' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Current Plan</span>
                    </>
                  ) : (
                    <span>{p.cta}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive M-Pesa STK Push Checkout Modal */}
      {checkoutModalPlan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Safaricom M-Pesa Checkout
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Secure STK Push Activation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutModalPlan(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutStep === 'details' && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span>Plan Selected:</span>
                    <span className="text-white font-bold">
                      {checkoutModalPlan === 'premium'
                        ? '⭐ Pro Studio Creator'
                        : '💼 Business Monthly Retainer'}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Billing Amount:</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">
                      {checkoutModalPlan === 'premium' ? 'KSh 299 / month' : 'KSh 4,999 / month'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">
                    Enter Safaricom M-Pesa Phone Number:
                  </label>
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="07XX XXX XXX or 2547XX..."
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400 text-sm"
                  />
                  <p className="text-[11px] text-zinc-500">
                    A prompt will appear on your phone asking you to enter your M-Pesa PIN.
                  </p>
                </div>

                <button
                  onClick={handleSimulatePayment}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send M-Pesa STK Prompt (KSh {checkoutModalPlan === 'premium' ? '299' : '4,999'})</span>
                </button>
              </div>
            )}

            {checkoutStep === 'processing' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-white">Prompt Sent to {mpesaPhone}</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Please check your phone screen and enter your M-Pesa PIN to complete activation...
                  </p>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="py-4 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Payment Confirmed!</h4>
                  <p className="text-xs text-zinc-300 mt-1">
                    Your Pro Studio membership is now active. Receipt:{' '}
                    <span className="font-mono text-amber-400 font-bold">{generatedReceipt}</span>
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutModalPlan(null)}
                  className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl text-xs cursor-pointer"
                >
                  Start Using Pro Features
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
