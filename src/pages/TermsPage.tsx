import React from 'react';
import { PageMeta } from '../components/seo/PageMeta';
import { GlassCard } from '../components/ui/GlassCard';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { HeroSection } from '../components/ui/HeroSection';
import { BRAND_CONTENT } from '../data/siteContent';
import { Scale } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-24">
      <PageMeta pageKey="terms" />

      <HeroSection
        eyebrow="TERMS OF USE"
        headline="Terms of Use & Disclaimers"
        body="Please read these terms and architectural disclaimers carefully when reviewing Revatya’s website, research notes, and conceptual visualisations."
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
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
