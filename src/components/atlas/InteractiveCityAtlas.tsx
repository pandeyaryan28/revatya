import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  GitBranch,
  Briefcase,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  CITY_DISTRICTS,
  type CityDistrict,
} from '../../data/siteContent';
import { GlassCard } from '../ui/GlassCard';

interface InteractiveCityAtlasProps {
  initialDistrictId?: string;
}

const DISTRICT_DEPENDENCY_LINKS: Record<string, string[]> = {
  habitation: ['life-support', 'energy-thermal', 'orbital-port', 'shared-environments'],
  'orbital-port': ['construction-maintenance', 'energy-thermal', 'manufacturing', 'research'],
  research: ['orbital-port', 'energy-thermal', 'habitation', 'manufacturing'],
  manufacturing: ['energy-thermal', 'orbital-port', 'research'],
  'energy-thermal': ['construction-maintenance', 'life-support', 'manufacturing'],
  'life-support': ['energy-thermal', 'orbital-port', 'habitation', 'shared-environments'],
  'construction-maintenance': ['orbital-port', 'energy-thermal'],
  'shared-environments': ['habitation', 'life-support'],
};

export const InteractiveCityAtlas: React.FC<InteractiveCityAtlasProps> = ({
  initialDistrictId = 'habitation',
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialDistrictId);

  const activeDistrict: CityDistrict =
    CITY_DISTRICTS.find((d) => d.id === selectedId) ?? CITY_DISTRICTS[0];

  const connectedIds = DISTRICT_DEPENDENCY_LINKS[activeDistrict.id] ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Interactive SVG Orbital Blueprint */}
      <div className="lg:col-span-7 space-y-4">
        <GlassCard variant="blueprint" padding="md" className="architectural-grid-bg">
          <div className="rounded-2xl bg-[#04060A] p-3 sm:p-5 border border-white/[0.1] shadow-inner overflow-hidden">
            <svg
              viewBox="0 0 800 500"
              role="img"
              aria-label="Interactive orbital city atlas showing eight interconnected districts and their system dependencies"
              className="w-full h-auto select-none"
            >
              <defs>
                <radialGradient id="atlasCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.09)" />
                  <stop offset="65%" stopColor="rgba(255, 255, 255, 0.02)" />
                  <stop offset="100%" stopColor="rgba(4, 6, 10, 0)" />
                </radialGradient>
              </defs>

              <rect width="800" height="500" fill="url(#atlasCoreGlow)" />

              {/* Coordinate Crosshairs */}
              <line
                x1="60"
                y1="250"
                x2="740"
                y2="250"
                stroke="rgba(255, 255, 255, 0.14)"
                strokeWidth="1.5"
              />
              <line
                x1="400"
                y1="40"
                x2="400"
                y2="460"
                stroke="rgba(255, 255, 255, 0.10)"
                strokeWidth="1"
              />

              {/* Concentric Structural Rings */}
              <circle
                cx="400"
                cy="250"
                r="190"
                fill="none"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1.25"
              />
              <circle
                cx="400"
                cy="250"
                r="125"
                fill="none"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1.25"
              />
              <circle
                cx="400"
                cy="250"
                r="58"
                fill="none"
                stroke="rgba(255, 255, 255, 0.24)"
                strokeWidth="1.5"
              />

              {/* Dependency Vector Lines from Selected District */}
              {CITY_DISTRICTS.map((target) => {
                if (!connectedIds.includes(target.id)) return null;
                return (
                  <g key={`${activeDistrict.id}:${target.id}`}>
                    <line
                      x1={activeDistrict.coordinates.cx}
                      y1={activeDistrict.coordinates.cy}
                      x2={target.coordinates.cx}
                      y2={target.coordinates.cy}
                      stroke="rgba(245, 245, 247, 0.55)"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}

              {/* District Nodes */}
              {CITY_DISTRICTS.map((district, index) => {
                const isSelected = district.id === activeDistrict.id;
                const isConnected = connectedIds.includes(district.id);

                return (
                  <g
                    key={district.id}
                    onClick={() => setSelectedId(district.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(district.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    aria-label={`Select district ${district.title}`}
                    className="cursor-pointer transition-opacity duration-300 focus:outline-none"
                  >
                    {isSelected && (
                      <circle
                        cx={district.coordinates.cx}
                        cy={district.coordinates.cy}
                        r="38"
                        fill="rgba(255, 255, 255, 0.08)"
                        stroke="rgba(245, 245, 247, 0.75)"
                        strokeWidth="1.5"
                        className="svg-node-pulse"
                      />
                    )}
                    {isConnected && !isSelected && (
                      <circle
                        cx={district.coordinates.cx}
                        cy={district.coordinates.cy}
                        r="31"
                        fill="rgba(255, 255, 255, 0.04)"
                        stroke="rgba(212, 212, 216, 0.45)"
                        strokeWidth="1.25"
                      />
                    )}
                    <circle
                      cx={district.coordinates.cx}
                      cy={district.coordinates.cy}
                      r="23"
                      fill={
                        isSelected
                          ? '#F5F5F7'
                          : isConnected
                          ? '#18181B'
                          : '#0A0D14'
                      }
                      stroke={
                        isSelected
                          ? '#FFFFFF'
                          : isConnected
                          ? '#D4D4D8'
                          : 'rgba(255, 255, 255, 0.35)'
                      }
                      strokeWidth="1.75"
                    />
                    <text
                      x={district.coordinates.cx}
                      y={district.coordinates.cy + 4}
                      textAnchor="middle"
                      fill={isSelected ? '#020305' : '#F5F5F7'}
                      fontSize="12"
                      fontWeight="700"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      0{index + 1}
                    </text>

                    <text
                      x={district.coordinates.cx}
                      y={district.coordinates.cy + 41}
                      textAnchor="middle"
                      fill={isSelected ? '#FFFFFF' : '#D4D4D8'}
                      fontSize="12"
                      fontWeight={isSelected ? '600' : '500'}
                      fontFamily="Inter, sans-serif"
                    >
                      {district.shortTitle}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Accessible District Selector Buttons */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CITY_DISTRICTS.map((district) => {
              const active = district.id === activeDistrict.id;
              return (
                <button
                  key={district.id}
                  type="button"
                  onClick={() => setSelectedId(district.id)}
                  aria-pressed={active}
                  className={`px-3.5 py-3 rounded-2xl text-left transition-all cursor-pointer tactile-press border ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-[#F5F5F7] dark:text-[#020305] border-slate-900 dark:border-white font-semibold'
                      : 'bg-white/75 dark:bg-[#080B11]/85 border-slate-900/10 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 hover:border-slate-900/25 dark:hover:border-white/20'
                  }`}
                >
                  <span
                    className={`block font-mono-tech text-xs uppercase tracking-wider ${
                      active
                        ? 'text-slate-300 dark:text-zinc-600'
                        : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {district.coordinates.ring}
                  </span>
                  <span className="block text-sm font-medium mt-1 truncate">
                    {district.title}
                  </span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Right: Selected District Inspector Sheet with Clean Visual Plate */}
      <div className="lg:col-span-5">
        <GlassCard
          padding="md"
          aria-live="polite"
          className="space-y-6"
        >
          {/* Clean District Architectural Visual Header (Zero Overlays or Captions) */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/[0.1] bg-[#04060A] aspect-[16/9]">
            <img
              src={activeDistrict.image.src}
              alt={activeDistrict.image.alt}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
          </div>

          <div className="space-y-3 pb-4 border-b border-slate-900/10 dark:border-white/[0.08]">
            <h2 className="font-serif-display text-2xl sm:text-3xl text-slate-950 dark:text-[#F5F5F7]">
              {activeDistrict.title}
            </h2>

            <p className="text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
              {activeDistrict.intendedPurpose}
            </p>
          </div>

          <div className="space-y-5">
            {/* Key Systems */}
            <div>
              <h3 className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-wider text-slate-900 dark:text-[#F5F5F7] font-semibold mb-2.5">
                <Cpu className="w-4 h-4 text-zinc-500 dark:text-zinc-300" aria-hidden="true" />
                <span>Key Candidate Systems</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-zinc-300">
                {activeDistrict.keySystems.map((sys) => (
                  <li key={sys} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-xs bg-zinc-400 dark:bg-zinc-500 mt-2 shrink-0" />
                    <span>{sys}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* System Dependencies */}
            <div>
              <h3 className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-wider text-slate-900 dark:text-[#F5F5F7] font-semibold mb-2.5">
                <GitBranch
                  className="w-4 h-4 text-zinc-500 dark:text-zinc-300"
                  aria-hidden="true"
                />
                <span>Infrastructure Dependencies</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-zinc-300">
                {activeDistrict.dependencies.map((dep) => (
                  <li key={dep} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-xs bg-zinc-400 dark:bg-zinc-500 mt-2 shrink-0" />
                    <span>{dep}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Commercial Role */}
            <div className="pt-3 border-t border-slate-900/10 dark:border-white/[0.08]">
              <h3 className="flex items-center gap-1.5 font-mono-tech text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                <span>Commercial Role</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                {activeDistrict.potentialCommercialRole}
              </p>
            </div>
          </div>

          {/* Related Application Link */}
          {activeDistrict.relatedApplicationId && (
            <div className="pt-4 border-t border-slate-900/10 dark:border-white/[0.08]">
              <Link
                to={`/applications#${activeDistrict.relatedApplicationId}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-[#F5F5F7] hover:underline"
              >
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Explore related application</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
