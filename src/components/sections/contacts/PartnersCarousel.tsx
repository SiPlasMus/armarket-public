'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { fadeInUp, viewportOnce } from '@/lib/animations';

// ── Demo partner data ──────────────────────────────────────────────────────
const PARTNERS = [
  { name: 'UzTech',       abbr: 'UT', color: 'bg-blue-500'    },
  { name: 'SamTrade',     abbr: 'ST', color: 'bg-green-500'   },
  { name: 'ToshImport',   abbr: 'TI', color: 'bg-orange-500'  },
  { name: 'NamTech',      abbr: 'NT', color: 'bg-purple-500'  },
  { name: 'FergaExport',  abbr: 'FE', color: 'bg-brand'       },
  { name: 'QashqaTrade',  abbr: 'QT', color: 'bg-teal-500'    },
  { name: 'SurxonGroup',  abbr: 'SG', color: 'bg-yellow-500'  },
  { name: 'XorazmBiz',    abbr: 'XB', color: 'bg-indigo-500'  },
];

// Duplicated for infinite loop — animate x from 0% → -50%
const ITEMS = [...PARTNERS, ...PARTNERS];

export function PartnersCarousel() {
  const t = useTranslations('contacts.partners');

  return (
    <section className="py-16 border-t border-border overflow-hidden">
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="text-center mb-10 px-4"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t('title')}</h2>
        <p className="text-foreground-muted mt-1">{t('subtitle')}</p>
      </motion.div>

      {/* Carousel track */}
      <div className="relative">
        {/* Left/right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent z-10" />

        <motion.div
          className="flex gap-6"
          style={{ width: 'max-content' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        >
          {ITEMS.map((partner, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-3 w-36 group cursor-default select-none"
            >
              {/* Logo circle */}
              <div
                className={`w-16 h-16 rounded-2xl ${partner.color} flex items-center justify-center shadow-theme-sm group-hover:scale-105 transition-transform duration-200`}
              >
                <span className="text-white font-bold text-lg tracking-wide">
                  {partner.abbr}
                </span>
              </div>
              {/* Name */}
              <span className="text-xs text-foreground-muted font-medium text-center leading-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
