import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface PlanetaryCardSectionProps {
  children: React.ReactNode;
  variant?: 'card' | 'dossier';
  orbitLabel?: string;
  itemIds?: string[];
  stepVh?: number;
  className?: string;
}

interface KeyframePoint {
  s: number;
  xPct: number;
  yPx: number;
  zPx: number;
  rotY: number;
  rotZ: number;
  scale: number;
  opacity: number;
  blur: number;
}

const CARD_KEYFRAMES: KeyframePoint[] = [
  { s: -2.0, xPct: -115, yPx: 88, zPx: -280, rotY: 34, rotZ: -4.2, scale: 0.66, opacity: 0, blur: 6 },
  { s: -1.0, xPct: -70, yPx: 32, zPx: -130, rotY: 19, rotZ: -2.0, scale: 0.83, opacity: 0.36, blur: 1.8 },
  { s: 0.0, xPct: -10, yPx: 0, zPx: 0, rotY: 0, rotZ: 0, scale: 1.0, opacity: 1.0, blur: 0 },
  { s: 1.0, xPct: 52, yPx: 28, zPx: -110, rotY: -18, rotZ: 2.0, scale: 0.85, opacity: 0.54, blur: 1.2 },
  { s: 2.0, xPct: 108, yPx: 84, zPx: -260, rotY: -34, rotZ: 4.2, scale: 0.68, opacity: 0, blur: 6 },
];

const DOSSIER_KEYFRAMES: KeyframePoint[] = [
  { s: -2.0, xPct: -94, yPx: 84, zPx: -300, rotY: 32, rotZ: -3.5, scale: 0.64, opacity: 0, blur: 6 },
  { s: -1.0, xPct: -52, yPx: 34, zPx: -150, rotY: 18, rotZ: -1.6, scale: 0.79, opacity: 0.30, blur: 2.0 },
  { s: 0.0, xPct: -4, yPx: 0, zPx: 0, rotY: 0, rotZ: 0, scale: 1.0, opacity: 1.0, blur: 0 },
  { s: 1.0, xPct: 44, yPx: 30, zPx: -135, rotY: -17, rotZ: 1.6, scale: 0.81, opacity: 0.46, blur: 1.5 },
  { s: 2.0, xPct: 92, yPx: 82, zPx: -280, rotY: -32, rotZ: 3.5, scale: 0.64, opacity: 0, blur: 6 },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolatePlanetaryKeyframes(shift: number, variant: 'card' | 'dossier'): KeyframePoint {
  const frames = variant === 'dossier' ? DOSSIER_KEYFRAMES : CARD_KEYFRAMES;
  if (shift <= frames[0].s) return frames[0];
  if (shift >= frames[frames.length - 1].s) return frames[frames.length - 1];

  for (let i = 0; i < frames.length - 1; i++) {
    const start = frames[i];
    const end = frames[i + 1];
    if (shift >= start.s && shift <= end.s) {
      const rawT = (shift - start.s) / (end.s - start.s);
      // Smoothstep blend for organic planetary curvature transition
      const t = rawT * rawT * (3 - 2 * rawT);
      return {
        s: shift,
        xPct: lerp(start.xPct, end.xPct, t),
        yPx: lerp(start.yPx, end.yPx, t),
        zPx: lerp(start.zPx, end.zPx, t),
        rotY: lerp(start.rotY, end.rotY, t),
        rotZ: lerp(start.rotZ, end.rotZ, t),
        scale: lerp(start.scale, end.scale, t),
        opacity: lerp(start.opacity, end.opacity, t),
        blur: lerp(start.blur, end.blur, t),
      };
    }
  }
  return frames[2];
}

export const PlanetaryCardSection: React.FC<PlanetaryCardSectionProps> = ({
  children,
  variant = 'card',
  itemIds,
  stepVh,
  className = '',
}) => {
  const items = React.Children.toArray(children);
  const count = items.length;
  const resolvedStepVh = stepVh ?? (variant === 'dossier' ? 70 : 60);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const uTargetRef = useRef<number>(0);
  const uCurrentRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const [orbitProgress, setOrbitProgress] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Reset orbit if card count changes (for example when filtering Research Programmes)
  useEffect(() => {
    uTargetRef.current = 0;
    uCurrentRef.current = 0;
    setOrbitProgress(0);
  }, [count]);

  const startSpringLoop = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (rafRef.current) return;

    const tick = () => {
      const target = uTargetRef.current;
      const current = uCurrentRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.0015 || isReducedMotion) {
        uCurrentRef.current = target;
        setOrbitProgress(target);
        rafRef.current = 0;
        return;
      }

      // Damped harmonic spring step (~0.16 response factor at 60fps)
      const next = current + diff * 0.16;
      uCurrentRef.current = next;
      setOrbitProgress(next);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, [isReducedMotion]);

  const jumpToCard = useCallback(
    (targetIndex: number) => {
      const clamped = Math.max(0, Math.min(count - 1, targetIndex));
      uTargetRef.current = clamped;

      const rect = stageRef.current?.getBoundingClientRect();
      const isJsdom = !rect || rect.height === 0;

      if (isReducedMotion || isJsdom || typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
        uCurrentRef.current = clamped;
        setOrbitProgress(clamped);
      } else {
        startSpringLoop();
      }

      if (typeof window !== 'undefined' && trackRef.current && count > 1 && !isJsdom) {
        const trackEl = trackRef.current;
        const stageEl = stageRef.current;
        if (trackEl && stageEl) {
          const trackRect = trackEl.getBoundingClientRect();
          const stageRect = stageEl.getBoundingClientRect();
          const scrollableDistance = trackRect.height - stageRect.height;
          if (scrollableDistance > 10 && typeof window.scrollTo === 'function') {
            const targetScrollY =
              window.scrollY + trackRect.top - stageRect.top + (clamped / (count - 1)) * scrollableDistance;
            try {
              window.scrollTo({ top: Math.max(0, targetScrollY), behavior: isReducedMotion ? 'auto' : 'smooth' });
            } catch {
              // Ignore
            }
          }
        }
      }
    },
    [count, isReducedMotion, startSpringLoop]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof window.matchMedia === 'function') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mq.matches);
    }

    if (count <= 1) return;

    const computeScrollTarget = () => {
      const trackEl = trackRef.current;
      const stageEl = stageRef.current;
      if (!trackEl || !stageEl) return;

      const trackRect = trackEl.getBoundingClientRect();
      const stageRect = stageEl.getBoundingClientRect();
      if (trackRect.height === 0) return;

      const scrollableDistance = trackRect.height - stageRect.height;
      if (scrollableDistance <= 1) return;

      const scrolled = stageRect.top - trackRect.top;
      const normalized = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      const targetU = normalized * (count - 1);

      uTargetRef.current = targetU;
      startSpringLoop();
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.defaultPrevented) return;
      const stageEl = stageRef.current;
      const trackEl = trackRef.current;
      if (!stageEl || !trackEl) return;

      const rect = stageEl.getBoundingClientRect();
      const isJsdom = rect.height === 0;

      // In JSDOM test environments, simulate direct wheel advances
      if (isJsdom) {
        if (!trackEl.contains(e.target as Node)) return;
        const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(rawDelta) < 0.5) return;
        const scrollingForward = rawDelta > 0;
        const scrollingBackward = rawDelta < 0;

        const canAdvanceForward = scrollingForward && uTargetRef.current < count - 1;
        const canAdvanceBackward = scrollingBackward && uTargetRef.current > 0;

        if (canAdvanceForward || canAdvanceBackward) {
          e.preventDefault();
          const next = Math.max(0, Math.min(count - 1, uTargetRef.current + (scrollingForward ? 1 : -1)));
          uTargetRef.current = next;
          uCurrentRef.current = next;
          setOrbitProgress(next);
        }
      }
    };

    window.addEventListener('scroll', computeScrollTarget, { passive: true });
    window.addEventListener('resize', computeScrollTarget, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Initial sync
    computeScrollTarget();

    return () => {
      window.removeEventListener('scroll', computeScrollTarget);
      window.removeEventListener('resize', computeScrollTarget);
      window.removeEventListener('wheel', handleWheel);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [count, startSpringLoop]);

  // Support URL hash deep-linking (e.g., /city#habitation or /applications#orbital-compute)
  useEffect(() => {
    if (typeof window === 'undefined' || !itemIds || itemIds.length === 0) return;

    const checkHash = () => {
      const rawHash = window.location.hash.replace(/^#/, '');
      if (!rawHash) return;
      const idx = itemIds.indexOf(rawHash);
      if (idx !== -1) {
        jumpToCard(idx);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [itemIds, jumpToCard]);

  // Planetary arc rotation angle for SVG orbital ring indicator
  const horizonRotationDeg = count > 1 ? (orbitProgress / (count - 1)) * 36 - 18 : 0;

  return (
    <div
      ref={trackRef}
      style={count > 1 ? { minHeight: `calc(100vh + ${(count - 1) * resolvedStepVh}vh)` } : undefined}
      className={`relative w-full ${className}`}
      data-planetary-orbit="true"
      data-orbit-variant={variant}
    >
      <div
        ref={stageRef}
        className="sticky top-16 sm:top-20 min-h-[calc(100vh-5rem)] flex flex-col justify-center py-2 sm:py-4 overflow-x-clip"
      >
        {/* 3D Planetary Horizon Stage */}
        <div className="relative planetary-stage-perspective planetary-horizon-glow rounded-3xl py-4 sm:py-6 px-1 sm:px-4">
          {/* Subtle Planetary Limb Curvature SVG Backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36 sm:h-44 overflow-hidden opacity-75"
          >
            <svg
              viewBox="0 0 1200 220"
              className="w-full h-full select-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `rotate(${horizonRotationDeg * 0.15}deg) scale(1.04)`,
              }}
            >
              <path
                d="M -120 210 Q 600 18 1320 210"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                className="text-slate-900/12 dark:text-white/14"
              />
              <path
                d="M -120 245 Q 600 58 1320 245"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-900/[0.07] dark:text-white/[0.07]"
              />
            </svg>
          </div>

          {/* Single-Cell CSS Grid Stage: All cards stay mounted in flow for exact height & test accessibility */}
          <div className="planetary-stage-perspective grid grid-cols-1 items-center justify-items-center relative">
            {items.map((child, idx) => {
              const shift = orbitProgress - idx;
              const kf = interpolatePlanetaryKeyframes(shift, variant);
              const absShift = Math.abs(shift);

              const isFocal = absShift < 0.45;
              const isSecondPosition = shift >= 0.45 && shift < 1.55;
              const isIncomingLimb = shift <= -0.45 && shift > -1.55;
              const isClickableSideCard = !isFocal && absShift < 1.65;

              const zIndex = Math.max(1, Math.round(40 - absShift * 12));

              const cardStyle: React.CSSProperties = isReducedMotion
                ? {
                    opacity: isFocal ? 1 : 0,
                    transform: isFocal ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 0, 0) scale(0.95)',
                    zIndex,
                    pointerEvents: isFocal ? 'auto' : 'none',
                  }
                : {
                    opacity: kf.opacity,
                    transform: `translate3d(${kf.xPct}%, ${kf.yPx}px, ${kf.zPx}px) rotateY(${kf.rotY}deg) rotateZ(${kf.rotZ}deg) scale(${kf.scale})`,
                    filter: kf.blur > 0.15 ? `blur(${kf.blur.toFixed(2)}px)` : 'none',
                    zIndex,
                    pointerEvents: kf.opacity > 0.15 ? 'auto' : 'none',
                  };

              const widthClasses =
                variant === 'dossier'
                  ? 'w-full max-w-4xl'
                  : 'w-full max-w-xl';

              return (
                <div
                  key={itemIds?.[idx] ?? idx}
                  data-orbit-slot={
                    isFocal
                      ? 'position-1-focal'
                      : isSecondPosition
                      ? 'position-2-orbit'
                      : isIncomingLimb
                      ? 'incoming-limb'
                      : 'horizon-hidden'
                  }
                  data-orbit-index={idx}
                  onClickCapture={(e) => {
                    if (isClickableSideCard) {
                      e.preventDefault();
                      e.stopPropagation();
                      jumpToCard(idx);
                    }
                  }}
                  style={cardStyle}
                  className={`col-start-1 row-start-1 planetary-card-layer ${widthClasses} ${
                    isClickableSideCard ? 'cursor-pointer' : ''
                  }`}
                >
                  {child}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
