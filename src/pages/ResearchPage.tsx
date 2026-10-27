import React, { useState } from 'react';
import { HelpCircle, Microscope, CheckCircle2, Layers } from 'lucide-react';
import {
  RESEARCH_STATUS_FRAMEWORK,
  RESEARCH_PROGRAMMES,
  LONG_HORIZON_PROSPECTING_BRIEF,
  ResearchEpistemicStatus,
} from '../data/siteContent';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal, StaggerGroup } from '../components/ui/ScrollReveal';
import { PlanetaryCardSection } from '../components/ui/PlanetaryCardSection';
import { PageMeta } from '../components/seo/PageMeta';
import { HeroSection } from '../components/ui/HeroSection';

export const ResearchPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<ResearchEpistemicStatus | 'ALL'>('ALL');

  const filteredProgrammes =
    selectedStatus === 'ALL'
      ? RESEARCH_PROGRAMMES
      : RESEARCH_PROGRAMMES.filter((prog) => prog.epistemicStatus === selectedStatus);

  return (
    <div className="space-y-20 md:space-y-28 pb-16">
      <PageMeta pageKey="research" />
      {/* HERO */}
      <HeroSection
        eyebrow="RESEARCH & VALIDATION"
        headline="Separating established science from open hypotheses."
        body="Every technical claim at Revatya is categorized into one of six epistemic statuses so collaborators, engineers, and reviewers can distinguish established orbital literature from internal architectural hypotheses."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
        {/* 6 EPISTEMIC STATUS FRAMEWORK & INTERACTIVE FILTER */}
      <section className="space-y-8">
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-slate-400 dark:text-[#71717A]">
                EPISTEMIC TAXONOMY
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
                Six level epistemic status framework.
              </h2>
            </div>
            {selectedStatus !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedStatus('ALL')}
                className="text-xs font-mono uppercase tracking-[0.14em] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-950 dark:hover:text-[#F5F5F7] underline underline-offset-4 cursor-pointer"
              >
                Reset filter (Show all {RESEARCH_PROGRAMMES.length})
              </button>
            )}
          </div>
        </ScrollReveal>

        <StaggerGroup
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          staggerMs={65}
        >
          {RESEARCH_STATUS_FRAMEWORK.map((item) => {
            const isSelected = selectedStatus === item.status;
            const count = RESEARCH_PROGRAMMES.filter((p) => p.epistemicStatus === item.status).length;
            return (
              <button
                key={item.status}
                type="button"
                onClick={() =>
                  setSelectedStatus((prev) => (prev === item.status ? 'ALL' : item.status))
                }
                aria-pressed={isSelected}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-950 text-white border-slate-950 dark:bg-[#F5F5F7] dark:text-[#020305] dark:border-[#F5F5F7]'
                    : 'bg-white/75 dark:bg-[#0B0E14]/85 border-slate-900/[0.08] dark:border-white/[0.07] hover:border-slate-900/20 dark:hover:border-white/[0.18]'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-mono font-semibold uppercase tracking-[0.14em] ${
                        isSelected
                          ? 'text-white dark:text-[#020305]'
                          : 'text-slate-900 dark:text-[#F5F5F7]'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span
                      className={`text-xs font-mono ${
                        isSelected
                          ? 'text-white/70 dark:text-[#020305]/70'
                          : 'text-slate-400 dark:text-[#71717A]'
                      }`}
                    >
                      {count} {count === 1 ? 'programme' : 'programmes'}
                    </span>
                  </div>
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      isSelected
                        ? 'text-white/85 dark:text-[#020305]/80'
                        : 'text-slate-600 dark:text-[#A1A1AA]'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </StaggerGroup>
      </section>

      {/* 8 RESEARCH PROGRAMMES WITH BESPOKE ENGINEERING VISUALS */}
      <section className="space-y-8">
        <ScrollReveal variant="fade-up">
          <div className="flex items-center justify-between border-b border-slate-900/[0.08] dark:border-white/[0.07] pb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
              Active & Planned Research Programmes ({filteredProgrammes.length})
            </h2>
            <span className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 dark:text-[#71717A]">
              Filter: {selectedStatus}
            </span>
          </div>
        </ScrollReveal>

        <PlanetaryCardSection
          variant="dossier"
          orbitLabel="RESEARCH PROGRAMMES ORBIT"
          itemIds={filteredProgrammes.map((prog) => prog.id)}
        >
          {filteredProgrammes.map((prog) => (
            <GlassCard key={prog.id} id={prog.id} padding="lg" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-slate-900/[0.08] dark:border-white/[0.07] pb-6">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-slate-500 dark:text-[#A1A1AA]">
                      {prog.code}
                    </span>
                    <span className="text-slate-300 dark:text-white/20">•</span>
                    <span className="text-xs font-mono uppercase tracking-[0.14em] text-slate-500 dark:text-[#A1A1AA]">
                      {prog.epistemicStatus}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
                    {prog.title}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                    {prog.summary}
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <figure className="relative rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/[0.1] bg-[#04060A]">
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      <img
                        src={prog.image.src}
                        alt={prog.image.alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </figure>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-slate-900 dark:text-[#F5F5F7]">
                    <Microscope className="w-4 h-4 text-slate-500 dark:text-[#A1A1AA]" />
                    <span>Established Background</span>
                  </div>
                  <p className="text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                    {prog.establishedBackground}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-slate-900 dark:text-[#F5F5F7]">
                    <Layers className="w-4 h-4 text-slate-500 dark:text-[#A1A1AA]" />
                    <span>Revatya Hypothesis</span>
                  </div>
                  <p className="text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                    {prog.revatyaHypothesis}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-slate-900/[0.08] dark:border-white/[0.07]">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-slate-900 dark:text-[#F5F5F7]">
                    <HelpCircle className="w-4 h-4 text-slate-500 dark:text-[#A1A1AA]" />
                    <span>Research Questions</span>
                  </div>
                  <ul className="space-y-2">
                    {prog.researchQuestions.map((q) => (
                      <li key={q} className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed flex items-start gap-2">
                        <span className="text-slate-400 dark:text-[#71717A]">?</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-mono uppercase tracking-[0.15em] text-slate-900 dark:text-[#F5F5F7]">
                    Concept Design Focus
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                    {prog.conceptDesignFocus}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-slate-900 dark:text-[#F5F5F7]">
                    <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-[#A1A1AA]" />
                    <span>Validation Requirements</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                    {prog.validationRequirements}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </PlanetaryCardSection>
      </section>

      {/* LONG HORIZON PROSPECTING BOUNDARY STUDY */}
      <ScrollReveal variant="fade-up">
        <GlassCard className="p-7 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-[#A1A1AA]">
                  {LONG_HORIZON_PROSPECTING_BRIEF.eyebrow}
                </span>
                <span className="text-slate-300 dark:text-white/20">•</span>
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-slate-500 dark:text-[#A1A1AA]">
                  {LONG_HORIZON_PROSPECTING_BRIEF.epistemicStatus}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
                {LONG_HORIZON_PROSPECTING_BRIEF.headline}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                {LONG_HORIZON_PROSPECTING_BRIEF.body}
              </p>
            </div>
            <div className="lg:col-span-6">
              <figure className="relative rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/[0.1] bg-[#04060A]">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={LONG_HORIZON_PROSPECTING_BRIEF.image.src}
                    alt={LONG_HORIZON_PROSPECTING_BRIEF.image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </figure>
            </div>
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal variant="scale-in">
        <GlassCard className="p-7 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
              Collaborate on Stage 01 & Stage 02 validation.
            </h2>
            <p className="text-base text-slate-600 dark:text-[#A1A1AA]">
              We work with university laboratories, extreme environment facilities, and domain specialists.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AppleButton href="/partners" variant="primary" withArrow>
              Partners & Collaborators
            </AppleButton>
            <AppleButton href="/join" variant="secondary">
              Join / Contribute
            </AppleButton>
          </div>
        </GlassCard>
      </ScrollReveal>
      </div>
    </div>
  );
};
