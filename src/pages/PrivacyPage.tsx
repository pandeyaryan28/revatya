import React from 'react';
import { PageMeta } from '../components/seo/PageMeta';
import { GlassCard } from '../components/ui/GlassCard';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-24 pt-16 sm:pt-24">
      <PageMeta pageKey="privacy" />

      <div data-hero-section="true" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <ScrollReveal variant="fade-up">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
              PRIVACY POLICY
            </span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-[#F5F5F7] sm:text-5xl">
            Privacy Notice
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed">
            Revatya collects only the information you explicitly choose to submit when initiating a partnership, research, or contributor enquiry.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delayMs={80}>
          <GlassCard className="p-8 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-zinc-300">
            <div className="space-y-2">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                <Shield className="h-5 w-5 text-slate-700 dark:text-zinc-300" />
                1. Information you provide voluntarily
              </h2>
              <p>
                When you submit the Contact form (<code>/contact</code>) or Individual Contributors form (<code>/join</code>), we record the fields you enter, such as your name, email address, organisation, discipline, message, optional reference link, and explicit consent timestamp.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                2. How we use submitted information
              </h2>
              <p>
                Information submitted through our intake forms is used solely to evaluate potential technical collaborations, research exchanges, commercial use case discussions, or contributor introductions, and to follow up with you where relevant. We do not sell, rent, or trade contact lists.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                3. Access controls and storage security
              </h2>
              <p>
                Public enquiry records are stored in write only intake collections protected by strict schema validation and access rules that prohibit public reading, listing, modification, or deletion of submitted entries.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                4. Local interface preferences
              </h2>
              <p>
                This website stores your visual theme preference (Dark Mode or Light Mode) locally in your browser’s <code>localStorage</code>. We do not use invasive third party advertising trackers.
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PrivacyPage;
