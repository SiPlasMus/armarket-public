import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Send, Phone } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/',         label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/news',     label: t('nav.news') },
    { href: '/about',    label: t('nav.about') },
    { href: '/contacts', label: t('nav.contacts') },
  ];

  return (
    <footer className="bg-surface-alt border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.ico" alt="" className="h-7 w-7 rounded-md" />
              AR <span className="text-brand">Market</span>
            </Link>
            <p className="text-sm text-foreground-muted leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">
              {t('nav.home')}
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-muted hover:text-brand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">
              {t('contacts.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:+998712345678"
                  className="flex items-center gap-2 text-sm text-foreground-muted hover:text-brand transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  +998 71 234-56-78
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/armarket_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground-muted hover:text-brand transition-colors"
                >
                  <Send className="h-3.5 w-3.5 shrink-0" />
                  @armarket_uz
                </a>
              </li>
              <li className="text-sm text-foreground-muted">
                {t('contacts.hoursValue')}
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">AR Market</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-foreground-muted hover:text-brand transition-colors"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-foreground-muted hover:text-brand transition-colors"
                >
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-foreground-muted">
            © {currentYear} AR Market. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
