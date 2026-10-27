import React from 'react';
import { Layers } from 'lucide-react';
import { PageMeta } from '../components/seo/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { InteractiveCityAtlas } from '../components/atlas/InteractiveCityAtlas';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { HeroSection } from '../components/ui/HeroSection';

export const CityAtlasPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <PageMeta pageKey="cityAtlas" />

      <HeroSection>
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeader
              as="h1"
              eyebrow="CITY ATLAS"
              headline="Explore the districts and shared utilities of a future space city."
              body="Select any district node to inspect its intended purpose, candidate subsystems, infrastructure dependencies, and potential commercial role."
            />

            <div className="shrink-0">
              <AppleButton to="/city" variant="secondary" icon={<Layers className="w-4 h-4" />} showArrow>
                Full District Dossiers
              </AppleButton>
            </div>
          </div>
        </ScrollReveal>
      </HeroSection>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="scale-glass" delayMs={100}>
          <InteractiveCityAtlas />
        </ScrollReveal>
      </div>
    </div>
  );
};
export default CityAtlasPage;
