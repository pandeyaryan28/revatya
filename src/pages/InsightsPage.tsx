import React from 'react';
import { PageMeta } from '../components/seo/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PlanetaryCardSection } from '../components/ui/PlanetaryCardSection';
import { INSIGHTS_CONTENT } from '../data/siteContent';
import { FileText, BookOpen } from 'lucide-react';

export const InsightsPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      <PageMeta pageKey="insights" />

      {/* Hero Section */}
      <section data-hero-section="true" className="pt-16 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up" className="max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                {INSIGHTS_CONTENT.hero.eyebrow}
              </span>
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-[#F5F5F7] sm:text-6xl leading-[1.08]">
              {INSIGHTS_CONTENT.hero.headline}
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-zinc-300 max-w-3xl">
              {INSIGHTS_CONTENT.hero.body}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Honest Empty State Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="scale-in" delayMs={80}>
          <GlassCard variant="elevated" className="p-8 sm:p-14 text-center">
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/[0.05] dark:bg-white/[0.06] border border-slate-900/10 dark:border-white/[0.1] text-slate-800 dark:text-zinc-200">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-zinc-400">
                PUBLICATION ARCHIVE
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                {INSIGHTS_CONTENT.emptyStateTitle}
              </h2>
              <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-zinc-200">
                {INSIGHTS_CONTENT.emptyStateBody}
              </p>
              <p className="text-base leading-relaxed text-slate-600 dark:text-zinc-400">
                {INSIGHTS_CONTENT.emptyStateSubtext}
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <AppleButton href="/research" variant="primary" size="md" withArrow>
                  Explore Active Research Programmes
                </AppleButton>
                <AppleButton
                  href={`/contact?category=${encodeURIComponent('Technical or research collaboration')}`}
                  variant="secondary"
                  size="md"
                >
                  Propose a Co Authored Technical Brief
                </AppleButton>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>

      {/* Publication Specification */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <SectionHeader
            eyebrow="PUBLICATION STANDARD"
            headline="Required structure for every Revatya research brief."
            body="When research notes and engineering explainers are published, each entry follows a strict editorial and scientific metadata specification."
          />
        </ScrollReveal>

        <PlanetaryCardSection
          variant="card"
          orbitLabel="PUBLICATION SPECIFICATION ORBIT"
          itemIds={INSIGHTS_CONTENT.articleTemplateSpec.map((s) => s.field)}
          className="mt-10"
        >
          {INSIGHTS_CONTENT.articleTemplateSpec.map((spec) => (
            <GlassCard key={spec.field} className="p-6 h-full">
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-zinc-300">
                <FileText className="h-4 w-4" />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider">
                  {spec.field}
                </h3>
              </div>
              <p className="mt-2.5 text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
                {spec.detail}
              </p>
            </GlassCard>
          ))}
        </PlanetaryCardSection>
      </section>
    </div>
  );
};

export default InsightsPage;
