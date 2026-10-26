import React from 'react';
import { Layers } from 'lucide-react';
import { PageMeta } from '../components/seo/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { InteractiveCityAtlas } from '../components/atlas/InteractiveCityAtlas';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export const CityAtlasPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <PageMeta pageKey="cityAtlas" />

      <section data-hero-section="true" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <ScrollReveal preset="fade-up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeader
              as="h1"
              eyebrow="CITY ATLAS"
              headline="Explore the districts and shared utilities of a future space city."
              body="Select any district node to inspect its intended purpose, candidate subsystems, infrastructure dependencies, and potential commercial role."
            />

            <div className="shrink-0">
              <AppleButton href="/city" variant="secondary" icon={<Layers className="w-4 h-4" />} withArrow>
                Full District Dossiers
              </AppleButton>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal preset="scale-in" delay={100} className="mt-10">
          <InteractiveCityAtlas />
        </ScrollReveal>
      </section>
    </div>
  );
};
export default CityAtlasPage;
