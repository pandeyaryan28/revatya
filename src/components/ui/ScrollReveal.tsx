import React, { useEffect, useRef, useState } from 'react';

export type RevealVariant =
  | 'fade-up'
  | 'fade-in'
  | 'scale-in'
  | 'scale-glass'
  | 'slide-left'
  | 'slide-right'
  | 'blur-in';

export interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  preset?: RevealVariant;
  delay?: number;
  delayMs?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant,
  preset,
  delay,
  delayMs,
  duration = 850,
  threshold = 0.12,
  className = '',
  once = true,
}) => {
  const resolvedVariant = variant ?? preset ?? 'fade-up';
  const resolvedDelay = delayMs ?? delay ?? 0;
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return true;
    }
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold]);

  const hiddenTransformMap: Record<RevealVariant, string> = {
    'fade-up': 'translate3d(0, 42px, 0) scale(0.975)',
    'fade-in': 'translate3d(0, 14px, 0) scale(0.99)',
    'scale-in': 'translate3d(0, 24px, 0) scale(0.92)',
    'scale-glass': 'translate3d(0, 28px, 0) scale(0.95)',
    'slide-left': 'translate3d(-44px, 0, 0) scale(0.98)',
    'slide-right': 'translate3d(44px, 0, 0) scale(0.98)',
    'blur-in': 'translate3d(0, 18px, 0) scale(0.985)',
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : hiddenTransformMap[resolvedVariant],
    filter: isVisible ? 'blur(0px)' : 'blur(8px)',
    transitionProperty: 'opacity, transform, filter',
    transitionDuration: `${duration}ms`,
    transitionDelay: `${resolvedDelay}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: isVisible ? 'auto' : 'opacity, transform, filter',
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};

export interface StaggerGroupProps {
  children: React.ReactNode;
  staggerMs?: number;
  baseDelayMs?: number;
  variant?: RevealVariant;
  className?: string;
  itemClassName?: string;
}

export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  staggerMs = 85,
  baseDelayMs = 0,
  variant = 'fade-up',
  className = '',
  itemClassName = 'h-full',
}) => {
  const items = React.Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, idx) => (
        <ScrollReveal
          key={idx}
          variant={variant}
          delay={baseDelayMs + idx * staggerMs}
          className={itemClassName}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

export function useScrollParallax(speed = 0.18) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        setOffsetY(window.scrollY * speed);
        rafId = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return offsetY;
}
