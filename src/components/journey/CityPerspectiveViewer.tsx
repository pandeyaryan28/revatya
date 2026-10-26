import React from 'react';
import { HOME_CONTENT } from '../../data/siteContent';
import { GlassCard } from '../ui/GlassCard';
import { PlanetaryCardSection } from '../ui/PlanetaryCardSection';

const PERSPECTIVE_DETAILS: Record<string, string> = {
  exterior:
    'A macro orbital architecture organised around a central utility spine, symmetric thermal radiator wings, and concentric habitat rings, separating high vibration logistics from quiet residential and research sectors.',
  cutaway:
    'A three level sectional cutaway through a pressurised habitat sector illustrating how pedestrian transit concourses, environmental terraces, and sub floor utility corridors interlock within a modular hull.',
  commons:
    'Human scale interior architecture engineered for long duration psychological wellbeing, acoustic calm, circadian lighting progression, and restorative visual connection to Earth below.',
};

export const CityPerspectiveViewer: React.FC = () => {
  const perspectives = HOME_CONTENT.cityConcept.perspectives;

  return (
    <PlanetaryCardSection
      variant="card"
      orbitLabel="ARCHITECTURAL PERSPECTIVES ORBIT"
      itemIds={perspectives.map((view) => view.id)}
    >
      {perspectives.map((view) => (
        <GlassCard
          key={view.id}
          padding="sm"
          className="flex flex-col justify-between h-full overflow-hidden"
        >
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#030509] border border-slate-900/10 dark:border-white/[0.08]">
              <img
                src={view.src}
                alt={view.alt}
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="px-2 pb-2 space-y-2">
              <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-[#F5F5F7]">
                {view.label}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
                {PERSPECTIVE_DETAILS[view.id] ?? ''}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </PlanetaryCardSection>
  );
};
