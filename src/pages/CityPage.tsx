import React from 'react';
import { Compass, Layers, CheckCircle2 } from 'lucide-react';
import { CITY_DISTRICTS, HOME_CONTENT, type CityDistrict } from '../data/siteContent';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { InteractiveCityAtlas } from '../components/atlas/InteractiveCityAtlas';
import { CityPerspectiveViewer } from '../components/journey/CityPerspectiveViewer';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PlanetaryCardSection } from '../components/ui/PlanetaryCardSection';
import { PageMeta } from '../components/seo/PageMeta';
import { HeroSection } from '../components/ui/HeroSection';

const DistrictDossierCard: React.FC<{ district: CityDistrict }> = ({
  district,
}) => {
  return (
    <GlassCard id={district.id} padding="lg" className="space-y-8 scroll-mt-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Bespoke District Architectural Visualization */}
        <div className="lg:col-span-5">
          <figure className="relative rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/[0.1] bg-[#04060A]">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <img
                src={district.image.src}
                alt={district.image.alt}
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </figure>
        </div>

        {/* Right: District Technical Dossier */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3 border-b border-slate-900/[0.08] dark:border-white/[0.07] pb-5">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
              {district.title}
            </h3>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
              {district.intendedPurpose}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Key Systems */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-slate-900 dark:text-[#F5F5F7]">
                <Layers className="w-4 h-4 text-slate-500 dark:text-[#A1A1AA]" />
                <span>Candidate Subsystems</span>
              </div>
              <ul className="space-y-2">
                {district.keySystems.map((sys) => (
                  <li
                    key={sys}
                    className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed"
                  >
                    <span>{sys}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Utility Dependencies */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-slate-900 dark:text-[#F5F5F7]">
                <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-[#A1A1AA]" />
                <span>Utility Dependencies</span>
              </div>
              <ul className="space-y-2">
                {district.dependencies.map((dep) => (
                  <li
                    key={dep}
                    className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed"
                  >
                    <span>{dep}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export const CityPage: React.FC = () => {
  return (
    <div className="space-y-20 md:space-y-28 pb-16">
      <PageMeta pageKey="city" />
      {/* HERO */}
      <HeroSection
        eyebrow="THE CITY ARCHITECTURE"
        headline={HOME_CONTENT.cityConcept.headline}
        body={HOME_CONTENT.cityConcept.body}
        actions={
          <div className="flex flex-wrap gap-3 pt-2">
            <AppleButton to="/city-atlas" variant="primary" icon={<Compass className="w-4 h-4" />} showArrow>
              Launch Interactive City Atlas
            </AppleButton>
            <AppleButton to="/applications" variant="secondary">
              Explore Applications
            </AppleButton>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
        {/* MULTI PERSPECTIVE ARCHITECTURAL SHOWCASE */}
        <CityPerspectiveViewer />

        {/* INTERACTIVE CITY ATLAS */}
        <ScrollReveal variant="scale-glass">
          <InteractiveCityAtlas />
        </ScrollReveal>

        {/* 8 DISTRICTS DEEP DIVE */}
        <section className="space-y-12">
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-[#A1A1AA]">
                EIGHT FUNCTIONAL DISTRICTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950 dark:text-[#F5F5F7]">
                District by district technical breakdown.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA]">
                Each district in the Revatya reference architecture serves a specialized role while sharing power, thermal loops, logistics corridors, and life support utilities.
              </p>
            </div>
          </ScrollReveal>

          <PlanetaryCardSection
            variant="dossier"
            orbitLabel="EIGHT FUNCTIONAL DISTRICTS ORBIT"
            itemIds={CITY_DISTRICTS.map((d) => d.id)}
          >
            {CITY_DISTRICTS.map((district) => (
              <DistrictDossierCard key={district.id} district={district} />
            ))}
          </PlanetaryCardSection>
        </section>
      </div>
    </div>
  );
};
