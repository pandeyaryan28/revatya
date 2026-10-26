import React from 'react';
import { VISION_CONTENT } from '../data/siteContent';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PlanetaryCardSection } from '../components/ui/PlanetaryCardSection';
import { PageMeta } from '../components/seo/PageMeta';

export const VisionPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28 pb-16">
      <PageMeta pageKey="vision" />
      {/* HERO */}
      <ScrollReveal variant="fade-up">
        <header data-hero-section="true" className="max-w-3xl space-y-6 pt-4">
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-[#A1A1AA]">
            {VISION_CONTENT.hero.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-950 dark:text-[#F5F5F7] leading-[1.06]">
            {VISION_CONTENT.hero.headline}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
            {VISION_CONTENT.hero.body}
          </p>
        </header>
      </ScrollReveal>

      {/* THE PROBLEM WE ARE EXPLORING WITH BESPOKE VISUAL */}
      <ScrollReveal variant="scale-glass">
        <GlassCard padding="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-slate-400 dark:text-[#71717A]">
                CONTEXT
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
                {VISION_CONTENT.problemWeAreExploring.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                {VISION_CONTENT.problemWeAreExploring.body}
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#04060A] border border-slate-900/10 dark:border-white/[0.1]">
                <img
                  src={VISION_CONTENT.problemWeAreExploring.image.src}
                  alt={VISION_CONTENT.problemWeAreExploring.image.alt}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* 7 GUIDING PRINCIPLES */}
      <section className="space-y-12">
        <ScrollReveal variant="fade-up">
          <SectionHeader
            eyebrow="ARCHITECTURAL ETHOS"
            title="Seven guiding principles."
            description="These rules govern how Revatya conducts research, frames engineering problems, and communicates progress."
          />
        </ScrollReveal>

        <PlanetaryCardSection
          variant="card"
          orbitLabel="SEVEN GUIDING PRINCIPLES ORBIT"
          itemIds={VISION_CONTENT.principles.map((p) => p.number)}
        >
          {VISION_CONTENT.principles.map((principle) => (
            <GlassCard key={principle.number} className="space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-slate-400 dark:text-[#71717A]">
                  PRINCIPLE {principle.number}
                </span>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
                  {principle.title}
                </h3>
                <p className="text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </PlanetaryCardSection>
      </section>

      {/* WHAT SUCCESS COULD LOOK LIKE */}
      <ScrollReveal variant="scale-glass">
        <GlassCard padding="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-slate-400 dark:text-[#71717A]">
                LONG TERM OUTCOME
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
                {VISION_CONTENT.whatSuccessCouldLookLike.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                {VISION_CONTENT.whatSuccessCouldLookLike.body}
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#04060A] border border-slate-900/10 dark:border-white/[0.1]">
                <img
                  src={VISION_CONTENT.whatSuccessCouldLookLike.image.src}
                  alt={VISION_CONTENT.whatSuccessCouldLookLike.image.alt}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
};
