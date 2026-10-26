import React, { useState } from 'react';
import { PageMeta } from '../components/seo/PageMeta';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { JOIN_CONTENT } from '../data/siteContent';
import { submitJoinInterest, SubmissionResult } from '../lib/submissions';
import { CheckCircle2, AlertCircle, UserPlus, Sparkles } from 'lucide-react';

export const JoinPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [discipline, setDiscipline] = useState(JOIN_CONTENT.contributionAreas[0]);
  const [experienceSummary, setExperienceSummary] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [interestStatement, setInterestStatement] = useState('');
  const [availability, setAvailability] = useState('Research exchange / advisory discussions');
  const [consent, setConsent] = useState(false);

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
    if (!consent) {
      nextErrors.consent = 'Please confirm your consent to be contacted.';
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
        consent,
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
      <section data-hero-section="true" className="pt-16 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up" className="max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                {JOIN_CONTENT.hero.eyebrow}
              </span>
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-[#F5F5F7] sm:text-6xl leading-[1.08]">
              {JOIN_CONTENT.hero.headline}
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-zinc-300 max-w-3xl">
              {JOIN_CONTENT.hero.body}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Contribution Areas & Honest Notice */}
          <ScrollReveal variant="slide-right" className="lg:col-span-5 space-y-6">
            <GlassCard className="p-7 sm:p-8">
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
            </GlassCard>
          </ScrollReveal>

          {/* Right Column: Contributor Interest Form */}
          <ScrollReveal variant="fade-up" delayMs={90} className="lg:col-span-7">
            <GlassCard variant="elevated" className="p-7 sm:p-10">
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
                  <p className="font-mono text-xs text-slate-600 dark:text-zinc-300">
                    Reference ID: {submissionResult.referenceId}
                  </p>
                  <div className="pt-4">
                    <AppleButton
                      onClick={() => {
                        setSubmissionResult(null);
                        setFullName('');
                        setEmail('');
                        setExperienceSummary('');
                        setInterestStatement('');
                        setConsent(false);
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      Submit another introduction
                    </AppleButton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/[0.08] pb-4">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
                        {JOIN_CONTENT.ctaLabel}
                      </h2>
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
                        placeholder="name@institution.org"
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
                        htmlFor="join-discipline"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Primary discipline <span className="text-slate-900 dark:text-white">*</span>
                      </label>
                      <select
                        id="join-discipline"
                        value={discipline}
                        onChange={(e) => setDiscipline(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#0B0F17] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                      >
                        {JOIN_CONTENT.contributionAreas.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="join-location"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Location / Timezone (optional)
                      </label>
                      <input
                        id="join-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Bengaluru / London / UTC+5:30"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="join-experience"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Relevant experience or research background <span className="text-slate-900 dark:text-white">*</span>
                    </label>
                    <textarea
                      id="join-experience"
                      rows={3}
                      value={experienceSummary}
                      onChange={(e) => setExperienceSummary(e.target.value)}
                      placeholder="Briefly describe your domain expertise, engineering work, or academic research..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                    />
                    {errors.experienceSummary && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.experienceSummary}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="join-interest"
                      className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                    >
                      Specific problem or question you want to explore with Revatya{' '}
                      <span className="text-slate-900 dark:text-white">*</span>
                    </label>
                    <textarea
                      id="join-interest"
                      rows={3}
                      value={interestStatement}
                      onChange={(e) => setInterestStatement(e.target.value)}
                      placeholder="Describe the subsystem, architectural challenge, or techno-economic problem you want to contribute to..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
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
                        htmlFor="join-portfolio"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Portfolio, publication, or profile link (optional)
                      </label>
                      <input
                        id="join-portfolio"
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://orcid.org/... or GitHub"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="join-availability"
                        className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                      >
                        Preferred mode of contribution
                      </label>
                      <select
                        id="join-availability"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#0B0F17] px-3.5 py-2.5 text-base text-slate-900 dark:text-[#F5F5F7] focus:border-slate-900 dark:focus:border-white/40 focus:outline-none"
                      >
                        <option value="Research exchange / advisory discussions">
                          Research exchange / advisory discussions
                        </option>
                        <option value="Co authoring technical briefs or trade studies">
                          Co authoring technical briefs or trade studies
                        </option>
                        <option value="Subsystem modelling & simulation">
                          Subsystem modelling & simulation
                        </option>
                        <option value="Academic / laboratory collaboration">
                          Academic / laboratory collaboration
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
                        I consent to Revatya storing these details to review my introduction and contact me regarding relevant research or technical discussions.
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
