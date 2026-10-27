import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageMeta } from '../components/seo/PageMeta';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { HeroSection } from '../components/ui/HeroSection';
import { CONTACT_CONTENT } from '../data/siteContent';
import { submitContactInquiry, SubmissionResult } from '../lib/submissions';
import { CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategoryParam = searchParams.get('category');

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
  const [role, setRole] = useState('');
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
        role,
        category,
        message,
        sourcePage,
        consent,
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
        eyebrow={CONTACT_CONTENT.hero.eyebrow}
        headline={CONTACT_CONTENT.hero.headline}
        body={CONTACT_CONTENT.hero.body}
      />

      {/* Contact Form */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up" delayMs={90}>
          <GlassCard variant="elevated" className="p-7 sm:p-10">
              {submissionResult ? (
                <div className="py-8 text-center space-y-5" role="status" aria-live="polite">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/[0.06] dark:bg-white/[0.08] text-slate-900 dark:text-[#F5F5F7]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                    Enquiry Received
                  </h2>
                  <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-600 dark:text-zinc-300">
                    {CONTACT_CONTENT.successMessage}
                  </p>
                  <p className="font-mono text-xs text-slate-600 dark:text-zinc-300">
                    Reference ID: {submissionResult.referenceId}
                  </p>
                  <div className="pt-4">
                    <AppleButton
                      onClick={() => {
                        setSubmissionResult(null);
                        setFullName('');
                        setEmail('');
                        setOrganisation('');
                        setRole('');
                        setMessage('');
                        setSourcePage('');
                        setConsent(false);
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      Send another enquiry
                    </AppleButton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/[0.08] pb-4">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                        Send an enquiry
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                        Fields marked with <span className="text-slate-900 dark:text-white">*</span> are required.
                      </p>
                    </div>
                    <MessageSquare className="h-5 w-5 text-slate-600 dark:text-zinc-300" />
                  </div>

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
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                      />
                      {errors.fullName && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.fullName}
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
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                      />
                      {errors.email && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-organisation"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Organisation (optional)
                      </label>
                      <input
                        id="contact-organisation"
                        type="text"
                        value={organisation}
                        onChange={(e) => setOrganisation(e.target.value)}
                        placeholder="Company, laboratory, or institution"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-role"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Role or discipline (optional)
                      </label>
                      <input
                        id="contact-role"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g., Principal Systems Engineer"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                      />
                    </div>
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
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#0B0F17] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                    >
                      {CONTACT_CONTENT.enquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.category}
                      </p>
                    )}
                  </div>

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
                      placeholder="Describe your question, technical capability, research proposal, or potential collaboration..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                    />
                    {errors.message && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-link"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Optional link or reference
                    </label>
                    <input
                      id="contact-link"
                      type="url"
                      value={sourcePage}
                      onChange={(e) => setSourcePage(e.target.value)}
                      placeholder="https://..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        id="contact-consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
                        I consent to Revatya storing my enquiry details so the team can review my message and respond if relevant.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.consent}
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
                      className="w-full justify-center"
                    >
                      {isSubmitting ? 'Submitting enquiry...' : CONTACT_CONTENT.submitButton}
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
