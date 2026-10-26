import React from 'react';
import { Zap, Anchor, Cpu, ShieldCheck } from 'lucide-react';
import { HOME_CONTENT } from '../../data/siteContent';
import { GlassCard } from '../ui/GlassCard';

export const OrbitalValueFlowDiagram: React.FC = () => {
  const utilityNodes = [
    { label: 'Solar & Thermal Spine', metric: 'Shared MW Bus', icon: Zap },
    { label: 'Standard Berthing Ring', metric: 'Common Port Spec', icon: Anchor },
    { label: 'Optical Data & Telemetry', metric: 'Redundant Mesh', icon: Cpu },
    { label: 'Closed Loop Life Support', metric: 'Centralised ECLSS', icon: ShieldCheck },
  ];

  return (
    <GlassCard padding="lg" variant="elevated">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/[0.1] bg-[#04060B] aspect-video">
          <img
            src={HOME_CONTENT.economicThesis.image.src}
            alt={HOME_CONTENT.economicThesis.image.alt}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-5">
          <span className="font-mono-tech text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 block font-semibold">
            SHARED UTILITY ARCHITECTURE
          </span>
          <h3 className="font-serif-display text-2xl sm:text-3xl text-slate-950 dark:text-[#F5F5F7]">
            Amortising Orbital Infrastructure Across Commercial & Institutional Operators
          </h3>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed">
            Instead of every orbital mission launching its own isolated power array, radiator wing, and attitude control bus, Revatya centralises core utilities and allocates standardised capacity to visiting vehicles and resident modules.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {utilityNodes.map((node) => {
              const IconComp = node.icon;
              return (
                <div
                  key={node.label}
                  className="p-3.5 rounded-2xl bg-slate-900/5 dark:bg-white/[0.04] border border-slate-900/8 dark:border-white/[0.08] flex items-start gap-3"
                >
                  <IconComp className="w-5 h-5 text-slate-900 dark:text-zinc-200 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-[#F5F5F7]">
                      {node.label}
                    </div>
                    <div className="font-mono-tech text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      {node.metric}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
