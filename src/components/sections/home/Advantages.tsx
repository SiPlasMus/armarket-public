'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Package, Truck, Tag, Headphones, ShieldCheck, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { staggerContainer, fadeInUp, viewportOnce } from '@/lib/animations';

const ADVANTAGE_KEYS = [
  'assortment',
  'speed',
  'price',
  'support',
  'trust',
  'digital',
] as const;

const ICONS = [Package, Truck, Tag, Headphones, ShieldCheck, Zap];

export default function Advantages() {
  const t = useTranslations('advantages');

  return (
    <section className="py-16 sm:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t('title')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-foreground-muted max-w-xl mx-auto">
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {ADVANTAGE_KEYS.map((key, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div key={key} variants={fadeInUp}>
                <Card padding="lg" className="h-full group hover:border-brand/25 transition-colors duration-200">
                  {/* Icon */}
                  <div className="h-11 w-11 rounded-2xl bg-brand-subtle group-hover:bg-brand/15 transition-colors flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>

                  {/* Text */}
                  <h3 className="font-semibold text-foreground mb-2">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">
                    {t(`items.${key}.description`)}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
