'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cardHover } from '@/lib/animations';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section' | 'li';
  onClick?: () => void;
}

const paddings = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
};

export function Card({
  className,
  children,
  hover = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const base = cn(
    'bg-surface-elevated border border-border rounded-2xl shadow-theme-sm',
    'transition-colors duration-200',
    paddings[padding],
    onClick && 'cursor-pointer',
    className
  );

  if (hover) {
    return (
      <motion.div
        className={cn(base, 'hover:shadow-theme-lg')}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={base} onClick={onClick}>
      {children}
    </div>
  );
}
