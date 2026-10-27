import React from 'react';
import { PageMeta } from '../components/seo/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PlanetaryCardSection } from '../components/ui/PlanetaryCardSection';
import { HeroSection } from '../components/ui/HeroSection';
import { UPDATES_CONTENT } from '../data/siteContent';
import { Clock, CheckSquare } from 'lucide-react';

export const UpdatesPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      <PageMeta pageKey="updates" />

      {/* Hero Section */}
      <HeroSection
        eyebrow={UPDATES_CONTENT.hero.eyebrow}
        headline={UPDATES_CONTENT.hero.headline}
        body={UPDATES_CONTENT.hero.body}
      />

      {/* Honest Empty State */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="scale-in">
          <GlassCard variant="elevated" className="p-8 sm:p-14 text-center">
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/[0.05] dark:bg-white/[0.06] border border-slate-900/10 dark:border-white/[0.1] text-slate-800 dark:text-zinc-200">
                <Clock className="h-7 w-7" />
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-zinc-400">
                STAGE 01 FOUNDATIONAL RESEARCH IN PROGRESS
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                {UPDATES_CONTENT.emptyStateTitle}
              </h2>
              <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-zinc-200">
                {UPDATES_CONTENT.emptyStateBody}
              </p>
              <p className="text-base leading-relaxed text-slate-600 dark:text-zinc-400">
                {UPDATES_CONTENT.emptyStateExplanation}
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <AppleButton href="/roadmap" variant="primary" size="md" withArrow>
                  Review Stage 01 to 05 Roadmap
                </AppleButton>
                <AppleButton href="/contact" variant="secondary" size="md">
                  Contact the Programme Team
                </AppleButton>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>

      {/* Update Schema Specification */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <SectionHeader
            eyebrow="ACCOUNTABILITY PROTOCOL"
            headline="How every future update entry is structured."
            body="To prevent exaggeration, every milestone entry published on this page is required to document seven explicit fields, including what remains uncertain."
          />
        </ScrollReveal>

        <PlanetaryCardSection
          variant="card"
          orbitLabel="ACCOUNTABILITY PROTOCOL ORBIT"
          itemIds={UPDATES_CONTENT.updateSchemaFields.map((f) => f.label)}
          className="mt-10"
        >
          {UPDATES_CONTENT.updateSchemaFields.map((field, index) => (
            <GlassCard key={field.label} className="p-6 h-full">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  FIELD 0{index + 1}
                </span>
                <CheckSquare className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                {field.label}
              </h3>
              <p className="mt-2 text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
                {field.description}
              </p>
            </GlassCard>
          ))}
        </PlanetaryCardSection>
      </section>
    </div>
  );
};

export default UpdatesPage;
