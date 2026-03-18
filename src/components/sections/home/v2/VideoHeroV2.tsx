'use client';

import { useRef } from 'react';
import type React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocale } from 'next-intl';
import { ChevronDown, ArrowRight, Package, Users, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';

// ─── Easing constants (Framer Motion 12.x) ────────────────────────────────────
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1];

// ─── Animated blob definitions ────────────────────────────────────────────────
type BlobDef = {
  style: React.CSSProperties;
  animateX: number[];
  animateY?: number[];
  animateScale: number[];
  duration: number;
  delay: number;
};

const BLOBS: BlobDef[] = [
  {
    style: {
      top: '-15%',
      right: '-10%',
      width: '680px',
      height: '680px',
      background: 'radial-gradient(circle, rgba(220,38,38,0.55) 0%, rgba(185,28,28,0.2) 40%, transparent 70%)',
      filter: 'blur(80px)',
    },
    animateX: [0, 40, -20, 0],
    animateY: [0, -30, 20, 0],
    animateScale: [1, 1.12, 0.94, 1],
    duration: 16,
    delay: 0,
  },
  {
    style: {
      bottom: '-20%',
      left: '-12%',
      width: '560px',
      height: '560px',
      background: 'radial-gradient(circle, rgba(239,68,68,0.35) 0%, rgba(220,38,38,0.1) 45%, transparent 70%)',
      filter: 'blur(90px)',
    },
    animateX: [0, -30, 18, 0],
    animateY: [0, 25, -15, 0],
    animateScale: [1, 0.92, 1.08, 1],
    duration: 20,
    delay: 3,
  },
  {
    style: {
      top: '30%',
      left: '20%',
      width: '420px',
      height: '420px',
      background: 'radial-gradient(circle, rgba(251,146,60,0.2) 0%, rgba(220,38,38,0.08) 50%, transparent 70%)',
      filter: 'blur(60px)',
    },
    animateX: [0, 20, -25, 0],
    animateY: [0, -20, 30, 0],
    animateScale: [1, 1.06, 0.97, 1],
    duration: 14,
    delay: 1.5,
  },
  {
    style: {
      top: '-5%',
      left: '35%',
      width: '300px',
      height: '300px',
      background: 'radial-gradient(circle, rgba(127,29,29,0.4) 0%, transparent 65%)',
      filter: 'blur(50px)',
    },
    animateX: [0, -15, 20, 0],
    animateScale: [1, 1.15, 0.95, 1],
    duration: 12,
    delay: 5,
  },
];

// ─── Decorative noise grain overlay ───────────────────────────────────────────
// Inline SVG noise via data URL
const NOISE_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'repeat',
  backgroundSize: '200px 200px',
};

export default function VideoHeroV2() {
  const locale = useLocale() as 'uz' | 'ru';

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven transforms
  const bgScale       = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY      = useTransform(scrollYProgress, [0, 0.7], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const isRu = locale === 'ru';

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0d0000' }}
    >
      {/* ── Video layer (uncomment when /public/videos/hero.mp4 is available) ── */}
      {/*
      <motion.div
        style={{ scale: bgScale }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.45 }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(13,0,0,0.4) 0%, rgba(13,0,0,0.15) 50%, rgba(13,0,0,0.7) 100%)',
          }}
        />
      </motion.div>
      */}

      {/* ── Animated gradient background (placeholder for video) ── */}
      <motion.div
        style={{ scale: bgScale }}
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 60% 40%, #2d0505 0%, #1a0500 35%, #0d0000 60%, #0a0000 100%)',
          }}
        />

        {/* Animated blobs */}
        {BLOBS.map((blob, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ ...blob.style, position: 'absolute' }}
            animate={{
              x: [...blob.animateX],
              ...(blob.animateY ? { y: [...blob.animateY] } : {}),
              scale: [...blob.animateScale],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: EASE_IN_OUT,
              delay: blob.delay,
            }}
          />
        ))}

        {/* Film grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-screen"
          style={NOISE_STYLE}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* Bottom fade to dark */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: 'linear-gradient(to bottom, transparent, #0a0000)',
          }}
        />
      </motion.div>

      {/* ── Decorative grid lines ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(rgba(220,38,38,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Horizontal scan lines (cinematic effect) ── */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
        }}
      />

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
      >
        {/* Entry animations staggered */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
          }}
        >
          {/* Label badge */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
            }}
            className="flex justify-center mb-8"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase"
              style={{
                background: 'rgba(220,38,38,0.12)',
                border: '1px solid rgba(220,38,38,0.3)',
                color: 'rgba(252,165,165,0.9)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-red-400"
                style={{ boxShadow: '0 0 6px rgba(248,113,113,0.8)' }}
              />
              {isRu ? 'Платформа закупок' : 'Xarid platformasi'}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 32 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
            }}
          >
            <h1 className="font-extrabold tracking-tight leading-[0.95] mb-6">
              <span
                className="block text-white"
                style={{
                  fontSize: 'clamp(4rem, 14vw, 9rem)',
                  textShadow: '0 2px 40px rgba(0,0,0,0.5)',
                  letterSpacing: '-0.03em',
                }}
              >
                AR
              </span>
              <span
                className="block"
                style={{
                  fontSize: 'clamp(4rem, 14vw, 9rem)',
                  letterSpacing: '-0.03em',
                  color: '#ef4444',
                  textShadow:
                    '0 0 30px rgba(239,68,68,0.6), 0 0 80px rgba(239,68,68,0.3), 0 0 120px rgba(239,68,68,0.15)',
                }}
              >
                Market
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
            }}
            className="text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            {isRu
              ? 'Найдите нужные товары среди тысяч позиций — быстро, удобно и надёжно'
              : "Minglab mahsulotlar orasidan kerakligini toping — tez, qulay va ishonchli"}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
            }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            {/* Primary CTA */}
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#fff',
                boxShadow: '0 4px 30px rgba(220,38,38,0.4), 0 0 0 1px rgba(220,38,38,0.3)',
              }}
            >
              <span className="relative z-10">
                {isRu ? 'Товары' : 'Mahsulotlar'}
              </span>
              <ArrowRight
                className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
              {/* Shine effect */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                }}
              />
            </Link>

            {/* Ghost CTA */}
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm sm:text-base transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)';
              }}
            >
              {isRu ? 'О нас' : 'Biz haqimizda'}
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO } },
            }}
            className="flex items-center justify-center gap-8 mt-14"
          >
            {[
              { value: '100k+', labelUz: 'Mahsulot', labelRu: 'Товаров' },
              { value: '10k+',  labelUz: 'Mijoz',    labelRu: 'Клиентов' },
              { value: '15+',   labelUz: 'Shahar',   labelRu: 'Городов' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: '#ef4444' }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {isRu ? stat.labelRu : stat.labelUz}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Desktop left: stat cards ── */}
      <div className="absolute hidden lg:flex flex-col gap-4 left-8 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        {[
          { Icon: Package, value: '100k+', label: isRu ? 'Товаров'   : 'Mahsulot', delay: 0.5 },
          { Icon: Users,   value: '10k+',  label: isRu ? 'Клиентов'  : 'Mijoz',    delay: 0.65 },
          { Icon: MapPin,  value: '15+',   label: isRu ? 'Городов'   : 'Shahar',   delay: 0.8 },
        ].map(({ Icon, value, label, delay }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5 + i * 0.8, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 1.1 }}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              <div
                className="rounded-lg p-1.5 shrink-0"
                style={{ background: 'rgba(239,68,68,0.12)' }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: '#f87171' }} />
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none">{value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</div>
              </div>
            </motion.div>
          </motion.div>
        ))}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="w-px h-12 mx-auto"
          style={{
            background: 'linear-gradient(to bottom, rgba(239,68,68,0.4), transparent)',
            transformOrigin: 'top',
          }}
        />
      </div>

      {/* ── Desktop right: category chips ── */}
      <div className="absolute hidden lg:flex flex-col items-end gap-3 right-8 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs uppercase tracking-[0.2em] mb-1"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          {isRu ? 'Категории' : 'Kategoriyalar'}
        </motion.p>
        {[
          { label: isRu ? 'Электроника'  : 'Elektronika',   delay: 0.55 },
          { label: isRu ? 'Продукты'    : 'Oziq-ovqat',    delay: 0.68 },
          { label: isRu ? 'Одежда'      : 'Kiyim-kechak',  delay: 0.81 },
          { label: isRu ? 'Стройматер.' : 'Qurilish',      delay: 0.94 },
        ].map(({ label, delay }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.9 }}
              className="rounded-full px-4 py-2 text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.55)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
              }}
            >
              {label}
            </motion.div>
          </motion.div>
        ))}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="w-px h-12 mr-8"
          style={{
            background: 'linear-gradient(to bottom, rgba(239,68,68,0.4), transparent)',
            transformOrigin: 'top',
          }}
        />
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        aria-hidden
      >
        <span
          className="text-[10px] font-semibold tracking-[0.25em] uppercase"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          <ChevronDown
            className="h-5 w-5"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
