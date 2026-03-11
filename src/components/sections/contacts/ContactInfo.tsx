'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Phone, MapPin, Clock, Send } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/animations';

// ── Social SVG icons (inline, no extra dep) ───────────────────────────────
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.16 14.098l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.836.95l-.14-.462z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  {
    key:     'telegram',
    icon:    TelegramIcon,
    href:    'https://t.me/armarket_uz',
    color:   'bg-[#229ED9] hover:bg-[#1a8bc4]',
    label:   '@armarket_uz',
  },
  {
    key:     'instagram',
    icon:    InstagramIcon,
    href:    'https://instagram.com/armarket_uz',
    color:   'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90',
    label:   '@armarket_uz',
  },
  {
    key:     'youtube',
    icon:    YouTubeIcon,
    href:    'https://youtube.com/@armarket',
    color:   'bg-[#FF0000] hover:bg-[#cc0000]',
    label:   'AR Market',
  },
  {
    key:     'facebook',
    icon:    FacebookIcon,
    href:    'https://facebook.com/armarket',
    color:   'bg-[#1877F2] hover:bg-[#1460cc]',
    label:   'AR Market',
  },
] as const;

export function ContactInfo() {
  const t  = useTranslations('contacts');
  const ts = useTranslations('contacts.social');

  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Phone */}
      <motion.div variants={fadeInUp} className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-brand-subtle shrink-0">
          <Phone className="h-5 w-5 text-brand" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-0.5">
            {t('phone')}
          </p>
          <a
            href="tel:+998901234567"
            className="text-foreground font-medium hover:text-brand transition-colors"
          >
            +998 90 123 45 67
          </a>
          <br />
          <a
            href="tel:+998712345678"
            className="text-foreground font-medium hover:text-brand transition-colors"
          >
            +998 71 234 56 78
          </a>
        </div>
      </motion.div>

      {/* Telegram */}
      <motion.div variants={fadeInUp} className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-[#229ED9]/10 shrink-0">
          <Send className="h-5 w-5 text-[#229ED9]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-0.5">
            {t('telegram')}
          </p>
          <a
            href="https://t.me/armarket_uz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-medium hover:text-brand transition-colors"
          >
            @armarket_uz
          </a>
        </div>
      </motion.div>

      {/* Address */}
      <motion.div variants={fadeInUp} className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-green-500/10 shrink-0">
          <MapPin className="h-5 w-5 text-green-500" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-0.5">
            {t('address')}
          </p>
          <p className="text-foreground font-medium">{t('addressValue')}</p>
        </div>
      </motion.div>

      {/* Hours */}
      <motion.div variants={fadeInUp} className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-purple-500/10 shrink-0">
          <Clock className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-0.5">
            {t('hours')}
          </p>
          <p className="text-foreground font-medium">{t('hoursValue')}</p>
        </div>
      </motion.div>

      {/* Social links */}
      <motion.div variants={fadeInUp}>
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-3">
          {ts('title')}
        </p>
        <div className="flex flex-wrap gap-3">
          {SOCIAL_LINKS.map(({ key, icon: Icon, href, color, label }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={ts(key as 'telegram' | 'instagram' | 'youtube' | 'facebook')}
              aria-label={label}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 shadow-sm ${color}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
