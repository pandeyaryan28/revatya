import React from 'react';
import { PageMeta } from '../components/seo/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PlanetaryCardSection } from '../components/ui/PlanetaryCardSection';
import { PARTNERS_CONTENT, HOME_CONTENT } from '../data/siteContent';
import { HeroSection } from '../components/ui/HeroSection';
import { Handshake } from 'lucide-react';

export const PartnersPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      <PageMeta pageKey="partners" />

      {/* Hero Section with Bespoke Multidisciplinary Engineering Deck Visual */}
      <HeroSection>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal variant="fade-up" className="lg:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                {PARTNERS_CONTENT.hero.eyebrow}
              </span>
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-[#F5F5F7] sm:text-6xl leading-[1.08]">
              {PARTNERS_CONTENT.hero.headline}
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-zinc-300">
              {PARTNERS_CONTENT.hero.body}
            </p>
          </ScrollReveal>

          <ScrollReveal variant="scale-glass" className="lg:col-span-5">
            <figure className="relative rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/[0.1] bg-[#04060A]">
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={HOME_CONTENT.collaboration.image.src}
                  alt={HOME_CONTENT.collaboration.image.alt}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </figure>
          </ScrollReveal>
        </div>
      </HeroSection>

      {/* Six Collaboration Pathways */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <SectionHeader
            eyebrow="6 COLLABORATION PATHWAYS"
            headline="How organisations and specialists can engage."
            body="Select the pathway aligned with your technical capability, research programme, infrastructure focus, or strategic interest."
          />
        </ScrollReveal>

        <PlanetaryCardSection
          variant="card"
          orbitLabel="COLLABORATION PATHWAYS ORBIT"
          itemIds={PARTNERS_CONTENT.pathways.map((p) => p.id)}
          className="mt-10"
        >
          {PARTNERS_CONTENT.pathways.map((pathway, index) => (
            <GlassCard key={pathway.id} className="p-7 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400">
                    PATHWAY 0{index + 1}
                  </span>
                  <Handshake className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                  {pathway.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-zinc-300">
                  {pathway.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-slate-200/70 dark:border-white/[0.08] pt-4 text-sm text-slate-600 dark:text-zinc-300">
                  {pathway.focusTopics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 rounded-xs bg-slate-400 dark:bg-zinc-500 shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200/70 dark:border-white/[0.08]">
                <AppleButton
                  href={
                    pathway.id === 'individual-contributors'
                      ? '/join'
                      : `/contact?category=${encodeURIComponent(pathway.enquiryCategoryValue)}`
                  }
                  variant="secondary"
                  size="sm"
                  withArrow
                  className="w-full justify-center"
                >
                  {pathway.ctaLabel}
                </AppleButton>
              </div>
            </GlassCard>
          ))}
        </PlanetaryCardSection>
      </section>
    </div>
  );
};

export default PartnersPage;
