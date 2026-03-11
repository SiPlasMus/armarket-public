'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Target, Eye, ShieldCheck, Zap, Star, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight, viewportOnce } from '@/lib/animations';

// ── Animated counter ───────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref   = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start    = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────
const STATS = [
  { key: 'products', value: 100000, suffix: '+' },
  { key: 'clients',  value: 10000,  suffix: '+' },
  { key: 'years',    value: 2,      suffix: '+' },
  { key: 'cities',   value: 14,     suffix: ''  },
] as const;

const VALUES = [
  { key: 'trust',      icon: ShieldCheck, color: 'text-blue-500',   bg: 'bg-blue-500/10'   },
  { key: 'speed',      icon: Zap,         color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { key: 'quality',    icon: Star,        color: 'text-brand',      bg: 'bg-brand-subtle'  },
  { key: 'innovation', icon: Lightbulb,   color: 'text-purple-500', bg: 'bg-purple-500/10' },
] as const;

// ── Component ─────────────────────────────────────────────────────────────
export function AboutClient() {
  const t = useTranslations('about');

  return (
    <div className="space-y-20">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center max-w-2xl mx-auto"
      >
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand bg-brand-subtle px-3 py-1 rounded-full mb-4">
          AR Market
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{t('title')}</h1>
        <p className="text-foreground-muted text-lg">{t('subtitle')}</p>
      </motion.div>

      {/* ── Mission + Vision ────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Card padding="lg" className="h-full border-l-4 border-l-brand">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-brand-subtle">
                <Target className="h-5 w-5 text-brand" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{t('mission.title')}</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed">{t('mission.text')}</p>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Card padding="lg" className="h-full border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{t('vision.title')}</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed">{t('vision.text')}</p>
          </Card>
        </motion.div>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden shadow-theme-sm"
      >
        {STATS.map(({ key, value, suffix }) => (
          <motion.div
            key={key}
            variants={fadeInUp}
            className="bg-surface-elevated flex flex-col items-center justify-center py-10 px-4 text-center"
          >
            <p className="text-4xl sm:text-5xl font-extrabold text-brand tabular-nums">
              <Counter target={value} suffix={suffix} />
            </p>
            <p className="text-sm text-foreground-muted mt-2 font-medium">
              {t(`stats.${key}`)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Values ──────────────────────────────────────────────────── */}
      <section>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t('values.title')}</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {VALUES.map(({ key, icon: Icon, color, bg }) => (
            <motion.div key={key} variants={fadeInUp}>
              <Card hover padding="lg" className="h-full text-center group">
                <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${bg} mb-4`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  {t(`values.${key}`)}
                </h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {t(`values.${key}Desc`)}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Story ───────────────────────────────────────────────────── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-2xl mx-auto text-center pb-4"
      >
        <div className="w-12 h-1 bg-brand rounded-full mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-4">{t('story.title')}</h2>
        <p className="text-foreground-muted leading-relaxed">{t('story.text')}</p>
      </motion.section>

    </div>
  );
}
