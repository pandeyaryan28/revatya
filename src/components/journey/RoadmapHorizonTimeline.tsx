import React, { useState } from 'react';
import { CheckCircle2, Layers } from 'lucide-react';
import { ROADMAP_STAGES, RoadmapStage } from '../../data/siteContent';
import { GlassCard } from '../ui/GlassCard';

interface RoadmapHorizonTimelineProps {
  stages?: RoadmapStage[];
  compact?: boolean;
}

export const RoadmapHorizonTimeline: React.FC<RoadmapHorizonTimelineProps> = ({
  stages = ROADMAP_STAGES,
  compact = false,
}) => {
  const [activeId, setActiveId] = useState<string>(stages[0]?.id ?? 'stage-01');

  const activeStage = stages.find((s) => s.id === activeId) ?? stages[0];

  return (
    <div className="space-y-6">
      {/* Horizontal Stage Progression Selector */}
      <div
        role="tablist"
        aria-label="Revatya Five Stage Development Horizon"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5"
      >
        {stages.map((stage) => {
          const isSelected = stage.id === activeId;
          return (
            <button
              key={stage.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveId(stage.id)}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer tactile-press flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-slate-950 text-white dark:bg-[#F5F5F7] dark:text-[#020305] border-slate-950 dark:border-white shadow-lg'
                  : 'liquid-glass border-slate-900/10 dark:border-white/[0.09] text-slate-800 dark:text-zinc-200 hover:border-slate-900/25 dark:hover:border-white/25'
              }`}
            >
              <span className="font-mono-tech text-xs uppercase tracking-wider font-semibold opacity-80">
                {stage.number}
              </span>
              <div className="font-serif-display text-lg sm:text-xl leading-snug">
                {stage.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Visual + Clean Technical Summary */}
      <GlassCard padding="none" variant="elevated" className="overflow-hidden border border-slate-900/12 dark:border-white/[0.12]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 6 Cols: Clean Bespoke Stage Environment Visualization (Zero Overlays or Captions) */}
          <div className="lg:col-span-6 relative bg-[#03050A] aspect-video lg:aspect-auto lg:min-h-[420px] overflow-hidden">
            <img
              key={activeStage.image.src}
              src={activeStage.image.src}
              alt={activeStage.image.alt}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </div>

          {/* Right 6 Cols: Stage Objective & Clean Breakdown */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white/85 dark:bg-[#070910]/95 border-t lg:border-t-0 lg:border-l border-slate-900/10 dark:border-white/[0.08]">
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="font-mono-tech text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 font-semibold">
                    {activeStage.number} · {activeStage.environmentTag}
                  </span>
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-[#F5F5F7]">
                  {activeStage.title}
                </h3>
                <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {activeStage.objective}
                </p>
              </div>

              {!compact ? (
                <div className="space-y-4 pt-4 border-t border-slate-900/10 dark:border-white/[0.08]">
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                    Primary Workstreams & Exit Gate
                  </span>
                  <ul className="space-y-2.5">
                    {activeStage.workstreams.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm sm:text-base text-slate-700 dark:text-zinc-200 leading-relaxed"
                      >
                        <Layers className="w-4 h-4 text-slate-900 dark:text-zinc-300 shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-3 text-sm sm:text-base text-slate-900 dark:text-[#F5F5F7] font-medium leading-relaxed pt-2 border-t border-slate-900/10 dark:border-white/[0.08]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                      <span>Exit Gate: {activeStage.exitCriteria}</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2.5 pt-3 border-t border-slate-900/10 dark:border-white/[0.08]">
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                    Phase Exit Gate & Primary Dependencies
                  </span>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-800 dark:text-zinc-200">
                      <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-zinc-300 shrink-0 mt-1" />
                      <span>{activeStage.exitCriteria}</span>
                    </li>
                    {activeStage.dependencies.slice(0, 1).map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm sm:text-base text-slate-600 dark:text-zinc-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-zinc-400 shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
