import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Copy, Check, Sparkles, Target, Calendar, ArrowRight, Lightbulb, Share2 } from 'lucide-react';
import { INITIAL_ROADMAP_TASKS, FIRST_10_CUSTOMERS_PLAYBOOK } from '../data/initialData';
import { RoadmapTask, Currency } from '../types';
import { shareToAndroidOrWeb } from '../utils/androidShare';

interface RoadmapViewProps {
  currency: Currency;
  onOpenPricing: () => void;
  onOpenAiStudio: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  currency,
  onOpenPricing,
  onOpenAiStudio,
}) => {
  const [tasks, setTasks] = useState<RoadmapTask[]>(() => {
    const saved = localStorage.getItem('mukami_roadmap_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ROADMAP_TASKS;
      }
    }
    return INITIAL_ROADMAP_TASKS;
  });

  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);
  const [selectedPlaybookIndex, setSelectedPlaybookIndex] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('mukami_roadmap_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitchId(id);
    setTimeout(() => setCopiedPitchId(null), 2500);
  };

  const filteredTasks = tasks.filter((t) => t.week === activeWeek);

  return (
    <div className="space-y-12 py-6">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <span>01. Execution Blueprint</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>From Scratch to Paying Customers</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              The 30-Day Launch Roadmap
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              Do not wait until everything is perfect before starting. Follow this four-week sprint to create your 8-piece portfolio, set up Kenyan payment rails, and secure your first 10 paying customers.
            </p>
          </div>

          {/* Interactive Progress Meter */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl min-w-[240px]">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-zinc-400">Launch Readiness</span>
              <span className="text-amber-400 tabular-nums">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-zinc-500 mt-2 text-right tabular-nums">
              {completedCount} of {tasks.length} strategic milestones checked
            </div>
          </div>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-800 no-scrollbar">
        {[
          { week: 1, label: 'Week 1', title: 'Portfolio & Artwork (8 Pieces)' },
          { week: 2, label: 'Week 2', title: 'Social Media & M-Pesa Setup' },
          { week: 3, label: 'Week 3', title: 'Commission Workflow & First 5 Leads' },
          { week: 4, label: 'Week 4', title: 'Deliveries, Reviews & 10 Customers' },
        ].map((item) => (
          <button
            key={item.week}
            onClick={() => setActiveWeek(item.week)}
            className={`px-4 py-3 text-left rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
              activeWeek === item.week
                ? 'bg-amber-400/10 border-amber-400/60 text-white'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <div className="text-xs font-bold text-amber-400">{item.label}</div>
            <div className="text-xs font-medium text-zinc-300 mt-0.5">{item.title}</div>
          </button>
        ))}
      </div>

      {/* Tasks List for the Active Week */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-5 rounded-2xl border transition-all ${
              task.isCompleted
                ? 'bg-zinc-900/40 border-emerald-900/40 text-zinc-400'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-100 shadow-md hover:border-zinc-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                title={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {task.isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-zinc-500" />
                )}
              </button>
              <div className="flex-1">
                <h3
                  className={`text-base font-bold leading-snug cursor-pointer ${
                    task.isCompleted ? 'line-through text-zinc-500' : 'text-white'
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mt-3">{task.description}</p>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
              <div className="flex items-start gap-1.5 text-xs text-amber-300">
                <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
                <span className="font-medium">{task.actionableStep}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-zinc-500">
                <span>Tools:</span>
                {task.resources.map((res, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-zinc-400">{res}</span>
                    {idx < task.resources.length - 1 && <span className="text-zinc-600">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The 8 Core Portfolio Pieces Grid (Week 1 Reference) */}
      {activeWeek === 1 && (
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                The 8 Core Starter Pieces to Build
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Having these 8 exact samples ready ensures you can answer every prospective client with immediate proof.
              </p>
            </div>
            <button
              onClick={onOpenAiStudio}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-lg cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Sample Brief
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { num: '1', title: 'Luxury Birthday Poster', detail: 'Gold & black theme, glamorous typography' },
              { num: '2', title: 'Female Digital Portrait', detail: 'Warm lighting, stylized skin tones' },
              { num: '3', title: 'Male Character / Avatar', detail: 'Clean lines, bold tech/executive profile' },
              { num: '4', title: 'Romantic Couple Portrait', detail: 'Golden hour ambient glow, fine art feel' },
              { num: '5', title: 'Pet Illustration', detail: 'Golden retriever or cat, charming textured fur' },
              { num: '6', title: 'Business / Event Flyer', detail: 'Corporate layout, tech startup or restaurant' },
              { num: '7', title: 'YouTube Thumbnail', detail: 'High contrast, bold title cutout, clickable' },
              { num: '8', title: 'Aesthetic Phone Wallpaper', detail: 'Minimalist fluid gradients, sellable print' },
            ].map((item) => (
              <div key={item.num} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold">
                  <span>#{item.num}</span>
                  <span className="text-white font-semibold">{item.title}</span>
                </div>
                <div className="text-[11px] text-zinc-400">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* First 10 Customers Playbook & Pitch Generator */}
      <div className="p-6 md:p-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Target Acquisition Playbook</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>How to Land Your First 10 Clients</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
            Direct Outreach Scripts for Kenyan & Global Leads
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl">
            Never post and simply wait. Pick one of these four high-conversion customer segments, copy the script, customize the bracketed names, and send 5 direct messages per day.
          </p>
        </div>

        {/* Playbook Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 no-scrollbar">
          {FIRST_10_CUSTOMERS_PLAYBOOK.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedPlaybookIndex(idx)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedPlaybookIndex === idx
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800'
              }`}
            >
              {item.segment.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Active Pitch Card */}
        {(() => {
          const activeItem = FIRST_10_CUSTOMERS_PLAYBOOK[selectedPlaybookIndex];
          const isCopied = copiedPitchId === activeItem.id;
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-zinc-950 p-5 md:p-6 rounded-xl border border-zinc-800">
              <div className="lg:col-span-4 space-y-3">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Target Customer Group
                </div>
                <div className="text-base font-bold text-white">{activeItem.segment}</div>
                <div className="space-y-2 pt-2">
                  <div className="text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-200">Revenue Potential:</span>{' '}
                    <span className="text-emerald-400 font-mono tabular-nums font-bold">
                      {currency === 'KSH' ? activeItem.potentialRevenue : '$60 - $250'}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    <span className="font-semibold text-zinc-200">Strategic Angle:</span>{' '}
                    {activeItem.whyItWorks}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col justify-between space-y-4 bg-zinc-900/70 p-4 sm:p-5 rounded-xl border border-zinc-800">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-400">
                      Ready-to-Send WhatsApp / DM Pitch Script
                    </span>
                    <span className="text-[11px] text-zinc-500">Edit [brackets] before sending</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 font-mono leading-relaxed bg-zinc-950/80 p-3.5 rounded-lg border border-zinc-800/80 select-all">
                    {activeItem.actionPitch}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-zinc-400">
                    Best send times: 10:00 AM or 7:30 PM EAT
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(activeItem.actionPitch, activeItem.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-black" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-black" />
                          <span>Copy Pitch</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        shareToAndroidOrWeb({
                          title: `Client Pitch - ${activeItem.segment}`,
                          text: activeItem.actionPitch,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors cursor-pointer"
                      title="Share directly via Android native share sheet to WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Share to Android</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
