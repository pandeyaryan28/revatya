import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageMeta } from '../components/seo/PageMeta';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { HeroSection } from '../components/ui/HeroSection';
import { CONTACT_CONTENT } from '../data/siteContent';
import { submitContactInquiry, SubmissionResult } from '../lib/submissions';
import { CheckCircle2, AlertCircle, MessageSquare, Handshake, ArrowRight } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategoryParam = searchParams.get('category');
  const sourceParam = searchParams.get('source');
  const pathwayParam = searchParams.get('pathway');
  const isFromPartners = sourceParam === 'partners' || Boolean(pathwayParam);

  const resolveInitialCategory = (): string => {
    if (!initialCategoryParam) return CONTACT_CONTENT.enquiryTypes[0];
    const match = CONTACT_CONTENT.enquiryTypes.find(
      (t) =>
        t.toLowerCase() === initialCategoryParam.toLowerCase() ||
        t.toLowerCase().includes(initialCategoryParam.toLowerCase().replace(/-/g, ' '))
    );
    return match || CONTACT_CONTENT.enquiryTypes[0];
  };

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [category, setCategory] = useState<string>(resolveInitialCategory);
  const [message, setMessage] = useState('');
  const [sourcePage, setSourcePage] = useState('');
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    setCategory(resolveInitialCategory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategoryParam]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      nextErrors.fullName = CONTACT_CONTENT.validationMessages.name;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = CONTACT_CONTENT.validationMessages.email;
    }
    if (!category) {
      nextErrors.category = CONTACT_CONTENT.validationMessages.enquiryType;
    }
    if (message.trim().length < 10) {
      nextErrors.message = CONTACT_CONTENT.validationMessages.message;
    }
    if (!consent) {
      nextErrors.consent = CONTACT_CONTENT.validationMessages.consent;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await submitContactInquiry({
        fullName,
        email,
        organisation,
        category,
        message,
        sourcePage,
        consent,
        originatingPage: isFromPartners ? 'Partners Page' : 'Contact Page',
        pathwayId: pathwayParam || undefined,
      });
      setSubmissionResult(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-20 pb-24">
      <PageMeta pageKey="contact" />

      {/* Hero Section */}
      <HeroSection
        eyebrow={isFromPartners ? 'PARTNERSHIP DESK' : CONTACT_CONTENT.hero.eyebrow}
        headline={isFromPartners ? 'Initiate Collaboration Dialogue' : CONTACT_CONTENT.hero.headline}
        body={
          isFromPartners
            ? 'Connect directly with Revatya regarding technical partnerships, research consortia, or infrastructure alignment.'
            : CONTACT_CONTENT.hero.body
        }
      />

      {/* Simplified Contact Form */}
      <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up" delayMs={90}>
          <GlassCard variant="elevated" className="p-7 sm:p-10 rounded-3xl">
            {submissionResult ? (
              <div className="py-8 text-center space-y-5" role="status" aria-live="polite">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                  Enquiry Received
                </h2>
                <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-600 dark:text-zinc-300">
                  {CONTACT_CONTENT.successMessage}
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.04] px-4 py-1.5 font-mono text-xs text-slate-700 dark:text-zinc-300">
                  <span>Reference ID:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{submissionResult.referenceId}</span>
                </div>
                <div className="pt-4">
                  <AppleButton
                    onClick={() => {
                      setSubmissionResult(null);
                      setFullName('');
                      setEmail('');
                      setOrganisation('');
                      setMessage('');
                      setSourcePage('');
                      setConsent(false);
                    }}
                    variant="secondary"
                    size="sm"
                    className="mx-auto"
                  >
                    Send another enquiry
                  </AppleButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Header with optional Partner Badge */}
                <div className="border-b border-slate-200/70 dark:border-white/[0.08] pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                        {isFromPartners ? 'Partnership Enquiry' : 'Send an enquiry'}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                        Direct routing to Revatya team operations.
                      </p>
                    </div>
                    {isFromPartners ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-xs text-sky-600 dark:text-sky-400">
                        <Handshake className="h-3.5 w-3.5" />
                        Partner
                      </span>
                    ) : (
                      <MessageSquare className="h-5 w-5 text-slate-500 dark:text-zinc-400" />
                    )}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Name <span className="text-slate-900 dark:text-white">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-4 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                    />
                    {errors.fullName && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Email <span className="text-slate-900 dark:text-white">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@organisation.com"
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-4 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                    />
                    {errors.email && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Organisation & Category */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-organisation"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Organisation / Role (optional)
                    </label>
                    <input
                      id="contact-organisation"
                      type="text"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      placeholder="e.g. Acme Space, Systems Lead"
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-4 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-category"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Enquiry type <span className="text-slate-900 dark:text-white">*</span>
                    </label>
                    <select
                      id="contact-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#0B0F17] px-4 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                    >
                      {CONTACT_CONTENT.enquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                  >
                    Message <span className="text-slate-900 dark:text-white">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question, technical capability, or proposal..."
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-4 py-3 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors resize-y"
                  />
                  {errors.message && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.message}
                    </p>
                  )}
                </div>

                {/* Consent */}
                <div className="pt-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      id="contact-consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded-md border-slate-300 text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 focus:ring-slate-900 cursor-pointer"
                    />
                    <span className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                      I agree to Revatya reviewing my details and following up regarding this enquiry.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.consent}
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <AppleButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    withArrow
                    className="w-full justify-center rounded-full active:scale-[0.98] transition-all"
                  >
                    {isSubmitting ? 'Routing enquiry...' : CONTACT_CONTENT.submitButton}
                  </AppleButton>
                </div>
              </form>
            )}
          </GlassCard>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default ContactPage;
