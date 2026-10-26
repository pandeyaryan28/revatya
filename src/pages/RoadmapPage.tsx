import React from 'react';
import { HOME_CONTENT } from '../data/siteContent';
import { RoadmapHorizonTimeline } from '../components/journey/RoadmapHorizonTimeline';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PageMeta } from '../components/seo/PageMeta';

export const RoadmapPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24 pb-16">
      <PageMeta pageKey="roadmap" />
      {/* HERO */}
      <ScrollReveal variant="fade-up">
        <header data-hero-section="true" className="max-w-3xl space-y-6 pt-4">
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-[#A1A1AA]">
            STAGE GATED ROADMAP
          </p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-950 dark:text-[#F5F5F7] leading-[1.06]">
            {HOME_CONTENT.roadmapPreview.headline}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
            {HOME_CONTENT.roadmapPreview.body}
          </p>
        </header>
      </ScrollReveal>

      {/* INTERACTIVE STAGE HORIZON TIMELINE */}
      <ScrollReveal variant="scale-glass">
        <RoadmapHorizonTimeline />
      </ScrollReveal>
    </div>
  );
};
