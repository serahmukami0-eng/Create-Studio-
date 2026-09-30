import React, { useState } from 'react';
import {
  X,
  Calendar,
  DollarSign,
  ShieldCheck,
  Clock,
  Sparkles,
  Share2,
  FileText,
  User,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  MessageCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { CommissionOrder, Currency } from '../types';
import { ProjectStatusStepper, normalizeStage, STAGES_FLOW } from './ProjectStatusStepper';
import { shareToAndroidOrWeb } from '../utils/androidShare';

interface CommissionDetailsModalProps {
  isOpen: boolean;
  commission: CommissionOrder | null;
  currency: Currency;
  onClose: () => void;
  onUpdateCommission: (updated: CommissionOrder) => void;
  onOpenContractBuilder: (comm: CommissionOrder) => void;
  onOpenWatermarkDemo: () => void;
}

export const CommissionDetailsModal: React.FC<CommissionDetailsModalProps> = ({
  isOpen,
  commission,
  currency,
  onClose,
  onUpdateCommission,
  onOpenContractBuilder,
  onOpenWatermarkDemo,
}) => {
  if (!isOpen || !commission) return null;

  const priceDisplay =
    currency === 'KSH'
      ? `KSh ${commission.priceKSh.toLocaleString()}`
      : `$${commission.priceUSD.toLocaleString()}`;

  const depositAmount = Math.round(
    currency === 'KSH' ? commission.priceKSh * 0.5 : commission.priceUSD * 0.5
  );
  const depositDisplay =
    currency === 'KSH' ? `KSh ${depositAmount.toLocaleString()}` : `$${depositAmount.toLocaleString()}`;

  const balanceAmount =
    currency === 'KSH' ? commission.priceKSh - depositAmount : commission.priceUSD - depositAmount;
  const balanceDisplay =
    currency === 'KSH' ? `KSh ${balanceAmount.toLocaleString()}` : `$${balanceAmount.toLocaleString()}`;

  const handleStageChange = (newStageId: (typeof STAGES_FLOW)[number]['id']) => {
    let nextDepositStatus = commission.depositStatus;
    if (newStageId === 'deposit' || newStageId === 'draft' || newStageId === 'revisions') {
      if (commission.depositStatus === 'unpaid') {
        nextDepositStatus = 'deposit_paid';
      }
    } else if (newStageId === 'delivery' || newStageId === 'paid') {
      nextDepositStatus = 'fully_paid';
    }

    onUpdateCommission({
      ...commission,
      stage: newStageId,
      depositStatus: nextDepositStatus,
      hasWatermarkPreview: newStageId !== 'delivery' && newStageId !== 'paid',
    });
  };

  const handleDepositStatusToggle = (status: 'unpaid' | 'deposit_paid' | 'fully_paid') => {
    onUpdateCommission({
      ...commission,
      depositStatus: status,
      hasWatermarkPreview: status !== 'fully_paid',
    });
  };

  const handleAdjustRevisions = (delta: number) => {
    const nextVal = Math.max(0, commission.revisionsUsed + delta);
    onUpdateCommission({
      ...commission,
      revisionsUsed: nextVal,
    });
  };

  const handleShareProgress = async () => {
    const normalized = normalizeStage(commission.stage);
    const stageInfo = STAGES_FLOW.find((s) => s.id === normalized);

    const message = `Hello ${commission.clientName}! Here is the latest project update for your "${commission.serviceTitle}":
• Current Stage: ${stageInfo?.label} (${stageInfo?.subtitle})
• Status: ${commission.depositStatus === 'fully_paid' ? '100% Fully Paid' : commission.depositStatus === 'deposit_paid' ? '50% Deposit Paid' : 'Awaiting Deposit'}
• Target Delivery: ${commission.deadline}
• Revisions: ${commission.revisionsUsed}/${commission.maxRevisions} Used
Thank you for creating with Mukami Creative Studio!`;

    await shareToAndroidOrWeb({
      title: `Project Progress: ${commission.clientName}`,
      text: message,
    });
  };

  const cleanPhone = commission.clientContact.replace(/[^\d+]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
    `Hello ${commission.clientName}, this is Mukami Creative Studio regarding your ${commission.serviceTitle} commission.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-6 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Glow */}
        <div className="absolute -top-24 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between relative border-b border-zinc-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
                #{commission.id}
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-md">
                {commission.category}
              </span>
              <span
                className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md ${
                  commission.depositStatus === 'fully_paid'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : commission.depositStatus === 'deposit_paid'
                    ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {commission.depositStatus === 'fully_paid'
                  ? '100% Fully Paid'
                  : commission.depositStatus === 'deposit_paid'
                  ? '50% Deposit Paid'
                  : 'Awaiting 50% Deposit'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              {commission.clientName}
            </h2>
            <p className="text-xs text-zinc-300">
              {commission.serviceTitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROMINENT VISUAL PROJECT STATUS STEPPER */}
        <div className="space-y-2">
          <ProjectStatusStepper
            currentStage={commission.stage}
            onStageChange={handleStageChange}
            isInteractive={true}
            showGuidance={true}
          />
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1">
          {/* Left Column: Financials & Payment Milestones */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  Financial Breakdown
                </span>
                <span className="text-xs font-bold text-white font-mono">{priceDisplay}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800/80 space-y-1">
                  <div className="text-[11px] text-zinc-400">Milestone 1: 50% Deposit</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {depositDisplay}
                  </div>
                  <div className="text-[10px] text-zinc-500">Required before sketching</div>
                </div>

                <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800/80 space-y-1">
                  <div className="text-[11px] text-zinc-400">Milestone 2: Final Balance</div>
                  <div className="text-sm font-bold text-amber-400 font-mono">
                    {balanceDisplay}
                  </div>
                  <div className="text-[10px] text-zinc-500">Due before clean release</div>
                </div>
              </div>

              {/* Deposit Status Setter */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold text-zinc-400">
                  Update Payment Status:
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-semibold">
                  <button
                    onClick={() => handleDepositStatusToggle('unpaid')}
                    className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                      commission.depositStatus === 'unpaid'
                        ? 'bg-rose-500 text-white font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Unpaid
                  </button>
                  <button
                    onClick={() => handleDepositStatusToggle('deposit_paid')}
                    className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                      commission.depositStatus === 'deposit_paid'
                        ? 'bg-amber-400 text-black font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    50% Deposit
                  </button>
                  <button
                    onClick={() => handleDepositStatusToggle('fully_paid')}
                    className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                      commission.depositStatus === 'fully_paid'
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    100% Paid
                  </button>
                </div>
              </div>
            </div>

            {/* Revision Limit Tracker */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Revision Scope Tracker</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Contract allows {commission.maxRevisions} free revision. Extra: KSh 300 / $3 each.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAdjustRevisions(-1)}
                  disabled={commission.revisionsUsed === 0}
                  className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm text-white px-2">
                  {commission.revisionsUsed} / {commission.maxRevisions}
                </span>
                <button
                  onClick={() => handleAdjustRevisions(1)}
                  className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-amber-400 flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Client & Project Details */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3 text-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Client Contact & Timeline
              </span>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-zinc-200">{commission.clientContact}</span>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg font-semibold text-[11px] transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="text-zinc-300">Target Delivery:</span>
                  </div>
                  <span className="font-mono font-bold text-white">{commission.deadline}</span>
                </div>
              </div>

              {/* Brief & Notes */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-zinc-400">Brief & Requirements:</span>
                <p className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800/80 text-zinc-300 italic text-[11px] leading-relaxed">
                  "{commission.notes}"
                </p>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShareProgress}
                className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Share Progress</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenContractBuilder(commission);
                }}
                className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>AI Contract</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <button
            onClick={() => {
              onClose();
              onOpenWatermarkDemo();
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Preview Watermark Protection Simulator →</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
