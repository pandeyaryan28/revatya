import React from 'react';
import { PageMeta } from '../components/seo/PageMeta';
import { GlassCard } from '../components/ui/GlassCard';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { BRAND_CONTENT } from '../data/siteContent';
import { Scale } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-24 pt-16 sm:pt-24">
      <PageMeta pageKey="terms" />

      <div data-hero-section="true" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <ScrollReveal variant="fade-up">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
              TERMS OF USE
            </span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-[#F5F5F7] sm:text-5xl">
            Terms of Use & Disclaimers
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed">
            Please read these terms and architectural disclaimers carefully when reviewing Revatya’s website, research notes, and conceptual visualisations.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delayMs={80}>
          <GlassCard className="p-8 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-zinc-300">
            <div className="space-y-2">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                <Scale className="h-5 w-5 text-slate-700 dark:text-zinc-300" />
                1. Conceptual nature of architectural & technical materials
              </h2>
              <p>{BRAND_CONTENT.GlobalConceptDisclaimer}</p>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                2. No investment solicitation or financial offer
              </h2>
              <p>
                Nothing on this website constitutes an offer to sell, or a solicitation of an offer to buy, any securities, financial instruments, or commercial contracts. {BRAND_CONTENT.EconomicDisclaimer}
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                3. Extreme environment and underwater analog boundaries
              </h2>
              <p>{BRAND_CONTENT.underwaterBoundaryStatement}</p>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                4. Non confidentiality of initial form submissions
              </h2>
              <p>
                Please do not submit export controlled technical data, classified information, or proprietary trade secrets through the public website forms. If a formal non disclosure agreement is required prior to technical exchange, please indicate that in your initial message.
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default TermsPage;
