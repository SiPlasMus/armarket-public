'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Sparkles, Package, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { useAnalytics } from '@/hooks/useAnalytics';

// ─── Floating stat mini-cards ────────────────────────────────────────────────
const FLOAT_CARDS = [
  {
    icon: Package,
    value: '100k+',
    labelUz: 'Mahsulotlar',
    labelRu: 'Товаров',
    pos: 'top-[20%] right-[6%]',
    anim: { y: [0, -10, 0], rotate: [-1, 0.5, -1], duration: 5, delay: 0 },
  },
  {
    icon: Users,
    value: '10k+',
    labelUz: 'Mijozlar',
    labelRu: 'Клиентов',
    pos: 'top-[45%] left-[4%]',
    anim: { y: [0, -8, 0], rotate: [0.5, -0.5, 0.5], duration: 6.5, delay: 1.5 },
  },
  {
    icon: MapPin,
    value: '15+',
    labelUz: 'Shaharlar',
    labelRu: 'Городов',
    pos: 'bottom-[22%] right-[8%]',
    anim: { y: [0, -12, 0], rotate: [-0.5, 1, -0.5], duration: 4.5, delay: 3 },
  },
] as const;

// ─── Decorative dots ─────────────────────────────────────────────────────────
const DOTS = [
  { top: '14%', left: '9%',  dur: 3,   delay: 0 },
  { top: '68%', left: '6%',  dur: 3.8, delay: 0.8 },
  { top: '28%', right: '9%', dur: 2.8, delay: 1.6 },
  { top: '78%', right: '13%',dur: 3.5, delay: 0.4 },
];

export default function HeroSection() {
  const t      = useTranslations('hero');
  const locale = useLocale() as 'uz' | 'ru';
  const { track } = useAnalytics();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax values
  const blob1Y       = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const blob2Y       = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentY     = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-surface"
    >
      {/* ── Abstract background ──────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--border) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Blob 1 — top-right, large */}
        <motion.div
          style={{
            y: blob1Y,
            background: 'radial-gradient(circle, var(--brand) 0%, transparent 65%)',
            opacity: 0.11,
            filter: 'blur(64px)',
          }}
          animate={{ x: [0, 28, -16, 0], scale: [1, 1.07, 0.96, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-[680px] h-[680px] rounded-full"
        />

        {/* Blob 2 — bottom-left */}
        <motion.div
          style={{
            y: blob2Y,
            background: 'radial-gradient(circle, var(--brand) 0%, transparent 65%)',
            opacity: 0.07,
            filter: 'blur(56px)',
          }}
          animate={{ x: [0, -22, 14, 0], y: [0, 20, -12, 0], scale: [1, 0.96, 1.06, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-28 -left-28 w-[520px] h-[520px] rounded-full"
        />

        {/* Rotating ring 1 — top-left */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-44 -left-44 w-[520px] h-[520px] rounded-full border"
          style={{ borderColor: 'var(--brand)', opacity: 0.08 }}
        />

        {/* Rotating ring 2 — bottom-right */}
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 right-1/4 w-[280px] h-[280px] rounded-full border"
          style={{ borderColor: 'var(--brand)', opacity: 0.10 }}
        />

        {/* Small ring 3 — center-right */}
        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 -translate-y-1/2 right-[18%] w-[140px] h-[140px] rounded-full border-[1.5px]"
          style={{ borderColor: 'var(--brand)', opacity: 0.15 }}
        />

        {/* Decorative pulsing dots */}
        {DOTS.map((dot, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: dot.dur, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
            className="absolute h-2 w-2 rounded-full bg-brand"
            style={{ ...dot }}
          />
        ))}
      </div>

      {/* ── Floating stat cards (desktop only) ───────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block" aria-hidden>
        {FLOAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              className={`absolute ${card.pos}`}
              animate={{ y: [...card.anim.y], rotate: [...card.anim.rotate] }}
              transition={{ duration: card.anim.duration, repeat: Infinity, ease: 'easeInOut', delay: card.anim.delay }}
            >
              <div className="bg-surface-elevated/75 backdrop-blur-md border border-border/60 rounded-2xl px-4 py-3 shadow-theme-lg">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-brand-subtle flex items-center justify-center shrink-0">
                    <Icon className="h-4.5 w-4.5 text-brand" />
                  </div>
                  <div>
                    <p className="text-foreground font-bold text-sm leading-none">{card.value}</p>
                    <p className="text-foreground-muted text-[11px] mt-0.5">
                      {locale === 'ru' ? card.labelRu : card.labelUz}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <motion.div
          variants={staggerContainer(0.12, 0)}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-subtle border border-brand/25 text-brand text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              {t('badge')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-5"
          >
            AR{' '}
            <span
              className="text-brand"
              style={{
                textShadow: '0 0 40px color-mix(in srgb, var(--brand) 30%, transparent)',
              }}
            >
              Market
            </span>
          </motion.h1>

          {/* Subtitle headline */}
          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl font-semibold text-foreground/70 mb-4 leading-snug"
          >
            {locale === 'ru'
              ? 'Удобная платформа закупок'
              : "Qulay xarid platformasi"}
          </motion.p>

          {/* Body subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg text-foreground-muted leading-relaxed max-w-xl mx-auto mb-10"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              variant="primary"
              size="lg"
              href="/products"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={() => track('cta_clicked', { location: 'hero', target: 'products' })}
            >
              {t('ctaProducts')}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/news"
              onClick={() => track('cta_clicked', { location: 'hero', target: 'news' })}
            >
              {t('ctaNews')}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground-muted/40"
        aria-hidden
      >
        <div className="w-5 h-8 border-2 border-current rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-current rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
