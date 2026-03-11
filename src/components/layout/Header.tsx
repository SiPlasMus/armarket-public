'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
}

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const links: NavLink[] = [
    { href: '/',         label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/news',     label: t('news') },
    { href: '/about',    label: t('about') },
    { href: '/contacts', label: t('contacts') },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          'sticky top-0 z-30 w-full transition-all duration-300',
          scrolled
            ? 'bg-surface-elevated/90 backdrop-blur-md border-b border-border shadow-theme-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-foreground shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.ico" alt="AR Market" className="h-7 w-7 rounded-md" />
              <span>
                AR{' '}
                <span className="text-brand">Market</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150',
                    pathname === link.href
                      ? 'bg-brand text-brand-fg'
                      : 'text-foreground-muted hover:text-foreground hover:bg-surface-alt'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-alt transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
