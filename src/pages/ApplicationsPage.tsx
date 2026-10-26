import React from 'react';
import { Users, Layers } from 'lucide-react';
import { APPLICATIONS_LIST } from '../data/siteContent';
import { GlassCard } from '../components/ui/GlassCard';
import { ConceptFigure } from '../components/ui/ConceptFigure';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PlanetaryCardSection } from '../components/ui/PlanetaryCardSection';
import { PageMeta } from '../components/seo/PageMeta';

export const ApplicationsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28 pb-16">
      <PageMeta pageKey="applications" />
      {/* HERO */}
      <ScrollReveal variant="fade-up">
        <header data-hero-section="true" className="max-w-3xl space-y-6 pt-4">
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-[#A1A1AA]">
            APPLICATIONS & USE CASES
          </p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-950 dark:text-[#F5F5F7] leading-[1.06]">
            Shared infrastructure for orbital industry and research.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
            A persistent orbital city unlocks research, manufacturing, servicing, and computation that isolated single purpose spacecraft cannot sustain economically.
          </p>
        </header>
      </ScrollReveal>

      {/* 6 APPLICATION DOMAINS WITH BESPOKE VISUALS */}
      <PlanetaryCardSection
        variant="dossier"
        orbitLabel="APPLICATION DOMAINS ORBIT"
        itemIds={APPLICATIONS_LIST.map((app) => app.id)}
      >
        {APPLICATIONS_LIST.map((app) => (
          <GlassCard key={app.id} id={app.id} padding="lg" className="space-y-8 scroll-mt-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
                  {app.title}
                </h2>

                <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                  {app.opportunity}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-900/[0.08] dark:border-white/[0.07]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-slate-900 dark:text-[#F5F5F7]">
                      <Users className="w-4 h-4 text-slate-500 dark:text-[#A1A1AA]" />
                      <span>Potential Users</span>
                    </div>
                    <ul className="space-y-1.5">
                      {app.potentialUsers.map((u) => (
                        <li key={u} className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA]">
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-slate-900 dark:text-[#F5F5F7]">
                      <Layers className="w-4 h-4 text-slate-500 dark:text-[#A1A1AA]" />
                      <span>Infrastructure Dependencies</span>
                    </div>
                    <ul className="space-y-1.5">
                      {app.dependencies.map((d) => (
                        <li key={d} className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA]">
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <ConceptFigure
                  src={app.image.src}
                  alt={app.image.alt}
                  caption={app.image.caption}
                  categoryTag={app.image.conditionLabel}
                  aspectRatio="16/9"
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </PlanetaryCardSection>
    </div>
  );
};
