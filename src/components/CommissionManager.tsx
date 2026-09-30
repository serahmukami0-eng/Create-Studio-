import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Lock,
  Unlock,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Share2,
  FileSpreadsheet,
  Download,
  Eye,
} from 'lucide-react';
import { SAMPLE_COMMISSIONS, INITIAL_SERVICES } from '../data/initialData';
import { CommissionOrder, Currency } from '../types';
import { FinancialDashboard } from './FinancialDashboard';
import { shareToAndroidOrWeb } from '../utils/androidShare';
import { exportCommissionsToCSV, exportMonthlyReportToCSV } from '../utils/csvExport';
import { ProjectStatusStepper, normalizeStage, STAGES_FLOW } from './ProjectStatusStepper';
import { CommissionDetailsModal } from './CommissionDetailsModal';

interface CommissionManagerProps {
  currency: Currency;
  onOpenPricing: () => void;
}

export const CommissionManager: React.FC<CommissionManagerProps> = ({
  currency,
  onOpenPricing,
}) => {
  const [commissions, setCommissions] = useState<CommissionOrder[]>(() => {
    const saved = localStorage.getItem('mukami_commissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 6) {
          return parsed;
        }
      } catch (e) {
        return SAMPLE_COMMISSIONS;
      }
    }
    return SAMPLE_COMMISSIONS;
  });

  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'financial-dashboard' | 'watermark-demo' | 'contract-builder'
  >('pipeline');
  const [selectedCommission, setSelectedCommission] = useState<CommissionOrder>(commissions[0]);
  const [isWatermarked, setIsWatermarked] = useState<boolean>(true);

  // New Commission Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientContact, setNewClientContact] = useState<string>('');
  const [newServiceTitle, setNewServiceTitle] = useState<string>(INITIAL_SERVICES[0].title);
  const [newPrice, setNewPrice] = useState<number>(INITIAL_SERVICES[0].priceKSh);
  const [newDeadline, setNewDeadline] = useState<string>('2026-10-15');
  const [newNotes, setNewNotes] = useState<string>('');

  // AI Contract state
  const [contractText, setContractText] = useState<string>('');
  const [isGeneratingContract, setIsGeneratingContract] = useState<boolean>(false);
  const [copiedContract, setCopiedContract] = useState<boolean>(false);

  // CSV Export toast
  const [exportToast, setExportToast] = useState<string | null>(null);

  const handleExportCommissions = () => {
    const res = exportCommissionsToCSV(commissions, currency);
    if (res.success) {
      setExportToast(`CSV Downloaded: ${res.rowCount} commissions exported to ${res.fileName}`);
      setTimeout(() => setExportToast(null), 4000);
    }
  };

  const handleExportFinancials = () => {
    const res = exportMonthlyReportToCSV(commissions, currency);
    if (res.success) {
      setExportToast(`Financial CSV Downloaded: ${res.fileName}`);
      setTimeout(() => setExportToast(null), 4000);
    }
  };

  // Details Modal state
  const [detailsCommission, setDetailsCommission] = useState<CommissionOrder | null>(null);

  const saveCommissions = (updated: CommissionOrder[]) => {
    setCommissions(updated);
    localStorage.setItem('mukami_commissions', JSON.stringify(updated));
  };

  const handleUpdateCommission = (updated: CommissionOrder) => {
    const list = commissions.map((c) => (c.id === updated.id ? updated : c));
    saveCommissions(list);
    setDetailsCommission(updated);
  };

  const handleAdvanceStage = (id: string) => {
    const stageFlow: ('lead' | 'deposit' | 'draft' | 'revisions' | 'delivery' | 'paid')[] = [
      'lead',
      'deposit',
      'draft',
      'revisions',
      'delivery',
      'paid',
    ];

    const updated = commissions.map((c) => {
      if (c.id === id) {
        const normalized = normalizeStage(c.stage);
        const currentIndex = stageFlow.indexOf(normalized);
        const nextIndex = Math.min(stageFlow.length - 1, currentIndex + 1);
        const nextStage = stageFlow[nextIndex];

        let nextDepositStatus = c.depositStatus;
        if (nextStage === 'deposit' || nextStage === 'draft' || nextStage === 'revisions') {
          if (c.depositStatus === 'unpaid') {
            nextDepositStatus = 'deposit_paid';
          }
        } else if (nextStage === 'delivery' || nextStage === 'paid') {
          nextDepositStatus = 'fully_paid';
        }

        const updatedOrder: CommissionOrder = {
          ...c,
          stage: nextStage,
          depositStatus: nextDepositStatus,
          hasWatermarkPreview: nextStage !== 'delivery' && nextStage !== 'paid',
        };

        if (detailsCommission && detailsCommission.id === id) {
          setDetailsCommission(updatedOrder);
        }

        return updatedOrder;
      }
      return c;
    });

    saveCommissions(updated);
  };

  const handleAddCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;

    const matchingService = INITIAL_SERVICES.find((s) => s.title === newServiceTitle);
    const resolvedCategory = (matchingService?.category as any) || 'commissions';

    const newOrder: CommissionOrder = {
      id: `comm-${Date.now().toString().slice(-4)}`,
      clientName: newClientName,
      clientContact: newClientContact || '+254 700 000 000',
      serviceTitle: newServiceTitle,
      category: resolvedCategory,
      priceKSh: currency === 'KSH' ? newPrice : newPrice * 125,
      priceUSD: currency === 'USD' ? newPrice : Math.round(newPrice / 125),
      currency: currency,
      depositStatus: 'unpaid',
      stage: 'inquiry',
      revisionsUsed: 0,
      maxRevisions: 1,
      deadline: newDeadline,
      createdAt: new Date().toISOString().slice(0, 10),
      notes: newNotes || 'Customer requested commission via WhatsApp.',
      hasWatermarkPreview: true,
    };

    saveCommissions([newOrder, ...commissions]);
    setShowAddModal(false);
    setNewClientName('');
    setNewClientContact('');
    setNewNotes('');
  };

  const generateAiContract = async (comm: CommissionOrder) => {
    setIsGeneratingContract(true);
    setContractText('');
    try {
      const res = await fetch('/api/ai/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: comm.clientName,
          serviceName: comm.serviceTitle,
          price: (currency === 'KSH' ? comm.priceKSh : comm.priceUSD).toLocaleString(),
          currency: currency,
          revisions: comm.maxRevisions,
          turnaroundDays: 4,
          licenseType: 'Personal Celebration & Display License',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContractText(data.agreement);
      } else {
        setContractText('Failed to generate contract: ' + data.error);
      }
    } catch (err: any) {
      setContractText('Network error: ' + err.message);
    } finally {
      setIsGeneratingContract(false);
    }
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(contractText);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2500);
  };

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <span>03. Client Operations</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Security & Scope Governance</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Commission Pipeline & Security System
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              Eliminate unpaid invoices and endless redesigns. Track orders from initial inquiry to 50% deposit, watermarked draft review, and high-res clean delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCommissions}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded-xl transition-colors cursor-pointer"
              title="Export complete commission and financial ledger as a CSV file"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setActiveTab('financial-dashboard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded-xl transition-colors cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Earnings Analytics</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Commission Order</span>
            </button>
          </div>
        </div>

        {exportToast && (
          <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300 shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{exportToast}</span>
            </div>
            <button
              onClick={() => setExportToast(null)}
              className="text-emerald-400 hover:text-white font-mono cursor-pointer ml-4"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'pipeline'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-zinc-900'
          }`}
        >
          Active Pipeline ({commissions.length})
        </button>
        <button
          onClick={() => setActiveTab('financial-dashboard')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'financial-dashboard'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-zinc-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Financial Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('watermark-demo')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'watermark-demo'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-zinc-900'
          }`}
        >
          Watermark Security Simulator
        </button>
        <button
          onClick={() => {
            setActiveTab('contract-builder');
            if (!contractText) generateAiContract(selectedCommission);
          }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'contract-builder'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-zinc-900'
          }`}
        >
          AI Contract Agreement Generator
        </button>
      </div>

      {/* Tab 1: Pipeline View */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commissions.map((comm) => {
              const priceDisplay =
                currency === 'KSH'
                  ? `KSh ${comm.priceKSh.toLocaleString()}`
                  : `$${comm.priceUSD.toLocaleString()}`;

              const depositDisplay =
                currency === 'KSH'
                  ? `KSh ${Math.round(comm.priceKSh * 0.5).toLocaleString()}`
                  : `$${Math.round(comm.priceUSD * 0.5).toLocaleString()}`;

              return (
                <div
                  key={comm.id}
                  className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-500">#{comm.id}</span>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider ${
                          comm.depositStatus === 'fully_paid'
                            ? 'text-emerald-400'
                            : comm.depositStatus === 'deposit_paid'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {comm.depositStatus === 'fully_paid'
                          ? '100% Fully Paid'
                          : comm.depositStatus === 'deposit_paid'
                          ? '50% Deposit Paid'
                          : 'Awaiting 50% Deposit'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 
                          onClick={() => setDetailsCommission(comm)}
                          className="text-base font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          {comm.clientName}
                        </h3>
                        <button
                          onClick={() => setDetailsCommission(comm)}
                          className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          title="Open full Project Status Stepper and Commission Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">{comm.serviceTitle}</div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">{comm.clientContact}</div>
                    </div>

                    {/* Visual 6-Stage Progress Stepper Bar */}
                    <div className="pt-1">
                      <ProjectStatusStepper
                        currentStage={comm.stage}
                        compact={true}
                        isInteractive={false}
                      />
                    </div>

                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Total Fee:</span>
                        <span className="text-white font-mono font-bold">{priceDisplay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">50% Deposit:</span>
                        <span className="text-emerald-400 font-mono font-semibold">{depositDisplay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Deadline:</span>
                        <span className="text-zinc-300 font-mono">{comm.deadline}</span>
                      </div>
                      <div className="text-zinc-400 pt-1 text-[11px] italic line-clamp-1">"{comm.notes}"</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between text-xs">
                      <button
                        onClick={() => setDetailsCommission(comm)}
                        className="text-zinc-300 hover:text-white font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Project Status Stepper</span>
                        <span className="text-amber-400 font-bold">→</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCommission(comm);
                          setActiveTab('contract-builder');
                          generateAiContract(comm);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-medium text-[11px] cursor-pointer"
                      >
                        AI Contract
                      </button>
                    </div>

                    {(() => {
                      const normalized = normalizeStage(comm.stage);
                      const isComplete = normalized === 'paid';
                      return (
                        <button
                          onClick={() => handleAdvanceStage(comm.id)}
                          disabled={isComplete}
                          className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            isComplete
                              ? 'bg-zinc-800/70 text-emerald-400 border border-emerald-500/20 cursor-default'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                          }`}
                        >
                          {normalized === 'lead' && 'Confirm 50% Deposit Received →'}
                          {normalized === 'deposit' && 'Draft Ready (Send Watermarked) →'}
                          {normalized === 'draft' && 'Client Feedback (Start Revisions) →'}
                          {normalized === 'revisions' && 'Deliver High-Res Clean Art →'}
                          {normalized === 'delivery' && 'Confirm Final 50% Balance →'}
                          {normalized === 'paid' && '✓ Completed & 100% Paid'}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Financial Dashboard */}
      {activeTab === 'financial-dashboard' && (
        <FinancialDashboard
          commissions={commissions}
          currency={currency}
          onOpenPricing={onOpenPricing}
        />
      )}

      {/* Tab 2: Watermark Security Simulator */}
      {activeTab === 'watermark-demo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-zinc-900/80 border border-zinc-800 p-6 md:p-8 rounded-2xl">
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Why Watermarking is Essential
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Never send clean high-res artwork before final payment.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                A common beginner trap is creating artwork, sending the pristine PNG to the client for "feedback", and then having the client ghost without paying the remaining 50% balance.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <Lock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-white">Stage 1: Watermarked Low-Res Preview</span>
                  <p className="text-zinc-400 mt-0.5">
                    Send a 72 DPI preview with a repeating diagonal studio watermark. The client can clearly evaluate colors, facial likeness, and typography, but cannot print or post cleanly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <Unlock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-white">Stage 2: High-Res 300 DPI Clean Delivery</span>
                  <p className="text-zinc-400 mt-0.5">
                    Once the remaining 50% M-Pesa or PayPal balance confirms, immediately send the Google Drive link containing uncompressed 300 DPI print files.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsWatermarked(!isWatermarked)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isWatermarked
                    ? 'bg-amber-400 text-black hover:bg-amber-300'
                    : 'bg-emerald-500 text-black hover:bg-emerald-400'
                }`}
              >
                {isWatermarked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Current: Watermarked Draft (Click to simulate Final Payment)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Current: High-Res Clean Delivery (Click to re-apply Watermark)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right column: Interactive Visual Canvas */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 aspect-[3/4] max-w-sm mx-auto">
              <img
                src="/src/assets/images/birthday_luxury_poster_1790695964232.jpg"
                alt="Artwork Preview"
                className="w-full h-full object-cover select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* Watermark Overlay Layer */}
              {isWatermarked && (
                <div className="absolute inset-0 flex flex-col justify-around items-center overflow-hidden pointer-events-none select-none bg-black/20">
                  {[-30, -30, -30, -30].map((deg, i) => (
                    <div
                      key={i}
                      className="text-white/60 font-mono font-black text-xs sm:text-sm tracking-widest uppercase rotate-[-25deg] py-4 whitespace-nowrap bg-black/30 w-[150%] text-center border-y border-white/20 backdrop-blur-[1px]"
                    >
                      MUKAMI STUDIO · DRAFT PREVIEW · DO NOT DISTRIBUTE · PENDING BALANCE
                    </div>
                  ))}
                </div>
              )}

              {/* Status indicator bottom banner */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">
                  {isWatermarked ? 'Draft Review Mode' : 'Unlocked Master File'}
                </span>
                <span
                  className={`font-mono text-[11px] font-bold ${
                    isWatermarked ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {isWatermarked ? 'LOCKED (Deposit Paid)' : 'CLEAN (100% Paid)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI Contract Agreement Generator */}
      {activeTab === 'contract-builder' && (
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Freelance Agreement Builder</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                Executive Commission Terms for {selectedCommission.clientName}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automatically tailored with revision caps, intellectual property rights, and M-Pesa milestone terms.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => generateAiContract(selectedCommission)}
                disabled={isGeneratingContract}
                className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              >
                {isGeneratingContract ? 'Generating Agreement...' : 'Regenerate Agreement'}
              </button>

              {contractText && (
                <>
                  <button
                    onClick={handleCopyContract}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    {copiedContract ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-black" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-black" />
                        <span>Copy Terms</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      shareToAndroidOrWeb({
                        title: `Commission Agreement - ${selectedCommission.clientName}`,
                        text: contractText,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors cursor-pointer"
                    title="Share directly via Android native share sheet to WhatsApp or Email"
                  >
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Share to Android</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {isGeneratingContract ? (
            <div className="p-12 text-center text-zinc-400 space-y-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <Sparkles className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
              <div className="text-sm font-semibold text-white">Synthesizing protective agreement...</div>
              <div className="text-xs text-zinc-500">
                Formulating clauses for revisions, 50% deposit, and delivery licensing.
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap select-all max-h-[500px] overflow-y-auto">
              {contractText || 'Select a commission and click Generate Agreement.'}
            </div>
          )}
        </div>
      )}

      {/* Add Commission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white font-display">New Commission Order</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white text-lg font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCommission} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Client Name / Business *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Grace Njeri"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Phone / WhatsApp Contact</label>
                <input
                  type="text"
                  value={newClientContact}
                  onChange={(e) => setNewClientContact(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Artwork Package</label>
                  <select
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    {INITIAL_SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Agreed Fee ({currency})</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Target Delivery Date</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Client Brief / Specific Requests</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Gold background, 30th birthday, high-res PDF print..."
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-black bg-amber-400 hover:bg-amber-300 font-bold rounded-lg cursor-pointer"
                >
                  Add to Active Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Commission Details View & Project Status Stepper Modal */}
      <CommissionDetailsModal
        isOpen={!!detailsCommission}
        commission={detailsCommission}
        currency={currency}
        onClose={() => setDetailsCommission(null)}
        onUpdateCommission={handleUpdateCommission}
        onOpenContractBuilder={(comm) => {
          setSelectedCommission(comm);
          setActiveTab('contract-builder');
          generateAiContract(comm);
        }}
        onOpenWatermarkDemo={() => setActiveTab('watermark-demo')}
      />
    </div>
  );
};
