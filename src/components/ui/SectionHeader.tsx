import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  headline?: string;
  title?: string;
  body?: string;
  description?: string;
  supportingStatement?: string;
  statusLabel?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  headline,
  title,
  body,
  description,
  supportingStatement,
  align = 'left',
  as: HeadingTag = 'h2',
  className = '',
}) => {
  const isCentered = align === 'center';
  const resolvedHeadline = headline ?? title ?? '';
  const resolvedBody = body ?? description;

  return (
    <div
      className={`max-w-4xl ${isCentered ? 'mx-auto text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <div
          className={`flex flex-wrap items-center gap-3 mb-4 ${
            isCentered ? 'justify-center' : 'justify-start'
          }`}
        >
          <span className="font-mono-tech text-xs sm:text-sm uppercase tracking-[0.18em] text-zinc-500 dark:text-[#A1A1AA] font-semibold">
            {eyebrow}
          </span>
        </div>
      )}

      <HeadingTag
        className={`font-serif-display tracking-tight text-slate-950 dark:text-[#F5F5F7] ${
          HeadingTag === 'h1'
            ? 'text-4xl sm:text-5xl lg:text-6xl leading-[1.06]'
            : 'text-3xl sm:text-4xl lg:text-[2.85rem] leading-[1.08]'
        }`}
      >
        {resolvedHeadline}
      </HeadingTag>

      {resolvedBody && (
        <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-[#A1A1AA] leading-relaxed max-w-3xl">
          {resolvedBody}
        </p>
      )}

      {supportingStatement && (
        <div
          className={`mt-6 pt-4 border-t border-slate-900/10 dark:border-white/[0.08] ${
            isCentered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-[#F5F5F7] leading-relaxed">
            {supportingStatement}
          </p>
        </div>
      )}
    </div>
  );
};
