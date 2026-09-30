import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Heart,
  MessageCircle,
  Mail,
  MapPin,
  Laptop,
  Palette,
  CreditCard,
  Send,
  Check,
} from 'lucide-react';
import { Currency } from '../types';
import { shareToAndroidOrWeb } from '../utils/androidShare';

interface AboutStudioProps {
  currency: Currency;
  onSelectTab: (tab: string) => void;
}

export const AboutStudio: React.FC<AboutStudioProps> = ({ currency, onSelectTab }) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryService, setInquiryService] = useState('Custom Portrait Painting');
  const [inquiryDetails, setInquiryDetails] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName) return;

    const message = `Hello Mukami Serah! 🎨
My name is ${inquiryName}.
• Contact: ${inquiryContact || 'WhatsApp'}
• Requested Service: ${inquiryService}
• Brief Notes: ${inquiryDetails || 'I would like to discuss a custom design order.'}
Looking forward to collaborating with Mukami Creative Studio!`;

    const url = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    await shareToAndroidOrWeb({
      title: `Commission Inquiry from ${inquiryName}`,
      text: message,
      url: url,
    });

    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 4000);
  };

  return (
    <div className="space-y-12 py-6">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
          <span>00. Studio Identity & Vision</span>
          <span className="text-zinc-600">·</span>
          <span>Nairobi & Global</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
          Where Business Information Technology Meets Fine Digital Art.
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Mukami Creative Studio was established by Mukami Serah in Nairobi, Kenya, to prove that creative talent thrives when backed by disciplined business systems, automated workflows, and local payment rails.
        </p>
      </div>

      {/* Story & Background Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Founder Story */}
        <div className="lg:col-span-7 space-y-5 text-zinc-300 text-sm leading-relaxed">
          <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>The Origin: Bridging BIT and Artistry</span>
            </h3>
            <p>
              Many talented artists across East Africa struggle not because their artwork lacks beauty, but because creative industries often neglect business fundamentals. Underpricing, scopes that spiral endlessly, and delivering unwatermarked work before receiving full payment cause immense creator burnout.
            </p>
            <p>
              As a Business Information Technology (BIT) scholar and digital designer, Mukami built this studio as a living laboratory: pairing creative tools like Procreate, Canva, and Generative AI with structured pricing matrices, M-Pesa automated rails, watermarked draft review protocols, and formal client contracts.
            </p>
          </div>

          {/* Core Studio Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Unpaid Work</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Strict 50% upfront deposit commitment and diagonal security watermarks on all draft reviews guarantee creative labor is protected.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Local & Global Rails</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Accept M-Pesa Buy Goods & Pochi la Biashara seamlessly across Kenya, with automated dual-currency conversion into USD for international commissions.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Studio Card with Image */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="relative h-56 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <img
                src="/src/assets/images/hero_creative_workspace_1790695951659.jpg"
                alt="Studio Workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Mukami Serah</span>
                <span className="px-2 py-0.5 bg-amber-400 text-black font-bold text-[10px] rounded">
                  Lead Artist & Technologist
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
                <span>Location:</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Nairobi, Kenya (Worldwide Remote)
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
                <span>Creative Stack:</span>
                <span className="text-white font-medium">Procreate, Canva Pro, Figma, Gemini AI</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Payment Accepted:</span>
                <span className="text-emerald-400 font-medium">M-Pesa Till / Pochi / Card / PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Contact & Custom Commission Intake Form */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono">
            <MessageCircle className="w-4 h-4" />
            <span>Direct Client Intake Form</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Book a Custom Design or Art Commission
          </h3>
          <p className="text-xs text-zinc-400">
            Tell Mukami about your project. This sends your brief directly to our priority WhatsApp inbox for an instant quote within 2 hours.
          </p>
        </div>

        <form onSubmit={handleSendInquiry} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Your Full Name:</label>
            <input
              type="text"
              required
              value={inquiryName}
              onChange={(e) => setInquiryName(e.target.value)}
              placeholder="e.g. Wanjiku Mwangi"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">WhatsApp / Phone Number:</label>
            <input
              type="text"
              value={inquiryContact}
              onChange={(e) => setInquiryContact(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Service Category:</label>
            <select
              value={inquiryService}
              onChange={(e) => setInquiryService(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Custom Portrait Painting">Custom Portrait Painting (KSh 5,500)</option>
              <option value="Luxury Birthday Poster">Luxury Birthday Poster (KSh 3,500)</option>
              <option value="Restaurant Menu / Brunch Flyer">Restaurant Menu / Brunch Flyer (KSh 3,500)</option>
              <option value="Salon & Spa Price Board">Salon & Spa Price Board (KSh 3,000)</option>
              <option value="Event DJ / Concert Poster">Event DJ / Concert Poster (KSh 4,000)</option>
              <option value="Tech Founder Brand Kit">Tech Founder Brand Kit (KSh 25,000)</option>
              <option value="Monthly Business Retainer">Monthly Business Retainer (KSh 9,999/mo)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Brief / Dimensions / Deadline:</label>
            <input
              type="text"
              value={inquiryDetails}
              onChange={(e) => setInquiryDetails(e.target.value)}
              placeholder="e.g. Needed by Friday for A3 canvas print..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-2 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>50% deposit security & 1 free revision agreement applied automatically.</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-amber-400/20"
            >
              {inquirySent ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3]" />
                  <span>Brief Sent to WhatsApp!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Brief to WhatsApp (+254 700 000 000)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
