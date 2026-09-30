import React from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Palette,
  RefreshCw,
  Send,
  CheckCircle2,
  Check,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { CommissionStage } from '../types';

export interface StageDefinition {
  id: 'lead' | 'deposit' | 'draft' | 'revisions' | 'delivery' | 'paid';
  stepNumber: number;
  label: string;
  subtitle: string;
  description: string;
  actionPrompt: string;
  icon: React.ComponentType<{ className?: string }>;
  recommendedDepositStatus: 'unpaid' | 'deposit_paid' | 'fully_paid';
}

export const STAGES_FLOW: StageDefinition[] = [
  {
    id: 'lead',
    stepNumber: 1,
    label: 'Lead',
    subtitle: 'Inquiry & Scope',
    description: 'Initial inquiry received via WhatsApp/DM. Clarify requirements, dimensions, reference photos, and timeline.',
    actionPrompt: 'Send formal quote & request 50% commitment deposit',
    icon: MessageSquare,
    recommendedDepositStatus: 'unpaid',
  },
  {
    id: 'deposit',
    stepNumber: 2,
    label: 'Deposit',
    subtitle: '50% Secured',
    description: '50% upfront payment received via M-Pesa or USD. Production officially scheduled and materials prepared.',
    actionPrompt: 'Begin composition sketching & digital artwork',
    icon: ShieldCheck,
    recommendedDepositStatus: 'deposit_paid',
  },
  {
    id: 'draft',
    stepNumber: 3,
    label: 'Draft',
    subtitle: 'Watermarked Preview',
    description: 'First draft completed. Rendered with diagonal security watermark to protect IP while gathering client thoughts.',
    actionPrompt: 'Share watermarked draft for client review',
    icon: Palette,
    recommendedDepositStatus: 'deposit_paid',
  },
  {
    id: 'revisions',
    stepNumber: 4,
    label: 'Revisions',
    subtitle: 'Polishing & Feedback',
    description: 'Incorporate client feedback within contract policy (1 included revision). Extra changes incur KSh 300 fee.',
    actionPrompt: 'Finalize artwork & request remaining 50% balance',
    icon: RefreshCw,
    recommendedDepositStatus: 'deposit_paid',
  },
  {
    id: 'delivery',
    stepNumber: 5,
    label: 'Final Delivery',
    subtitle: 'High-Res Clean Art',
    description: 'Remaining 50% balance verified. High-resolution 300 DPI clean unwatermarked files (PNG/PDF) delivered.',
    actionPrompt: 'Deliver download link & request client review/testimonial',
    icon: Send,
    recommendedDepositStatus: 'fully_paid',
  },
  {
    id: 'paid',
    stepNumber: 6,
    label: 'Paid',
    subtitle: '100% Settled & Closed',
    description: 'Transaction 100% completed. Commercial license certificate released and order archived in accounting ledger.',
    actionPrompt: 'Order closed. Archived in studio revenue ledger',
    icon: CheckCircle2,
    recommendedDepositStatus: 'fully_paid',
  },
];

/**
 * Normalizes legacy or non-standard stages to the standard 6 stages
 */
export function normalizeStage(stage: string): StageDefinition['id'] {
  if (stage === 'lead' || stage === 'inquiry') return 'lead';
  if (stage === 'deposit') return 'deposit';
  if (stage === 'draft' || stage === 'draft_review') return 'draft';
  if (stage === 'revisions' || stage === 'revision') return 'revisions';
  if (stage === 'delivery' || stage === 'final_delivery') return 'delivery';
  if (stage === 'paid' || stage === 'completed') return 'paid';
  return 'lead';
}

interface ProjectStatusStepperProps {
  currentStage: CommissionStage;
  onStageChange?: (newStage: StageDefinition['id']) => void;
  isInteractive?: boolean;
  compact?: boolean;
  showGuidance?: boolean;
}

export const ProjectStatusStepper: React.FC<ProjectStatusStepperProps> = ({
  currentStage,
  onStageChange,
  isInteractive = true,
  compact = false,
  showGuidance = true,
}) => {
  const activeNormalizedId = normalizeStage(currentStage);
  const activeIndex = STAGES_FLOW.findIndex((s) => s.id === activeNormalizedId);
  const activeStage = STAGES_FLOW[activeIndex] || STAGES_FLOW[0];

  const handleStepClick = (stageId: StageDefinition['id']) => {
    if (isInteractive && onStageChange) {
      onStageChange(stageId);
    }
  };

  const handleNext = () => {
    if (activeIndex < STAGES_FLOW.length - 1 && onStageChange) {
      onStageChange(STAGES_FLOW[activeIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0 && onStageChange) {
      onStageChange(STAGES_FLOW[activeIndex - 1].id);
    }
  };

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 font-medium">Stage Progress:</span>
          <span className="font-bold text-amber-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {activeStage.label} ({activeIndex + 1} of 6)
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1 h-2 bg-zinc-950 rounded-full p-0.5 border border-zinc-800/80 overflow-hidden">
          {STAGES_FLOW.map((s, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStepClick(s.id)}
                disabled={!isInteractive}
                className={`h-full rounded-sm transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'bg-zinc-800/60 hover:bg-zinc-700'
                }`}
                title={`Step ${idx + 1}: ${s.label}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Visual Stepper Track (Horizontal on tablet/desktop, wrapped scroll on mobile) */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-inner">
        {/* Ambient track glow behind current step */}
        <div
          className="absolute -top-12 h-28 w-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none transition-all duration-500"
          style={{ left: `${Math.max(5, Math.min(90, (activeIndex / 5) * 100))}%` }}
        />

        {/* Stepper Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              Project Status Stepper
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-400">
              Stage <strong className="text-white">{activeIndex + 1}</strong> of 6
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md font-mono ${
                activeStage.id === 'paid'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-400/20 text-amber-400 border border-amber-400/30 animate-pulse'
              }`}
            >
              {activeStage.id === 'paid' ? 'COMPLETED' : 'IN PROGRESS'}
            </span>
          </div>
        </div>

        {/* Stepper Steps Row */}
        <div className="relative">
          {/* Connector Line Background */}
          <div className="hidden sm:block absolute top-6 left-6 right-6 h-0.5 bg-zinc-800 pointer-events-none" />

          {/* Active Connector Progress Line */}
          <div
            className="hidden sm:block absolute top-6 left-6 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500 pointer-events-none"
            style={{
              width: `${(activeIndex / (STAGES_FLOW.length - 1)) * 100}%`,
              maxWidth: 'calc(100% - 48px)',
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2 relative z-10">
            {STAGES_FLOW.map((stage, idx) => {
              const Icon = stage.icon;
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isFuture = idx > activeIndex;

              return (
                <button
                  key={stage.id}
                  onClick={() => handleStepClick(stage.id)}
                  disabled={!isInteractive}
                  className={`flex flex-col items-center text-center p-2.5 sm:p-2 rounded-xl transition-all cursor-pointer group relative ${
                    isCurrent
                      ? 'bg-amber-400/10 border border-amber-400/40 shadow-lg'
                      : isPast
                      ? 'hover:bg-zinc-900 border border-transparent hover:border-zinc-800'
                      : 'opacity-70 hover:opacity-100 hover:bg-zinc-900/50'
                  }`}
                >
                  {/* Step Bubble / Icon */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                      isPast
                        ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-amber-400 text-black shadow-amber-400/30 scale-105 ring-4 ring-amber-400/20 font-bold'
                        : 'bg-zinc-900 border border-zinc-700 text-zinc-400 group-hover:border-zinc-500 group-hover:text-zinc-200'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="mt-2.5 space-y-0.5">
                    <div className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
                      Step 0{stage.stepNumber}
                    </div>
                    <div
                      className={`text-xs font-bold truncate max-w-[110px] ${
                        isCurrent
                          ? 'text-amber-400'
                          : isPast
                          ? 'text-white'
                          : 'text-zinc-400 group-hover:text-zinc-300'
                      }`}
                    >
                      {stage.label}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate max-w-[110px] hidden sm:block">
                      {stage.subtitle}
                    </div>
                  </div>

                  {/* Mobile indicator pill */}
                  {isCurrent && (
                    <span className="sm:hidden mt-1 px-1.5 py-0.2 bg-amber-400/20 text-amber-400 text-[9px] font-bold rounded">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Stage Guidance & Advance Controls */}
      {showGuidance && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <h4 className="text-sm font-bold text-white font-display">
                Current Stage: {activeStage.label} — {activeStage.subtitle}
              </h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {activeStage.description}
            </p>
            <div className="text-xs font-semibold text-amber-400/90 flex items-center gap-1.5 pt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Recommended Next Step: {activeStage.actionPrompt}</span>
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          {isInteractive && onStageChange && (
            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                  activeIndex === 0
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
                title="Revert to previous stage"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={activeIndex === STAGES_FLOW.length - 1}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm ${
                  activeIndex === STAGES_FLOW.length - 1
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : 'bg-amber-400 hover:bg-amber-300 text-black hover:shadow-amber-400/20 active:scale-[0.98]'
                }`}
              >
                {activeIndex === STAGES_FLOW.length - 1 ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Project Complete</span>
                  </>
                ) : (
                  <>
                    <span>Advance to {STAGES_FLOW[activeIndex + 1].label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
