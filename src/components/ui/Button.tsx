'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'white';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-brand-fg hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
  secondary:
    'bg-surface-alt text-foreground border border-border hover:bg-border',
  ghost:
    'bg-transparent text-foreground hover:bg-surface-alt',
  outline:
    'bg-transparent border border-brand text-brand hover:bg-brand hover:text-brand-fg',
  danger:
    'bg-red-600 text-white hover:bg-red-700',
  white:
    'bg-white text-brand hover:bg-white/90 border-0',
};

const sizes: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs rounded-lg gap-1',
  sm: 'h-8 px-3 text-sm rounded-xl gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-base rounded-2xl gap-2',
};

const base =
  'inline-flex items-center justify-center font-medium transition-colors duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

const inner = (
  loading: boolean,
  leftIcon?: React.ReactNode,
  rightIcon?: React.ReactNode,
  children?: React.ReactNode
) => (
  <>
    {loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : leftIcon ? (
      <span className="shrink-0">{leftIcon}</span>
    ) : null}
    {children}
    {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
  </>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      href,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(base, variants[variant], sizes[size], className);

    if (href) {
      return (
        <Link href={href} className={classes}>
          {inner(false, leftIcon, rightIcon, children)}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || loading ? undefined : { scale: 0.97 }}
        className={classes}
        disabled={disabled || loading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {inner(loading, leftIcon, rightIcon, children)}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
