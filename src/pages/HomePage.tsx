import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import {
  HOME_CONTENT,
  APPLICATIONS_LIST,
  CITY_DISTRICTS,
} from '../data/siteContent';
import { AppleButton } from '../components/ui/AppleButton';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { CityPerspectiveViewer } from '../components/journey/CityPerspectiveViewer';
import { RoadmapHorizonTimeline } from '../components/journey/RoadmapHorizonTimeline';
import { ScrollReveal, useScrollParallax } from '../components/ui/ScrollReveal';
import { PlanetaryCardSection } from '../components/ui/PlanetaryCardSection';
import { PageMeta } from '../components/seo/PageMeta';

export const HomePage: React.FC = () => {
  const heroParallaxOffset = useScrollParallax(0.08);

  return (
    <div className="space-y-24 md:space-y-36 pb-16">
      <PageMeta pageKey="home" />
      {/* SECTION 1: FULL BLEED CINEMATIC HERO (CHAPTER 01: ARRIVAL) */}
      <section
        id="chapter-arrival"
        data-hero-section="true"
        className="relative -mt-28 md:-mt-32 min-h-[92vh] w-full overflow-hidden flex items-end pb-16 md:pb-24 pt-36 md:pt-44 border-b border-slate-900/[0.08] dark:border-white/[0.07]"
      >
        {/* Full bleed background video with scroll linked parallax */}
        <div
          className="absolute inset-0 z-0 overflow-hidden bg-[#020305]"
          style={{
            transform: `translate3d(0, ${heroParallaxOffset}px, 0) scale(1.04)`,
            willChange: 'transform',
          }}
        >
          <video
            src={HOME_CONTENT.hero.videoSrc}
            poster={HOME_CONTENT.hero.imageSrc}
            autoPlay
            loop
            muted
            playsInline
            aria-label={HOME_CONTENT.hero.imageAlt}
            className="w-full h-full object-cover object-center opacity-75 dark:opacity-65"
          />
        </div>

        {/* Multi stop optical scrims for legibility in both Light and Dark mode */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/75 to-[#F5F5F7]/30 dark:from-[#020305] dark:via-[#020305]/72 dark:to-[#020305]/35"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#F5F5F7]/90 via-[#F5F5F7]/55 to-transparent dark:from-[#020305]/92 dark:via-[#020305]/60 dark:to-transparent"
        />

        {/* Foreground architectural content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-7">
            <ScrollReveal variant="fade-up" delayMs={40}>
              <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.22em] text-slate-600 dark:text-[#A1A1AA]">
                {HOME_CONTENT.hero.eyebrow}
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delayMs={110}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-[#F5F5F7] leading-[1.03]">
                {HOME_CONTENT.hero.headline}
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delayMs={180}>
              <p className="text-lg sm:text-xl text-slate-700 dark:text-[#A1A1AA] leading-relaxed max-w-2xl">
                {HOME_CONTENT.hero.body}
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delayMs={250}>
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <AppleButton to={HOME_CONTENT.hero.primaryCta.href} variant="primary" size="lg" showArrow>
                  {HOME_CONTENT.hero.primaryCta.label}
                </AppleButton>
                <AppleButton to={HOME_CONTENT.hero.secondaryCta.href} variant="secondary" size="lg">
                  {HOME_CONTENT.hero.secondaryCta.label}
                </AppleButton>
                <AppleButton to="/city-atlas" variant="ghost" size="md" icon={<Compass className="w-4 h-4" />}>
                  Interactive City Atlas
                </AppleButton>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 2: THESIS (CHAPTER 02: THE THESIS) */}
      <section id="chapter-thesis" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="scale-glass">
          <GlassCard padding="lg" className="relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-[#A1A1AA]">
                  {HOME_CONTENT.thesis.eyebrow}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 dark:text-[#F5F5F7] leading-tight">
                  {HOME_CONTENT.thesis.headline}
                </h2>
                <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                  {HOME_CONTENT.thesis.body}
                </p>
              </div>

              <div className="lg:col-span-6">
                <figure className="relative rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/[0.1] bg-[#04060A]">
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={HOME_CONTENT.thesis.image.src}
                      alt={HOME_CONTENT.thesis.image.alt}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </figure>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>

      {/* SECTION 3: CITY ARCHITECTURE & PERSPECTIVE VIEWER (CHAPTER 03: ARCHITECTURE) */}
      <section id="chapter-architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeader
              eyebrow={HOME_CONTENT.cityConcept.eyebrow}
              title={HOME_CONTENT.cityConcept.headline}
              description={HOME_CONTENT.cityConcept.body}
            />
            <div className="flex flex-wrap gap-3 shrink-0">
              <AppleButton to={HOME_CONTENT.cityConcept.cta.href} variant="secondary" showArrow>
                {HOME_CONTENT.cityConcept.cta.label}
              </AppleButton>
              <AppleButton to="/city-atlas" variant="primary" icon={<Compass className="w-4 h-4" />}>
                Open Interactive Atlas
              </AppleButton>
            </div>
          </div>
        </ScrollReveal>

        <CityPerspectiveViewer />
      </section>

      {/* SECTION 4: THE 8 DISTRICTS (CHAPTER 04: 8 DISTRICTS) */}
      <section id="chapter-districts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal variant="fade-up">
          <SectionHeader
            eyebrow="DISTRICT ARCHITECTURE"
            title="The eight functional districts of an orbital city."
            description="Explore the interconnected districts that form a self-sustaining urban architecture in orbit, from pressurised habitation to heavy manufacturing and life support."
          />
        </ScrollReveal>

        <PlanetaryCardSection
          variant="card"
          orbitLabel="CITY DISTRICTS ORBIT"
          itemIds={CITY_DISTRICTS.map((d) => d.id)}
        >
          {CITY_DISTRICTS.map((district) => (
            <Link key={district.id} to={`/city#${district.id}`} className="group block h-full">
              <GlassCard padding="sm" interactive className="h-full flex flex-col justify-between overflow-hidden">
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#04060A] border border-slate-900/10 dark:border-white/[0.08]">
                    <img
                      src={district.image.src}
                      alt={district.image.alt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-2 px-1">
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-[#F5F5F7] group-hover:opacity-80 transition-opacity">
                      {district.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA] line-clamp-3 leading-relaxed">
                      {district.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 px-1 border-t border-slate-900/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                  <span>Inspect district</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </PlanetaryCardSection>
      </section>

      {/* SECTION 5: WHY A CITY · ALL 6 CANDIDATE APPLICATIONS WITH BESPOKE VISUALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal variant="fade-up">
          <SectionHeader
            eyebrow={HOME_CONTENT.whyACity.eyebrow}
            title={HOME_CONTENT.whyACity.headline}
            description={HOME_CONTENT.whyACity.intro}
          />
        </ScrollReveal>

        <PlanetaryCardSection
          variant="card"
          orbitLabel="CANDIDATE APPLICATIONS ORBIT"
          itemIds={APPLICATIONS_LIST.map((app) => app.id)}
        >
          {APPLICATIONS_LIST.map((app) => (
            <GlassCard key={app.id} interactive className="flex flex-col justify-between h-full">
              <div className="space-y-5">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#04060A] border border-slate-900/10 dark:border-white/[0.08]">
                  <img
                    src={app.image.src}
                    alt={app.image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-[#F5F5F7] tracking-tight">
                    {app.title}
                  </h3>
                  <p className="text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                    {app.shortCardCopy}
                  </p>
                </div>
              </div>
              <div className="pt-5 mt-6 border-t border-slate-900/[0.06] dark:border-white/[0.06]">
                <Link
                  to={`/applications#${app.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-[#F5F5F7] hover:opacity-75 transition-opacity"
                >
                  {app.cardLinkLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </PlanetaryCardSection>
      </section>

      {/* SECTION 6: STAGE GATED ROADMAP HORIZON TIMELINE (CHAPTER 05: ROADMAP) */}
      <section id="chapter-roadmap" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeader
              eyebrow={HOME_CONTENT.roadmapPreview.eyebrow}
              title={HOME_CONTENT.roadmapPreview.headline}
              description={HOME_CONTENT.roadmapPreview.body}
            />
            <AppleButton to={HOME_CONTENT.roadmapPreview.cta.href} variant="secondary" showArrow>
              {HOME_CONTENT.roadmapPreview.cta.label}
            </AppleButton>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-glass">
          <RoadmapHorizonTimeline compact />
        </ScrollReveal>
      </section>

      {/* SECTION 7: COLLABORATION (CHAPTER 06: ENGAGE) */}
      <section id="chapter-engage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="scale-glass">
          <GlassCard padding="lg" className="max-w-4xl mx-auto flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#04060A] border border-slate-900/10 dark:border-white/[0.1]">
                <img
                  src={HOME_CONTENT.collaboration.image.src}
                  alt={HOME_CONTENT.collaboration.image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <span className="block text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-[#A1A1AA]">
                {HOME_CONTENT.collaboration.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 dark:text-[#F5F5F7]">
                {HOME_CONTENT.collaboration.headline}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                {HOME_CONTENT.collaboration.body}
              </p>
              <p className="text-sm font-mono text-slate-500 dark:text-[#71717A]">
                {HOME_CONTENT.collaboration.supportingLine}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <AppleButton to={HOME_CONTENT.collaboration.primaryCta.href} variant="primary" showArrow>
                {HOME_CONTENT.collaboration.primaryCta.label}
              </AppleButton>
              <AppleButton to={HOME_CONTENT.collaboration.secondaryCta.href} variant="secondary">
                {HOME_CONTENT.collaboration.secondaryCta.label}
              </AppleButton>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>
    </div>
  );
};
