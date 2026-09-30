import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Privacy Policy & Store Compliance
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Google Play Store & Apple App Store Compliant · Effective September 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div className="overflow-y-auto space-y-4 text-xs text-zinc-300 leading-relaxed pr-2">
          <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
            <span className="font-bold text-white text-sm">Overview</span>
            <p>
              Mukami Creative Studio ("we", "our", or "the App"), founded by Mukami Serah in Nairobi, Kenya, provides digital art services, business flyer design, commission project management, and creative design tools. We respect your privacy and adhere to the Kenya Data Protection Act 2019, Google Play Developer Policies, and Apple App Store Review Guidelines.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span className="text-amber-400">1.</span> Data We Collect & How It Is Handled
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-1 text-zinc-400">
              <li><strong className="text-zinc-200">Device Local Storage:</strong> All commission orders, quotes, roadmap progress, and pricing presets are saved securely directly on your device via browser local storage. We do not transmit or sell your private commission lists to third-party data brokers.</li>
              <li><strong className="text-zinc-200">Client Reference Images:</strong> Images submitted for custom portraits or business flyers are used exclusively for rendering your requested artwork and are never repurposed without written consent.</li>
              <li><strong className="text-zinc-200">Contact Details:</strong> Phone numbers and emails entered for client orders or WhatsApp integration are utilized solely to generate client communications and invoices.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span className="text-amber-400">2.</span> Payment Security (M-Pesa & Card Rails)
            </h4>
            <p>
              Payment settlements occur over secure, accredited financial rails: Safaricom M-Pesa (Buy Goods Till / Pochi la Biashara) and international payment gateways. Mukami Creative Studio never stores or handles raw customer PINs or banking credentials.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span className="text-amber-400">3.</span> Intellectual Property & Copyright
            </h4>
            <p>
              Upon 100% final balance clearance, clients receive commercial reproduction rights for their custom flyers, portraits, or brand collateral. Watermarked preview drafts remain the exclusive intellectual property of Mukami Creative Studio until paid in full.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span className="text-amber-400">4.</span> Permissions Declaration (Android & iOS)
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-1 text-zinc-400">
              <li><strong className="text-zinc-200">Storage / Media:</strong> Required solely when you choose to export high-resolution 300 DPI artwork, CSV financial ledgers, or offline app files to your device.</li>
              <li><strong className="text-zinc-200">Network Access:</strong> Utilized for real-time currency conversion rates, AI studio generation, and WhatsApp order routing.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span className="text-amber-400">5.</span> Developer Contact & Data Removal
            </h4>
            <p>
              To request removal of your data or for commercial commission inquiries, contact Mukami Serah at <strong className="text-amber-400">mukamiserah4@gmail.com</strong> or via WhatsApp at <strong className="text-emerald-400">+254 700 000 000</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Store Policy Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
