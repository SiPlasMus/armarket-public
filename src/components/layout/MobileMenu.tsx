'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { backdropVariants, slideInRight } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const links: NavLink[] = [
    { href: '/',         label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/news',     label: t('news') },
    { href: '/about',    label: t('about') },
    { href: '/contacts', label: t('contacts') },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw]',
              'bg-surface-elevated border-l border-border',
              'flex flex-col shadow-theme-lg'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="font-bold text-lg text-foreground">AR Market</span>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-alt transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center h-12 px-4 rounded-xl text-base font-medium',
                    'transition-colors duration-150 mb-1',
                    pathname === link.href
                      ? 'bg-brand text-brand-fg'
                      : 'text-foreground hover:bg-surface-alt'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Controls */}
            <div className="px-5 py-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">Til / Язык</span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">Mavzu / Тема</span>
                <ThemeSwitcher />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
