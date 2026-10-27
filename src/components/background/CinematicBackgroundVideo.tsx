import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface CinematicBackgroundVideoProps {
  className?: string;
}

export const CinematicBackgroundVideo: React.FC<CinematicBackgroundVideoProps> = ({
  className = '',
}) => {
  const { pathname } = useLocation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const heroBottomRef = useRef<number>(0);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Ensure continuous looped video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      try {
        video.pause();
      } catch {
        // Guard against environment restrictions
      }
    } else {
      try {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Handled if browser prevents autoplay
          });
        }
      } catch {
        // Guard against test environment stubs
      }
    }
  }, [prefersReducedMotion, pathname]);

  // Re-measure hero boundary and observe scroll visibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let heroEl: HTMLElement | null = null;
    let observer: IntersectionObserver | null = null;

    const updateHeroMetrics = () => {
      // Find the hero section for the current route
      heroEl =
        (document.querySelector('[data-hero-section="true"]') as HTMLElement | null) ||
        (document.getElementById('chapter-arrival') as HTMLElement | null) ||
        (document.querySelector('main header') as HTMLElement | null);

      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        heroBottomRef.current = window.scrollY + rect.bottom;
      } else {
        // Fallback for routes without an explicit hero section: reveal body background immediately
        heroBottomRef.current = 0;
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroBottom = heroBottomRef.current;

      if (heroBottom <= 0) {
        setIsHeroVisible(false);
        return;
      }

      // Hero visibility state: strictly hidden when hero is in view
      const heroThreshold = heroBottom - 48;
      const heroActive = scrollY < heroThreshold;
      setIsHeroVisible(heroActive);
    };

    // Initial measurement after DOM render
    const timer = setTimeout(() => {
      updateHeroMetrics();
      handleScroll();

      // IntersectionObserver for high-precision hero boundary tracking
      if (heroEl && typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const rect = entry.boundingClientRect;
              if (rect.bottom <= 48) {
                setIsHeroVisible(false);
              } else {
                setIsHeroVisible(true);
              }
            }
          },
          {
            rootMargin: '-48px 0px 0px 0px',
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
          }
        );
        observer.observe(heroEl);
      }
    }, 60);

    const handleResize = () => {
      updateHeroMetrics();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]);

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700 ease-out select-none ${
        isHeroVisible ? 'opacity-0' : 'opacity-100'
      } ${className}`}
      aria-hidden="true"
    >
      {/* High-definition cinematic orbital metropolis video on seamless continuous loop */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/background/orbital-city-scroll-poster.webp"
        className="w-full h-full object-cover object-center scale-[1.03] opacity-80 dark:opacity-65 transition-transform duration-500 will-change-transform orbital-camera-breathe"
      >
        <source src="/video/orbital-city-scroll.mp4" type="video/mp4" />
        <source src="/video/orbital-city-scroll.webm" type="video/webm" />
      </video>

      {/* Dual-theme adaptive scrim overlays for pristine WCAG AAA contrast */}
      {/* Dark mode: deep obsidian glass layer */}
      <div className="absolute inset-0 bg-[#020305]/75 mix-blend-multiply pointer-events-none" />

      {/* Light mode: frosted architectural diffusion */}
      <div className="absolute inset-0 bg-[#F5F5F7]/85 dark:bg-transparent pointer-events-none backdrop-blur-[0.5px]" />

      {/* Multi-stop ambient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F7]/60 via-transparent to-[#F5F5F7]/80 dark:from-[#020305]/70 dark:via-transparent dark:to-[#020305]/85 pointer-events-none" />

      {/* Specular hairline top highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-slate-900/[0.06] dark:bg-white/[0.08] pointer-events-none" />
    </div>
  );
};
