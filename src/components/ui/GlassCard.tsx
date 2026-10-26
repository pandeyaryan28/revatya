import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'default' | 'subtle' | 'blueprint' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
  id?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  onClick?: () => void;
}

const paddingMap: Record<NonNullable<GlassCardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4 sm:p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-6 sm:p-8 lg:p-10',
};

const variantMap: Record<NonNullable<GlassCardProps['variant']>, string> = {
  default: 'liquid-glass',
  subtle: 'liquid-glass bg-white/60 dark:bg-[#0B0E14]/70',
  blueprint: 'liquid-glass architectural-grid-bg',
  elevated: 'liquid-glass shadow-[0_18px_48px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.88)]',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  interactive = false,
  variant = 'default',
  padding = 'md',
  as: Component = 'div',
  id,
  'aria-live': ariaLive,
  onClick,
}) => {
  const interactiveClasses = interactive
    ? 'liquid-glass-interactive cursor-pointer tactile-press hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_28px_72px_rgba(0,0,0,0.9)]'
    : 'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-slate-900/12 dark:hover:border-white/14';

  return (
    <Component
      id={id}
      aria-live={ariaLive}
      onClick={onClick}
      className={`${variantMap[variant]} rounded-3xl ${paddingMap[padding]} ${interactiveClasses} ${className}`}
    >
      {children}
    </Component>
  );
};
