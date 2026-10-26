import React from 'react';
import { PageMeta } from '../components/seo/PageMeta';
import { GlassCard } from '../components/ui/GlassCard';
import { AppleButton } from '../components/ui/AppleButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <PageMeta
        customMeta={{
          title: 'Page Not Found | Revatya',
          description: 'The requested coordinates could not be located on the Revatya website.',
          path: '/404',
        }}
      />
      <ScrollReveal variant="scale-in">
        <GlassCard variant="elevated" className="p-10 sm:p-16 text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/[0.05] dark:bg-white/[0.06] border border-slate-900/10 dark:border-white/[0.1] text-slate-800 dark:text-zinc-200">
            <Compass className="h-7 w-7" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
            404 · COORDINATES NOT FOUND
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-[#F5F5F7]">
            This orbital sector does not exist.
          </h1>
          <p className="mx-auto max-w-md text-sm sm:text-base text-slate-600 dark:text-zinc-300">
            The page you requested may have moved, or the URL may be mistyped. Return to the main station or inspect the Interactive City Atlas.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <AppleButton href="/" variant="primary" size="md" withArrow>
              Return to Home
            </AppleButton>
            <AppleButton href="/city-atlas" variant="secondary" size="md">
              Open City Atlas
            </AppleButton>
          </div>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
};

export default NotFoundPage;
