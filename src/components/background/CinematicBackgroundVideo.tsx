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

  const targetTimeRef = useRef<number>(0.04);
  const currentTimeRef = useRef<number>(0.04);
  const isLoopActiveRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const heroBottomRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Smooth RAF scrub loop with spring damping physics
  const startScrubLoop = () => {
    if (isLoopActiveRef.current) return;
    isLoopActiveRef.current = true;

    const step = () => {
      const video = videoRef.current;
      const target = targetTimeRef.current;
      const current = currentTimeRef.current;
      const delta = target - current;

      // Spring physics interpolation for fluid Apple-grade scrubbing response
      currentTimeRef.current = current + delta * 0.18;

      if (
        video &&
        !isSeekingRef.current &&
        video.readyState >= 2 &&
        Math.abs(video.currentTime - currentTimeRef.current) > 0.02
      ) {
        try {
          video.currentTime = currentTimeRef.current;
        } catch {
          // Safeguard against browser seek aborts
        }
      }

      // Continue animating while there is delta to resolve
      if (Math.abs(delta) > 0.003 && isScrollingRef.current) {
        rafIdRef.current = window.requestAnimationFrame(step);
      } else {
        isLoopActiveRef.current = false;
        rafIdRef.current = null;

        // If scrolling has stopped and hero is past, initiate subtle ambient playback
        if (!isScrollingRef.current && video && !prefersReducedMotion) {
          try {
            if (video.paused) {
              video.playbackRate = 0.65;
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Handled if browser prevents autoplay
                });
              }
            }
          } catch {
            // Guard against test environment stubs
          }
        }
      }
    };

    rafIdRef.current = window.requestAnimationFrame(step);
  };

  // Re-measure hero boundary and attach scroll/intersection observer
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
        // Sensible fallback for routes without an explicit hero container
        heroBottomRef.current = window.innerHeight * 0.55;
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroBottom = heroBottomRef.current;
      const video = videoRef.current;

      // Hero visibility state: strictly hidden when hero is in view
      const heroThreshold = heroBottom - 48;
      const heroActive = scrollY < heroThreshold;
      setIsHeroVisible(heroActive);

      if (heroActive || prefersReducedMotion) {
        if (video && !video.paused) {
          try {
            video.pause();
          } catch {
            // Guard
          }
        }
        targetTimeRef.current = 0.04;
        currentTimeRef.current = 0.04;
        startScrubLoop();
        return;
      }

      // User is actively scrolling: pause ambient playback and sync video timeline
      isScrollingRef.current = true;
      if (video && !video.paused) {
        try {
          video.pause();
        } catch {
          // Guard
        }
        // Resync current reference to actual video position so scrubbing has zero jump
        currentTimeRef.current = video.currentTime;
      }

      // Clear existing idle debounce timer
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Detect when scrolling ceases to resume subtle ambient motion
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        const currentVid = videoRef.current;
        if (currentVid && !prefersReducedMotion) {
          try {
            if (currentVid.paused) {
              currentVid.playbackRate = 0.65;
              const p = currentVid.play();
              if (p !== undefined) {
                p.catch(() => {});
              }
            }
          } catch {
            // Guard
          }
        }
      }, 140);

      // Calculate scroll progress across non-hero sections through to footer
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = documentHeight - heroBottom - viewportHeight;

      let progress = 0;
      if (scrollableDistance > 0) {
        progress = (scrollY - heroBottom) / scrollableDistance;
      } else {
        progress = 1;
      }

      // Constrain progress [0, 1]
      const clampedProgress = Math.max(0, Math.min(1, progress));
      const duration = video && video.duration && !isNaN(video.duration) && video.duration > 0
        ? video.duration
        : 8.0;

      // Map progress smoothly to video timeline (with slight padding to avoid loop wrap)
      const targetTime = 0.04 + clampedProgress * (duration - 0.08);
      targetTimeRef.current = Math.max(0.04, Math.min(duration - 0.04, targetTime));

      startScrubLoop();
    };

    // Initial measurement after DOM render
    const timer = setTimeout(() => {
      updateHeroMetrics();
      handleScroll();

      // IntersectionObserver for additional high-precision hero boundary tracking
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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (observer) {
        observer.disconnect();
      }
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      isLoopActiveRef.current = false;
    };
  }, [pathname, prefersReducedMotion]);

  // Handle video timeline loops during ambient playback
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isScrollingRef.current) return;

    const duration = video.duration && !isNaN(video.duration) && video.duration > 0
      ? video.duration
      : 8.0;

    // Loop gracefully before hard end to maintain seamless motion
    if (video.currentTime >= duration - 0.08) {
      video.currentTime = 0.04;
    }
  };

  // Video seeking guards
  const handleSeeking = () => {
    isSeekingRef.current = true;
  };

  const handleSeeked = () => {
    isSeekingRef.current = false;
  };

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700 ease-out select-none ${
        isHeroVisible ? 'opacity-0' : 'opacity-100'
      } ${className}`}
      aria-hidden="true"
    >
      {/* High-definition cinematic orbital metropolis video with ambient camera breathing */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster="/images/background/orbital-city-scroll-poster.webp"
        onSeeking={handleSeeking}
        onSeeked={handleSeeked}
        onTimeUpdate={handleTimeUpdate}
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
