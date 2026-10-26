import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  showArrow?: boolean;
  withArrow?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

interface LinkButtonProps extends BaseProps {
  to: string;
  href?: never;
  onClick?: () => void;
  type?: never;
  disabled?: never;
}

interface ExternalLinkButtonProps extends BaseProps {
  href: string;
  to?: never;
  onClick?: () => void;
  type?: never;
  disabled?: never;
}

interface NativeButtonProps extends BaseProps {
  to?: never;
  href?: never;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export type AppleButtonProps =
  | LinkButtonProps
  | ExternalLinkButtonProps
  | NativeButtonProps;

export const AppleButton: React.FC<AppleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  showArrow = false,
  withArrow = false,
  icon,
  fullWidth = false,
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const displayArrow = showArrow || withArrow;
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl tactile-press focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40 dark:focus-visible:ring-white/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#020305] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-2.5 text-sm tracking-wide gap-1.5',
    md: 'px-5 py-3 text-sm sm:text-base gap-2',
    lg: 'px-7 py-3.5 text-base sm:text-lg gap-2.5',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[#111113] hover:bg-black text-white dark:bg-[#F5F5F7] dark:hover:bg-white dark:text-[#020305] shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_0_1px_rgba(255,255,255,0.4),0_8px_28px_rgba(255,255,255,0.08)] font-semibold',
    secondary:
      'bg-white/80 hover:bg-white dark:bg-white/[0.06] dark:hover:bg-white/[0.11] text-slate-900 dark:text-[#F5F5F7] border border-slate-900/12 dark:border-white/[0.12] backdrop-blur-xl shadow-xs',
    ghost:
      'bg-transparent hover:bg-slate-900/5 dark:hover:bg-white/[0.06] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#F5F5F7]',
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
    fullWidth ? 'w-full' : ''
  } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`;

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {displayArrow && <ArrowRight className="w-4 h-4 shrink-0" />}
    </>
  );

  const internalRoute = to || (href && href.startsWith('/') ? href : undefined);

  if (internalRoute) {
    return (
      <Link to={internalRoute} onClick={onClick} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} onClick={onClick} className={combinedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses}>
      {content}
    </button>
  );
};
