import React from 'react';

interface RevatyaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  wordmarkClassName?: string;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<RevatyaLogoProps['size']>, string> = {
  sm: 'w-8 h-8 rounded-[10px]',
  md: 'w-9 h-9 rounded-[11px]',
  lg: 'w-11 h-11 rounded-[14px]',
  xl: 'w-16 h-16 rounded-2xl',
};

export const RevatyaLogo: React.FC<RevatyaLogoProps> = ({
  size = 'md',
  showWordmark = false,
  wordmarkClassName = 'text-base sm:text-lg font-serif-display tracking-tight font-semibold',
  className = '',
}) => {
  return (
    <span className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      <span
        className={`relative inline-flex items-center justify-center overflow-hidden bg-[#050814] border border-slate-900/15 dark:border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.22),inset_0_1px_1px_rgba(255,255,255,0.22)] shrink-0 ${SIZE_CLASSES[size]}`}
      >
        <picture className="w-full h-full block">
          <source srcSet="/images/brand/revatya-logo-256.webp" type="image/webp" />
          <img
            src="/images/brand/revatya-logo.jpg"
            alt="Revatya orbital planet and ascending star emblem"
            className="w-full h-full object-cover scale-[1.06]"
            loading="eager"
            decoding="async"
          />
        </picture>
      </span>
      {showWordmark && <span className={wordmarkClassName}>Revatya</span>}
    </span>
  );
};
