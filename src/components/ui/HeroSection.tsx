import React, { useRef, useEffect } from 'react';
import { useScrollParallax, ScrollReveal } from './ScrollReveal';
import { HOME_CONTENT } from '../../data/siteContent';

export interface HeroSectionProps {
  id?: string;
  eyebrow?: string;
  headline?: React.ReactNode;
  body?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  videoSrc?: string;
  posterSrc?: string;
  videoAlt?: string;
  className?: string;
  contentClassName?: string;
  headlineClassName?: string;
  eyebrowClassName?: string;
  bodyClassName?: string;
  minHeightClassName?: string;
  parallaxSpeed?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  id,
  eyebrow,
  headline,
  body,
  actions,
  children,
  videoSrc = HOME_CONTENT.hero.videoSrc,
  posterSrc = HOME_CONTENT.hero.imageSrc,
  videoAlt = HOME_CONTENT.hero.imageAlt,
  className = '',
  contentClassName = '',
  headlineClassName = 'text-4xl sm:text-6xl font-semibold tracking-tight text-slate-950 dark:text-[#F5F5F7] leading-[1.06]',
  eyebrowClassName = 'text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-[#A1A1AA]',
  bodyClassName = 'text-lg sm:text-xl text-slate-600 dark:text-[#A1A1AA] leading-relaxed max-w-2xl',
  minHeightClassName = 'min-h-[52vh] sm:min-h-[58vh] md:min-h-[64vh]',
  parallaxSpeed = 0.08,
}) => {
  const heroParallaxOffset = useScrollParallax(parallaxSpeed);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Handled if browser prevents autoplay
      });
    }
  }, []);

  return (
    <section
      id={id}
      data-hero-section="true"
      className={`relative -mt-28 md:-mt-32 w-full overflow-hidden flex items-end pb-14 sm:pb-20 pt-32 sm:pt-40 md:pt-44 border-b border-slate-900/[0.08] dark:border-white/[0.07] ${minHeightClassName} ${className}`}
    >
      {/* Full bleed background video with scroll linked parallax */}
      <div
        className="absolute inset-0 z-0 overflow-hidden bg-[#020305]"
        style={{
          transform: `translate3d(0, ${heroParallaxOffset}px, 0) scale(1.04)`,
          willChange: 'transform',
        }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-label={videoAlt}
          className="w-full h-full object-cover object-center opacity-75 dark:opacity-65"
        />
      </div>

      {/* Multi stop optical scrims for legibility in both Light and Dark mode */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/75 to-[#F5F5F7]/30 dark:from-[#020305] dark:via-[#020305]/72 dark:to-[#020305]/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#F5F5F7]/90 via-[#F5F5F7]/55 to-transparent dark:from-[#020305]/92 dark:via-[#020305]/60 dark:to-transparent"
      />

      {/* Foreground architectural content */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${contentClassName}`}
      >
        {children ? (
          children
        ) : (
          <div className="max-w-3xl space-y-6">
            {eyebrow && (
              <ScrollReveal variant="fade-up" delayMs={40}>
                <p className={eyebrowClassName}>{eyebrow}</p>
              </ScrollReveal>
            )}

            {headline && (
              <ScrollReveal variant="fade-up" delayMs={110}>
                <h1 className={headlineClassName}>{headline}</h1>
              </ScrollReveal>
            )}

            {body && (
              <ScrollReveal variant="fade-up" delayMs={180}>
                <p className={bodyClassName}>{body}</p>
              </ScrollReveal>
            )}

            {actions && (
              <ScrollReveal variant="fade-up" delayMs={250}>
                {actions}
              </ScrollReveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
