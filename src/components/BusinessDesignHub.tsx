import React, { useState } from 'react';
import {
  Utensils,
  Scissors,
  ShoppingBag,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageCircle,
  Download,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { Currency, BusinessDesignNiche } from '../types';
import { shareToAndroidOrWeb } from '../utils/androidShare';

interface BusinessDesignHubProps {
  currency: Currency;
  onOpenPricing: () => void;
  onSelectTab: (tab: string) => void;
}

interface NicheTemplate {
  id: string;
  niche: BusinessDesignNiche;
  title: string;
  subtitle: string;
  image: string;
  priceKSh: number;
  priceUSD: number;
  turnaround: string;
  deliverables: string[];
  clientPitchScript: string;
  sampleBrief: string;
  popular?: boolean;
}

const BUSINESS_TEMPLATES: NicheTemplate[] = [
  // 1. Restaurants & Cafes
  {
    id: 'rest-1',
    niche: 'restaurants',
    title: 'Weekend Brunch & Daily Specials Poster',
    subtitle: 'High-contrast typography with appetizing food layout',
    image: '/src/assets/images/portfolio_marketing_posters_1790695954659.jpg',
    priceKSh: 3500,
    priceUSD: 30,
    turnaround: '24 - 48 Hours',
    deliverables: [
      'A3 Print-Ready PDF (300 DPI)',
      'Instagram / WhatsApp Story (1080x1920px)',
      'Square Feed Post (1080x1080px)',
      'Transparent Food Cutouts & Logo Vectorization',
    ],
    clientPitchScript:
      'Habari! I noticed your weekend brunch menu. I design luxury high-contrast posters that increase customer table bookings. Can I craft a custom social & print menu flyer for your cafe with a 24-hour turnaround?',
    sampleBrief: 'Sunday roast and cocktails flyer for Westlands cafe, warm earthy tones with gold accent prices.',
    popular: true,
  },
  {
    id: 'rest-2',
    niche: 'restaurants',
    title: 'Laminated Tabletop & Wall Menu Board',
    subtitle: 'Clean categorised layout for fast customer decisions',
    image: '/src/assets/images/portfolio_marketing_posters_1790695954659.jpg',
    priceKSh: 4500,
    priceUSD: 40,
    turnaround: '48 Hours',
    deliverables: [
      'A4 / A3 Double-Sided Menu Design',
      'Digital QR-Code Mobile Menu Graphic',
      'Editable Canva/Figma Source Link',
    ],
    clientPitchScript:
      'Sasa! A clear, aesthetic menu directly increases average spend per customer. Let me refresh your drinks and food boards with readable typography and M-Pesa Till instructions included.',
    sampleBrief: 'Modern fast-casual cafe menu with breakfast combos, smoothies, and pastry section.',
  },

  // 2. Salons, Barbers & Spas
  {
    id: 'salon-1',
    niche: 'salons',
    title: 'Beauty Salon & Spa Service Price Board',
    subtitle: 'Pastel luxury aesthetic with service categories & prices',
    image: '/src/assets/images/hero_creative_workspace_1790695951659.jpg',
    priceKSh: 3000,
    priceUSD: 25,
    turnaround: '24 Hours',
    deliverables: [
      'Salon Wall Print Format (A2 / A3 at 300 DPI)',
      'WhatsApp Status & Instagram Story Highlights',
      'Booking Contact & M-Pesa Till Badge Included',
    ],
    clientPitchScript:
      'Hello! Beautiful hair and nail work deserves a luxury price list. I design sleek price menus for salons that build instant trust and encourage advance appointment bookings.',
    sampleBrief: 'Rose gold and cream salon price board: Braiding, Gel nails, Pedicure, Facial treatments.',
    popular: true,
  },
  {
    id: 'salon-2',
    niche: 'salons',
    title: 'Bridal & Weekend Glam Flash Promo Flyer',
    subtitle: 'High-conversion booking poster for beauty packages',
    image: '/src/assets/images/hero_creative_workspace_1790695951659.jpg',
    priceKSh: 2500,
    priceUSD: 20,
    turnaround: '24 Hours',
    deliverables: [
      'Instagram Carousel Cover + 2 Promo Slides',
      'WhatsApp Status Card with Direct Booking Link',
    ],
    clientPitchScript:
      'Hey team! Wedding season is starting. Let’s launch a bridal glam package flyer highlighting your styling team to lock in weekend wedding bookings.',
    sampleBrief: 'Bridal makeup and hair package for 5 bridesmaids with discount coupon code.',
  },

  // 3. Boutiques & Fashion Stores
  {
    id: 'bout-1',
    niche: 'boutiques',
    title: 'New Fashion Collection Drop Banner',
    subtitle: 'Editorial aesthetic for Ankara, streetwear & chic wear',
    image: '/src/assets/images/portfolio_custom_portrait_1790695953159.jpg',
    priceKSh: 3500,
    priceUSD: 30,
    turnaround: '24 - 48 Hours',
    deliverables: [
      'Instagram Multi-Product Story Layout',
      'WhatsApp Business Catalog Header Banner',
      'Clean Model Photo Retouching & Color Grading',
    ],
    clientPitchScript:
      'Sasa! When launching new stock, professional graphics make outfits look 3x more premium. I can style your drop photos with bold editorial typography and sizing guides.',
    sampleBrief: 'Summer Ankara dresses drop with model photo frames and "Order via WhatsApp" CTA.',
    popular: true,
  },
  {
    id: 'bout-2',
    niche: 'boutiques',
    title: 'Flash Sale & Clearance Promo Poster',
    subtitle: 'High-urgency design for end-of-month stock clearance',
    image: '/src/assets/images/portfolio_custom_portrait_1790695953159.jpg',
    priceKSh: 2500,
    priceUSD: 20,
    turnaround: '12 - 24 Hours (Express)',
    deliverables: [
      'High-impact "30% OFF EVERYTHING" banner',
      'WhatsApp Status square with delivery details',
    ],
    clientPitchScript:
      'Hello! Need to clear out stock this weekend? I create fast, high-impact flash sale graphics with bold typography that stop the scroll on Instagram and WhatsApp.',
    sampleBrief: 'End-of-month shoe and handbag clearance: Buy 1 Get 1 Free, valid for 48 hours.',
  },

  // 4. Event Organizers
  {
    id: 'event-1',
    niche: 'events',
    title: 'Nightclub & DJ Party Event Poster',
    subtitle: 'Neon dark mode graphic with DJ line-up & ticket tiers',
    image: '/src/assets/images/portfolio_marketing_posters_1790695954659.jpg',
    priceKSh: 4000,
    priceUSD: 35,
    turnaround: '24 Hours',
    deliverables: [
      'A2 Print-ready Poster for Venues (300 DPI)',
      'Instagram Story Animated/Static Flyer (9:16)',
      'Square Social Header with Sponsor Logos',
      'VIP Table & Ticket Tier Matrix Graphic',
    ],
    clientPitchScript:
      'Hey DJ/Promoter! A fire event poster sells early-bird tickets before you even open doors. Let me build a dark neon cyberpunk or afro-fusion flyer with your DJ lineup and M-Pesa Paybill.',
    sampleBrief: 'Amapiano Sunday vibe in Nairobi, gold and electric purple neon styling with 4 guest DJs.',
    popular: true,
  },
  {
    id: 'event-2',
    niche: 'events',
    title: 'Church Conference & Gospel Praise Night',
    subtitle: 'Majestic celestial typography with guest ministers layout',
    image: '/src/assets/images/portfolio_marketing_posters_1790695954659.jpg',
    priceKSh: 3500,
    priceUSD: 30,
    turnaround: '48 Hours',
    deliverables: [
      'Large Church Billboard / Screen Graphic (16:9)',
      'Print Program Flyer & Invitation Card',
      'Social Media Invitation Kit',
    ],
    clientPitchScript:
      'Greetings! For your upcoming revival and praise night, I craft reverent, beautifully illuminated posters that announce guest ministers with excellence and clarity.',
    sampleBrief: 'Annual youth conference flyer with theme "Ignite & Flourish", guest speakers and venue map.',
  },

  // 5. Small Businesses & Startups
  {
    id: 'startup-1',
    niche: 'startups',
    title: 'Business Information Technology (BIT) Crossover Kit',
    subtitle: 'Tech branding, LinkedIn banners, and pitch deck cards',
    image: '/src/assets/images/portfolio_tech_crossover_1790695957659.jpg',
    priceKSh: 7500,
    priceUSD: 65,
    turnaround: '3 - 4 Days',
    deliverables: [
      'Pitch Deck Cover & Executive Summary Visual',
      'Company One-Pager Flyer for Investors / Corporate Clients',
      'LinkedIn Company Banner & Founder Profile Badge',
      'Vector SVG Icon Set & Color System',
    ],
    clientPitchScript:
      'Hello Founder! As a BIT specialist and designer, I build corporate collateral that blends technical credibility with aesthetic authority to win B2B contracts.',
    sampleBrief: 'Fintech startup one-pager explaining micro-lending API, clean navy and emerald aesthetic.',
  },

  // 6. Students & Content Creators
  {
    id: 'stud-1',
    niche: 'students',
    title: 'Graduation Celebration Poster & Canvas Art',
    subtitle: 'Commemorative portrait with gown, degree & gold foil text',
    image: '/src/assets/images/portfolio_custom_portrait_1790695953159.jpg',
    priceKSh: 3500,
    priceUSD: 30,
    turnaround: '48 Hours',
    deliverables: [
      'A2 Framable Portrait Canvas (300 DPI)',
      'Family WhatsApp Announcement Card',
      'Instagram Story Congratulatory Layout',
    ],
    clientPitchScript:
      'Congratulations on graduation! Don’t let graduation photos just sit on your phone. I transform campus photos into fine digital canvas paintings that your parents will proudly frame.',
    sampleBrief: 'Graduation portrait from University of Nairobi, navy gown with gold "Class of 2026".',
  },
];

export const BusinessDesignHub: React.FC<BusinessDesignHubProps> = ({
  currency,
  onOpenPricing,
  onSelectTab,
}) => {
  const [selectedNiche, setSelectedNiche] = useState<BusinessDesignNiche | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [orderModalItem, setOrderModalItem] = useState<NicheTemplate | null>(null);

  const niches = [
    { id: 'all', label: 'All Niche Designs', icon: Sparkles },
    { id: 'restaurants', label: 'Restaurants & Cafes', icon: Utensils },
    { id: 'salons', label: 'Salons & Spas', icon: Scissors },
    { id: 'boutiques', label: 'Boutiques & Fashion', icon: ShoppingBag },
    { id: 'events', label: 'Event Organizers', icon: CalendarDays },
    { id: 'startups', label: 'Small Businesses & Tech', icon: Briefcase },
    { id: 'students', label: 'Students & Creators', icon: GraduationCap },
  ];

  const filteredTemplates =
    selectedNiche === 'all'
      ? BUSINESS_TEMPLATES
      : BUSINESS_TEMPLATES.filter((t) => t.niche === selectedNiche);

  const handleCopyPitch = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendWhatsAppOrder = async (item: NicheTemplate) => {
    const priceText = currency === 'KSH' ? `KSh ${item.priceKSh}` : `$${item.priceUSD}`;
    const text = `Hello Mukami Creative Studio! 🎨
I would like to order the "${item.title}" (${priceText}).
• Deliverables: ${item.deliverables.slice(0, 2).join(', ')}
• Turnaround: ${item.turnaround}
Here are my business details: [Insert name/photos]`;

    const url = `https://wa.me/254700000000?text=${encodeURIComponent(text)}`;
    await shareToAndroidOrWeb({
      title: `Order: ${item.title}`,
      text: text,
      url: url,
    });
  };

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
          <span>Local Market Engine</span>
          <span className="text-zinc-600">·</span>
          <span>Commercial Client Acquisition</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Business Flyer & Commercial Design Hub
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              Turn Nairobi restaurants, salons, fashion boutiques, and event organizers into high-paying recurring clients with structured design packages and pre-written client pitches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('pricing')}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-semibold text-zinc-200 cursor-pointer"
            >
              Pricing Calculator
            </button>
            <button
              onClick={() => onSelectTab('commissions')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs cursor-pointer shadow-sm"
            >
              Manage Orders
            </button>
          </div>
        </div>
      </div>

      {/* Target Market Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-zinc-800">
        {niches.map((n) => {
          const Icon = n.icon;
          const isActive = selectedNiche === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setSelectedNiche(n.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{n.label}</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const priceDisplay =
            currency === 'KSH'
              ? `KSh ${template.priceKSh.toLocaleString()}`
              : `$${template.priceUSD.toLocaleString()}`;

          const depositDisplay =
            currency === 'KSH'
              ? `KSh ${Math.round(template.priceKSh * 0.5).toLocaleString()}`
              : `$${Math.round(template.priceUSD * 0.5).toLocaleString()}`;

          return (
            <div
              key={template.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-4">
                {/* Visual Preview Banner */}
                <div className="relative h-44 bg-zinc-950 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md border border-zinc-700 text-amber-400 rounded-md">
                      {template.niche.toUpperCase()}
                    </span>
                    {template.popular && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-black rounded-md shadow-sm">
                        TOP SELLER
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-white text-base">
                      {priceDisplay}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded">
                      50% Deposit: {depositDisplay}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {template.subtitle}
                    </p>
                  </div>

                  {/* Turnaround Badge */}
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fast Delivery: <strong className="text-white">{template.turnaround}</strong></span>
                  </div>

                  {/* Included Deliverables */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Included Package Deliverables:
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-300">
                      {template.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="text-[11px] leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ready-to-use Client Outreach Pitch */}
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                        Client Pitch Script (WhatsApp / DM):
                      </span>
                      <button
                        onClick={() => handleCopyPitch(template.id, template.clientPitchScript)}
                        className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        title="Copy script to clipboard"
                      >
                        {copiedId === template.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-400 italic leading-relaxed">
                      "{template.clientPitchScript}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-4 space-y-2 border-t border-zinc-800/80 mt-4">
                <button
                  onClick={() => handleSendWhatsAppOrder(template)}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp ({priceDisplay})</span>
                </button>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1 pt-1">
                  <span>M-Pesa Till / Pochi Protected</span>
                  <span className="text-zinc-500">·</span>
                  <span>1 Free Revision Included</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Growth Strategy Banner for Local Businesses */}
      <div className="p-6 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
              High-Ticket Retainer Strategy
            </span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            Sign 3 Local Businesses on Monthly Design Retainers
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Instead of chasing one-off KSh 1,500 designs, pitch restaurants and salons a <strong>Monthly Creative Retainer (KSh 9,999/mo)</strong> covering 4 promotional flyers, weekly WhatsApp stories, and menu updates. 3 clients = KSh 30,000/month predictable income!
          </p>
        </div>

        <button
          onClick={() => onSelectTab('monetization')}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-lg hover:shadow-amber-400/20"
        >
          View Business Packages →
        </button>
      </div>
    </div>
  );
};
