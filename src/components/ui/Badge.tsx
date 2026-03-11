import { cn } from '@/lib/utils';

export type BadgeVariant = 'brand' | 'success' | 'warning' | 'error' | 'info' | 'muted' | 'outline';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  brand:   'bg-brand text-brand-fg',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  error:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  muted:   'bg-surface-alt text-foreground-muted border border-border',
  outline: 'border border-brand text-brand bg-transparent',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
};

export function Badge({ variant = 'brand', size = 'sm', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium shrink-0',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
