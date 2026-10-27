import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageMeta } from '../components/seo/PageMeta';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { HeroSection } from '../components/ui/HeroSection';
import { JOIN_CONTENT } from '../data/siteContent';
import { submitJoinInterest, SubmissionResult } from '../lib/submissions';
import { CheckCircle2, AlertCircle, UserPlus, Sparkles, Handshake } from 'lucide-react';

export const JoinPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sourceParam = searchParams.get('source');
  const isFromPartners = sourceParam === 'partners';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [discipline, setDiscipline] = useState(JOIN_CONTENT.contributionAreas[0]);
  const [experienceSummary, setExperienceSummary] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [interestStatement, setInterestStatement] = useState('');
  const [availability, setAvailability] = useState('Research exchange / advisory discussions');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = 'Please enter your name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!discipline) nextErrors.discipline = 'Select a primary discipline.';
    if (experienceSummary.trim().length < 10) {
      nextErrors.experienceSummary =
        'Please provide a brief summary of your background (at least 10 characters).';
    }
    if (interestStatement.trim().length < 10) {
      nextErrors.interestStatement =
        'Please describe the problem or research area you wish to explore (at least 10 characters).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await submitJoinInterest({
        fullName,
        email,
        location,
        discipline,
        experienceSummary,
        portfolioUrl,
        interestStatement,
        availability,
        consent: true,
      });
      setSubmissionResult(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-20 pb-24">
      <PageMeta pageKey="join" />

      {/* Hero Section */}
      <HeroSection
        eyebrow={JOIN_CONTENT.hero.eyebrow}
        headline={JOIN_CONTENT.hero.headline}
        body={JOIN_CONTENT.hero.body}
      />

      {/* Main Content Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Contribution Areas */}
          <ScrollReveal variant="slide-right" className="lg:col-span-5 space-y-6">
            <GlassCard className="p-7 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <Sparkles className="h-4 w-4" />
                9 Relevant Disciplines
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                Areas where specialist input is valuable.
              </h2>
              <ul className="mt-5 space-y-3 text-base text-slate-700 dark:text-zinc-300">
                {JOIN_CONTENT.contributionAreas.map((area) => (
                  <li key={area} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-slate-700 dark:text-zinc-300 shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-slate-200/70 dark:border-white/[0.08] pt-4">
                <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                  {JOIN_CONTENT.honestEmploymentNotice}
                </p>
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* Right Column: Contributor Interest Form */}
          <ScrollReveal variant="fade-up" delayMs={90} className="lg:col-span-7">
            <GlassCard variant="elevated" className="p-7 sm:p-10 rounded-3xl">
              {submissionResult ? (
                <div className="py-8 text-center space-y-5" role="status" aria-live="polite">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/[0.06] dark:bg-white/[0.08] text-slate-900 dark:text-[#F5F5F7]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                    Thank you for introducing your work.
                  </h2>
                  <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-600 dark:text-zinc-300">
                    Your contributor profile has been recorded. When a research stream or technical review aligns with your discipline, we will reach out using the contact details provided.
                  </p>
                  <div className="pt-4">
                    <AppleButton
                      onClick={() => {
                        setSubmissionResult(null);
                        setFullName('');
                        setEmail('');
                        setLocation('');
                        setExperienceSummary('');
                        setPortfolioUrl('');
                        setInterestStatement('');
                      }}
                      variant="secondary"
                      size="sm"
                      className="mx-auto"
                    >
                      Submit another introduction
                    </AppleButton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/[0.08] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                          {JOIN_CONTENT.ctaLabel}
                        </h2>
                        {isFromPartners && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[11px] text-sky-600 dark:text-sky-400">
                            <Handshake className="h-3 w-3" />
                            Pathway 06
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                        Share your background and the specific orbital or habitat problem you want to examine.
                      </p>
                    </div>
                    <UserPlus className="h-5 w-5 text-slate-600 dark:text-zinc-300" />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="join-fullName"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Full name <span className="text-slate-900 dark:text-white">*</span>
                      </label>
                      <input
                        id="join-fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Aditi Rao"
                        className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                      />
                      {errors.fullName && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="join-email"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Email address <span className="text-slate-900 dark:text-white">*</span>
                      </label>
                      <input
                        id="join-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="aditi@research.org"
                        className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
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
                        htmlFor="join-location"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Location or timezone (optional)
                      </label>
                      <input
                        id="join-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Bengaluru, UTC+5:30"
                        className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="join-discipline"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Primary discipline <span className="text-slate-900 dark:text-white">*</span>
                      </label>
                      <select
                        id="join-discipline"
                        value={discipline}
                        onChange={(e) => setDiscipline(e.target.value)}
                        className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#0B0F17] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                      >
                        {JOIN_CONTENT.contributionAreas.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="join-experienceSummary"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Relevant experience <span className="text-slate-900 dark:text-white">*</span>
                    </label>
                    <textarea
                      id="join-experienceSummary"
                      rows={3}
                      value={experienceSummary}
                      onChange={(e) => setExperienceSummary(e.target.value)}
                      placeholder="Degrees, past projects, laboratory experience, or publications..."
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors resize-y"
                    />
                    {errors.experienceSummary && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.experienceSummary}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="join-interestStatement"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Specific problem or focus <span className="text-slate-900 dark:text-white">*</span>
                    </label>
                    <textarea
                      id="join-interestStatement"
                      rows={3}
                      value={interestStatement}
                      onChange={(e) => setInterestStatement(e.target.value)}
                      placeholder="What exact question, calculation, design problem, or simulation do you want to explore?"
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors resize-y"
                    />
                    {errors.interestStatement && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.interestStatement}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="join-portfolioUrl"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Portfolio or research link (optional)
                      </label>
                      <input
                        id="join-portfolioUrl"
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://..."
                        className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="join-availability"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Preferred engagement format
                      </label>
                      <select
                        id="join-availability"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#0B0F17] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none transition-colors"
                      >
                        <option value="Research exchange / advisory discussions">
                          Research exchange / advisory discussions
                        </option>
                        <option value="Part time independent research / modeling">
                          Part time independent research / modeling
                        </option>
                        <option value="Formal academic or institutional collaboration">
                          Formal academic or institutional collaboration
                        </option>
                      </select>
                    </div>
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
                      {isSubmitting ? 'Submitting introduction...' : JOIN_CONTENT.ctaLabel}
                    </AppleButton>
                  </div>
                </form>
              )}
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default JoinPage;
