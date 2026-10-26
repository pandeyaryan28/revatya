import React from 'react';
import { CheckCircle2, AlertTriangle, Compass } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const TRANSFERABLE_PRINCIPLES = [
  {
    domain: 'Environmental Telemetry & Controls',
    detail:
      'Sensor calibration, gas composition monitoring, leak detection algorithms, and automated alert thresholds inside sealed volumes.',
  },
  {
    domain: 'Human Factors & Confinement Ergonomics',
    detail:
      'Interior acoustic zoning, circadian lighting schedules, crew maintenance workflows, and psychological wellbeing in isolated habitats.',
  },
  {
    domain: 'Operational & Safety Discipline',
    detail:
      'Airlock/hatch ingress and egress checklists, anomaly triage protocols, remote mission control loops, and autonomous subsystem diagnostics.',
  },
  {
    domain: 'Modular Utility Interfaces',
    detail:
      'Standardised quick disconnect fluid, power, and data bulkheads designed for rapid crew maintenance and rack replacement.',
  },
];

const NON_TRANSFERABLE_ORBITAL_REALITIES = [
  {
    domain: 'Microgravity & Partial G Physics',
    detail:
      'Fluid phase separation, buoyancy free convection, zero G crystal growth, and long term human musculoskeletal deconditioning.',
  },
  {
    domain: 'Hard Vacuum & Radiative Thermal Cycles',
    detail:
      'Heat rejection exclusively via radiative panels (no convective water cooling), outgassing, and extreme solar to eclipse thermal swings.',
  },
  {
    domain: 'Ionising Space Radiation & MMOD',
    detail:
      'Galactic cosmic rays, solar particle events, trapped radiation belts, and hypervelocity micrometeoroid / orbital debris shielding.',
  },
  {
    domain: 'Orbital Dynamics & Launch Economics',
    detail:
      'High velocity rendezvous and docking, attitude control torque, propellant transfer in zero G, and upmass/downmass cost constraints.',
  },
];

export const AnalogBoundaryDiagram: React.FC = () => {
  return (
    <GlassCard variant="blueprint" padding="lg" className="architectural-grid-bg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900/10 dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 font-semibold">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>METHODOLOGY BOUNDARY MATRIX · STAGE 02</span>
          </div>
          <h3 className="mt-1.5 font-serif-display text-2xl sm:text-3xl text-slate-950 dark:text-[#F5F5F7]">
            Controlled Analog Testing vs. True Orbital Validation
          </h3>
        </div>
        <span className="font-mono-tech text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Validated requirement
        </span>
      </div>

      <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
        Revatya’s ultimate focus is a space city. Underwater habitat or terrestrial analog testing is treated strictly as an intermediate engineering tool: valuable for selected operational and human factors principles, but never confused with the physics of orbital spaceflight.
      </p>

      {/* SVG Architectural Flow Header */}
      <div className="mt-6 rounded-2xl bg-[#04060A] p-4 border border-white/[0.1] overflow-x-auto">
        <svg
          viewBox="0 0 800 110"
          role="img"
          aria-label="Diagram showing how terrestrial and underwater analog tests transfer operational lessons while physics dependent systems require direct orbital flight validation"
          className="w-full min-w-[540px] h-auto"
        >
          <rect
            x="20"
            y="20"
            width="225"
            height="70"
            rx="12"
            fill="#0A0D14"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.25"
          />
          <text
            x="132"
            y="47"
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize="12"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            TERRESTRIAL / SUBSEA
          </text>
          <text
            x="132"
            y="69"
            textAnchor="middle"
            fill="#F5F5F7"
            fontSize="13"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
          >
            Operations & Ergonomics
          </text>

          <line
            x1="245"
            y1="55"
            x2="340"
            y2="55"
            stroke="#A1A1AA"
            strokeWidth="1.5"
            className="svg-orbital-flow"
          />
          <polygon points="340,51 348,55 340,59" fill="#A1A1AA" />

          <rect
            x="350"
            y="20"
            width="190"
            height="70"
            rx="12"
            fill="#0A0D14"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.25"
          />
          <text
            x="445"
            y="47"
            textAnchor="middle"
            fill="#D4D4D8"
            fontSize="12"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            ENGINEERING FILTER
          </text>
          <text
            x="445"
            y="69"
            textAnchor="middle"
            fill="#F5F5F7"
            fontSize="13"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
          >
            Strict Physics Boundary
          </text>

          <line
            x1="540"
            y1="55"
            x2="605"
            y2="55"
            stroke="#F5F5F7"
            strokeWidth="1.5"
          />
          <polygon points="605,51 613,55 605,59" fill="#F5F5F7" />

          <rect
            x="615"
            y="20"
            width="165"
            height="70"
            rx="12"
            fill="#0A0D14"
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth="1.5"
          />
          <text
            x="697"
            y="47"
            textAnchor="middle"
            fill="#F5F5F7"
            fontSize="12"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            STAGE 03 TO 05 ORBITAL
          </text>
          <text
            x="697"
            y="69"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="13"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
          >
            Spaceflight Validation
          </text>
        </svg>
      </div>

      {/* Two Column Visual + Comparison */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Transferable */}
        <div className="rounded-2xl overflow-hidden bg-white/90 dark:bg-[#080B11]/90 border border-slate-900/10 dark:border-white/[0.08]">
          <div className="relative aspect-video bg-[#04060A] overflow-hidden">
            <img
              src="/images/roadmap/stage-02-subsea-analog.webp"
              alt="Subsea habitat analog testbed anchored on the continental shelf"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-slate-900 dark:text-[#F5F5F7] font-mono-tech text-xs uppercase tracking-wider font-semibold mb-4">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-zinc-500 dark:text-zinc-300" aria-hidden="true" />
              <span>What Analog Environments Can Inform</span>
            </div>
            <div className="space-y-3.5">
              {TRANSFERABLE_PRINCIPLES.map((item) => (
                <div
                  key={item.domain}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#04060A]/80 border border-slate-900/6 dark:border-white/[0.07]"
                >
                  <h4 className="text-base font-semibold text-slate-900 dark:text-[#F5F5F7]">
                    {item.domain}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Non Transferable */}
        <div className="rounded-2xl overflow-hidden bg-white/90 dark:bg-[#080B11]/90 border border-slate-900/10 dark:border-white/[0.08]">
          <div className="relative aspect-video bg-[#04060A] overflow-hidden">
            <img
              src="/images/roadmap/stage-04-initial-orbital-node.webp"
              alt="Initial orbital demonstration node in low Earth orbit"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-slate-900 dark:text-[#F5F5F7] font-mono-tech text-xs uppercase tracking-wider font-semibold mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0 text-zinc-500 dark:text-zinc-300" aria-hidden="true" />
              <span>What Requires Direct Orbital Validation</span>
            </div>
            <div className="space-y-3.5">
              {NON_TRANSFERABLE_ORBITAL_REALITIES.map((item) => (
                <div
                  key={item.domain}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#04060A]/80 border border-slate-900/6 dark:border-white/[0.07]"
                >
                  <h4 className="text-base font-semibold text-slate-900 dark:text-[#F5F5F7]">
                    {item.domain}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
