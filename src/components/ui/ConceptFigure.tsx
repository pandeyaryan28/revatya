import React from 'react';

interface ConceptFigureProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: '16/9' | '4/3' | '21/9' | '1/1';
  badgeLabel?: string;
  categoryTag?: string;
  priority?: boolean;
  className?: string;
  objectPosition?: string;
}

const aspectClasses = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '21/9': 'aspect-[21/9]',
  '1/1': 'aspect-square',
};

export const ConceptFigure: React.FC<ConceptFigureProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  priority = false,
  className = '',
  objectPosition = 'object-center',
}) => {
  return (
    <figure
      className={`group relative rounded-3xl overflow-hidden liquid-glass border border-slate-900/10 dark:border-white/[0.09] transition-all duration-500 ${className}`}
    >
      <div className={`relative w-full overflow-hidden bg-[#05070B] ${aspectClasses[aspectRatio]}`}>
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          className={`w-full h-full object-cover ${objectPosition} transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]`}
        />
      </div>
    </figure>
  );
};
