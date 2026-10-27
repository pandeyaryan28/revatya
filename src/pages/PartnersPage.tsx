import React, { useState } from 'react';
import { PageMeta } from '../components/seo/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PlanetaryCardSection } from '../components/ui/PlanetaryCardSection';
import { PARTNERS_CONTENT, HOME_CONTENT } from '../data/siteContent';
import { HeroSection } from '../components/ui/HeroSection';
import { submitContactInquiry, SubmissionResult } from '../lib/submissions';
import { Handshake, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const PartnersPage: React.FC = () => {
  // Direct Partner Dialogue Form State
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerOrg, setPartnerOrg] = useState('');
  const [partnerPathway, setPartnerPathway] = useState(PARTNERS_CONTENT.pathways[0].enquiryCategoryValue);
  const [partnerMessage, setPartnerMessage] = useState('');
  const [partnerConsent, setPartnerConsent] = useState(true);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const validatePartnerForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!partnerName.trim()) nextErrors.name = 'Please enter your name.';
    if (!partnerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail.trim())) {
      nextErrors.email = 'Enter a valid work email address.';
    }
    if (partnerMessage.trim().length < 10) {
      nextErrors.message = 'Please provide a brief description (at least 10 characters).';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePartnerForm()) return;

    setIsSubmitting(true);
    try {
      const res = await submitContactInquiry({
        fullName: partnerName,
        email: partnerEmail,
        organisation: partnerOrg,
        category: partnerPathway,
        message: partnerMessage,
        consent: partnerConsent,
        originatingPage: 'Partners Page',
      });
      setSubmissionResult(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-24 pb-24">
      <PageMeta pageKey="partners" />

      {/* Hero Section with Bespoke Multidisciplinary Engineering Deck Visual */}
      <HeroSection>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal variant="fade-up" className="lg:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                {PARTNERS_CONTENT.hero.eyebrow}
              </span>
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-[#F5F5F7] sm:text-6xl leading-[1.08]">
              {PARTNERS_CONTENT.hero.headline}
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-zinc-300">
              {PARTNERS_CONTENT.hero.body}
            </p>
          </ScrollReveal>

          <ScrollReveal variant="scale-glass" className="lg:col-span-5">
            <figure className="relative rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/[0.1] bg-[#04060A]">
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={HOME_CONTENT.collaboration.image.src}
                  alt={HOME_CONTENT.collaboration.image.alt}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </figure>
          </ScrollReveal>
        </div>
      </HeroSection>

      {/* Six Collaboration Pathways */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <SectionHeader
            eyebrow="6 COLLABORATION PATHWAYS"
            headline="How organisations and specialists can engage."
            body="Select the pathway aligned with your technical capability, research programme, infrastructure focus, or strategic interest."
          />
        </ScrollReveal>

        <PlanetaryCardSection
          variant="card"
          orbitLabel="COLLABORATION PATHWAYS ORBIT"
          itemIds={PARTNERS_CONTENT.pathways.map((p) => p.id)}
          className="mt-10"
        >
          {PARTNERS_CONTENT.pathways.map((pathway, index) => (
            <GlassCard key={pathway.id} className="p-7 flex flex-col justify-between h-full rounded-3xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400">
                    PATHWAY 0{index + 1}
                  </span>
                  <Handshake className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                  {pathway.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-zinc-300">
                  {pathway.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-slate-200/70 dark:border-white/[0.08] pt-4 text-sm text-slate-600 dark:text-zinc-300">
                  {pathway.focusTopics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 rounded-xs bg-slate-400 dark:bg-zinc-500 shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200/70 dark:border-white/[0.08]">
                <AppleButton
                  to={
                    pathway.id === 'individual-contributors'
                      ? '/join?source=partners'
                      : `/contact?category=${encodeURIComponent(pathway.enquiryCategoryValue)}&source=partners&pathway=${pathway.id}`
                  }
                  variant="secondary"
                  size="sm"
                  withArrow
                  className="w-full justify-center rounded-full"
                >
                  {pathway.ctaLabel}
                </AppleButton>
              </div>
            </GlassCard>
          ))}
        </PlanetaryCardSection>
      </section>

      {/* Direct Partner Dialogue Section */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <GlassCard variant="elevated" className="p-8 sm:p-11 rounded-3xl">
            {submissionResult ? (
              <div className="py-8 text-center space-y-5" role="status" aria-live="polite">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                  Proposal Delivered
                </h2>
                <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-600 dark:text-zinc-300">
                  Your partnership proposal has been forwarded directly to Revatya&apos;s operations desk. A team lead will review and respond promptly.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.04] px-4 py-1.5 font-mono text-xs text-slate-700 dark:text-zinc-300">
                  <span>Reference ID:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{submissionResult.referenceId}</span>
                </div>
                <div className="pt-4">
                  <AppleButton
                    onClick={() => {
                      setSubmissionResult(null);
                      setPartnerName('');
                      setPartnerEmail('');
                      setPartnerOrg('');
                      setPartnerMessage('');
                    }}
                    variant="secondary"
                    size="sm"
                    className="mx-auto"
                  >
                    Send another proposal
                  </AppleButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} noValidate className="space-y-6">
                <div className="border-b border-slate-200/70 dark:border-white/[0.08] pb-4">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    <Sparkles className="h-4 w-4" />
                    <span>Direct Dialogue</span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                    Propose a Collaboration
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                    Submit your capability or research proposal directly to Revatya team operations.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="partner-name"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Name <span className="text-slate-900 dark:text-white">*</span>
                    </label>
                    <input
                      id="partner-name"
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Your full name"
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-4 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                    />
                    {formErrors.name && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="partner-email"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Work Email <span className="text-slate-900 dark:text-white">*</span>
                    </label>
                    <input
                      id="partner-email"
                      type="email"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      placeholder="you@organisation.com"
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-4 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                    />
                    {formErrors.email && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="partner-org"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Organisation / Role (optional)
                    </label>
                    <input
                      id="partner-org"
                      type="text"
                      value={partnerOrg}
                      onChange={(e) => setPartnerOrg(e.target.value)}
                      placeholder="Company, university, or lab"
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-4 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="partner-pathway"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Primary Pathway
                    </label>
                    <select
                      id="partner-pathway"
                      value={partnerPathway}
                      onChange={(e) => setPartnerPathway(e.target.value)}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#0B0F17] px-4 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                    >
                      {PARTNERS_CONTENT.pathways.map((p) => (
                        <option key={p.id} value={p.enquiryCategoryValue}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="partner-message"
                    className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                  >
                    Collaboration Proposal <span className="text-slate-900 dark:text-white">*</span>
                  </label>
                  <textarea
                    id="partner-message"
                    rows={4}
                    value={partnerMessage}
                    onChange={(e) => setPartnerMessage(e.target.value)}
                    placeholder="Briefly outline your relevant technology, research, or proposed collaboration model..."
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-4 py-3 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors resize-y"
                  />
                  {formErrors.message && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {formErrors.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <AppleButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    withArrow
                    className="w-full justify-center rounded-full active:scale-[0.98] transition-all"
                  >
                    {isSubmitting ? 'Delivering proposal...' : 'Initiate Partnership Dialogue'}
                  </AppleButton>
                  <p className="mt-3 text-center text-xs text-slate-500 dark:text-zinc-500">
                    By submitting, you agree to Revatya contacting you regarding this partnership dialogue.
                  </p>
                </div>
              </form>
            )}
          </GlassCard>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default PartnersPage;
