import React from 'react';
import { HOME_CONTENT } from '../data/siteContent';
import { RoadmapHorizonTimeline } from '../components/journey/RoadmapHorizonTimeline';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PageMeta } from '../components/seo/PageMeta';
import { HeroSection } from '../components/ui/HeroSection';

export const RoadmapPage: React.FC = () => {
  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      <PageMeta pageKey="roadmap" />
      {/* HERO */}
      <HeroSection
        eyebrow="STAGE GATED ROADMAP"
        headline={HOME_CONTENT.roadmapPreview.headline}
        body={HOME_CONTENT.roadmapPreview.body}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* INTERACTIVE STAGE HORIZON TIMELINE */}
        <ScrollReveal variant="scale-glass">
          <RoadmapHorizonTimeline />
        </ScrollReveal>
      </div>
    </div>
  );
};
