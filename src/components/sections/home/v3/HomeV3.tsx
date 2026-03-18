'use client';

/**
 * HomeV3 — farmminerals-inspired full-screen scroll experience for AR Market
 *
 * Sections (all inside one 700vh scroll container with a sticky 100vh viewport):
 *  1. Hero   (0–1vh)    : dark grid, 50×50 px hover squares, 3D-rotating "AR" logo, big text, nav
 *  2. Jalousie (1–3vh)  : 5×3 grid panels wipe upward (bottom row first) → reveals Section 2
 *  3. Section 2 (3–4.5vh): image atmosphere + tagline text
 *  4. Section 3 (4.5–5.5vh): Section-2 div zooms in (scale ↑) → big "100k+" text appears
 *  5. Section 4 (5.5–7vh): static dark bg, static logo, parallax feature cards slide in
 *
 * To revert to another design: uncomment old imports in src/app/[locale]/page.tsx
 */

import { useRef, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import { useLocale } from 'next-intl';
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';

// ─── Palette ──────────────────────────────────────────────────────────────────

const BG_DEEP   = '#080203';   // base background
const CELL_BG   = '#100404';   // grid cell default
const CELL_HOV  = '#380b0b';   // hovered cell
const CELL_NBR  = '#200707';   // neighbour cell

// ─── Layout ───────────────────────────────────────────────────────────────────

const CELL_PX     = 50;          // grid cell size in px
const CONTAINER_H = 700;         // total scroll container in vh

// Scroll-progress checkpoints (fractions of CONTAINER_H)
//   0──── 1 ──── 3 ──── 4.5 ──── 5.5 ──── 7
//   Hero  Jal    S2     S3        S4       End
const P = {
  JAL_START  : 1   / 7,   // 0.143
  JAL_END    : 3   / 7,   // 0.429
  S2_IN      : 3.2 / 7,   // 0.457
  S2_PEAK    : 3.5 / 7,   // 0.500
  S3_START   : 4   / 7,   // 0.571
  S3_PEAK    : 4.5 / 7,   // 0.643
  S3_END     : 5   / 7,   // 0.714
  S4_START   : 5   / 7,   // 0.714
} as const;

// Easing
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const FEATURE_CARDS = [
  {
    Icon: ShieldCheck,
    titleUz: 'Sifat kafolati',     titleRu: 'Гарантия качества',
    descUz:  'Tasdiqlangan tovar', descRu:  'Проверенные товары',
  },
  {
    Icon: Zap,
    titleUz: 'Tez yetkazish',      titleRu: 'Быстрая доставка',
    descUz:  'Bir kunda buyurtma', descRu:  'Заказ за один день',
  },
  {
    Icon: TrendingUp,
    titleUz: 'Ulgurji narxlar',    titleRu: 'Оптовые цены',
    descUz:  'Eng arzon takliflar',descRu:  'Лучшие предложения',
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeV3() {
  const locale = useLocale() as 'uz' | 'ru';

  // Refs
  const containerRef   = useRef<HTMLDivElement>(null);
  const gridRef        = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const rowCellsRef    = useRef<HTMLElement[][]>([]);

  // Scroll progress (0→1 over the 700 vh container)
  const { scrollYProgress } = useScroll({ target: containerRef });

  // ── Section 2 / 3 ─────────────────────────────────────────────────────────

  // S2 wrapper fades in after jalousie, stays through S3, fades near S4
  const s2WrapOpacity = useTransform(
    scrollYProgress,
    [P.JAL_END - 0.04, P.JAL_END + 0.04, P.S3_END - 0.02, P.S3_END + 0.04],
    [0, 1, 1, 0],
  );

  // Zoom: Section-2 container scales up during S3
  const s23Scale = useTransform(
    scrollYProgress,
    [P.S3_START, P.S3_PEAK, P.S3_END],
    [1, 1.25, 1.7],
  );

  // Section-2 tagline fades out when zoom starts
  const s2TextOpacity = useTransform(
    scrollYProgress,
    [P.S2_PEAK, P.S3_START - 0.02, P.S3_START + 0.04],
    [1, 1, 0],
  );

  // Big "100k+" text fades in during zoom
  const s3BigOpacity = useTransform(
    scrollYProgress,
    [P.S3_START, P.S3_START + 0.06, P.S3_PEAK, P.S3_END],
    [0, 1, 1, 0],
  );

  // ── Section 4 ─────────────────────────────────────────────────────────────

  const s4Opacity  = useTransform(scrollYProgress, [P.S4_START, P.S4_START + 0.08], [0, 1]);
  const s4LogoScale = useTransform(scrollYProgress, [P.S4_START, P.S4_START + 0.15], [0.85, 1]);

  // Cards: left slides from left, centre from bottom, right from right
  const card0X   = useTransform(scrollYProgress, [P.S4_START, P.S4_START + 0.18], [-140, 0]);
  const card1Y   = useTransform(scrollYProgress, [P.S4_START + 0.04, P.S4_START + 0.22], [90, 0]);
  const card2X   = useTransform(scrollYProgress, [P.S4_START, P.S4_START + 0.18], [140, 0]);
  const ctaOp    = useTransform(scrollYProgress, [P.S4_START + 0.2, P.S4_START + 0.3], [0, 1]);
  const ctaY     = useTransform(scrollYProgress, [P.S4_START + 0.2, P.S4_START + 0.3], [20, 0]);

  const CARD_MOTIONS = [
    { x: card0X },
    { y: card1Y },
    { x: card2X },
  ] as const;

  // ── Hide layout header / footer for immersive design ──────────────────────

  useEffect(() => {
    const header = document.querySelector('header') as HTMLElement | null;
    const footer = document.querySelector('footer') as HTMLElement | null;
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  // ── Build grid / jalousie cells from DOM (no React re-renders) ────────────

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    function buildGrid() {
      if (!grid) return;
      // Clear previous
      grid.innerHTML = '';
      rowCellsRef.current = [];

      const cols = Math.ceil(window.innerWidth  / CELL_PX) + 1;
      const rows = Math.ceil(window.innerHeight / CELL_PX) + 1;

      for (let r = 0; r < rows; r++) {
        rowCellsRef.current[r] = [];
        for (let c = 0; c < cols; c++) {
          const el = document.createElement('div');
          el.style.cssText =
            `position:absolute;` +
            `left:${c * CELL_PX}px;top:${r * CELL_PX}px;` +
            `width:${CELL_PX}px;height:${CELL_PX}px;` +
            `background:${CELL_BG};` +
            `border:1px solid rgba(255,80,80,0.04);` +
            `transition:background 120ms ease;` +
            `will-change:transform;`;
          grid.appendChild(el);
          rowCellsRef.current[r].push(el);
        }
      }
    }

    buildGrid();
    window.addEventListener('resize', buildGrid);
    return () => window.removeEventListener('resize', buildGrid);
  }, []);

  // ── Grid hover (direct DOM, no state) ─────────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    const rows = rowCellsRef.current;
    if (!grid || !rows.length) return;

    const rect = grid.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / CELL_PX);
    const row = Math.floor((e.clientY - rect.top)  / CELL_PX);
    const colCount = rows[0]?.length ?? 0;

    // Reset a local neighbourhood first (cheap)
    for (let dr = -4; dr <= 4; dr++) {
      const rowArr = rows[row + dr];
      if (!rowArr) continue;
      for (let dc = -4; dc <= 4; dc++) {
        const ci = col + dc;
        if (ci >= 0 && ci < colCount) rowArr[ci].style.background = CELL_BG;
      }
    }

    // Apply gradient highlight
    function paint(r: number, c: number, bg: string) {
      const arr = rows[r];
      if (arr && c >= 0 && c < colCount) arr[c].style.background = bg;
    }
    paint(row,     col,     CELL_HOV);
    paint(row - 1, col,     CELL_NBR);
    paint(row + 1, col,     CELL_NBR);
    paint(row,     col - 1, CELL_NBR);
    paint(row,     col + 1, CELL_NBR);
  }, []);

  const handleMouseLeave = useCallback(() => {
    rowCellsRef.current.forEach((row) =>
      row.forEach((cell) => { cell.style.background = CELL_BG; }),
    );
  }, []);

  // ── Scroll driver: jalousie + hero-content fade ───────────────────────────

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const vh = window.innerHeight;
    const rows = rowCellsRef.current;
    if (!rows.length) return;

    // ── Jalousie ──
    const jalP = Math.max(0, Math.min(1,
      (p - P.JAL_START) / (P.JAL_END - P.JAL_START),
    ));

    const visibleRows = Math.ceil(vh / CELL_PX) + 1;
    for (let r = 0; r < rows.length; r++) {
      // Row fraction: 0 = top row, 1 = bottom row
      const rowFraction = Math.min(1, r / Math.max(1, visibleRows - 1));
      // Bottom rows (rowFraction ≈ 1) go first (stagger = 0)
      // Top rows (rowFraction ≈ 0) go last  (stagger = 0.32)
      const stagger = (1 - rowFraction) * 0.32;
      const rP = Math.max(0, Math.min(1, (jalP - stagger) / (1 - 0.32)));
      const eased = easeInOut(rP);
      const ty = Math.round(-eased * vh * 1.12);

      for (const cell of rows[r]) {
        (cell as HTMLElement).style.transform = `translateY(${ty}px)`;
      }
    }

    // ── Hero content opacity ──
    const heroEl = heroContentRef.current;
    if (heroEl) {
      const start = P.JAL_START * 0.4;
      const end   = P.JAL_END   * 0.65;
      const op = 1 - Math.max(0, Math.min(1, (p - start) / (end - start)));
      heroEl.style.opacity = String(op);
    }

    // ── Grid pointer-events: disable after jalousie so buttons below work ──
    const grid = gridRef.current;
    if (grid) {
      grid.style.pointerEvents = p < P.JAL_END + 0.03 ? 'auto' : 'none';
    }
  });

  // ── Scroll snap: snap to nearest section boundary after user stops ────────

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Snap point offsets (in multiples of 1 viewport height)
    const SNAP_VH = [0, 1, 3, 4.5, 5.5, 7];

    let timer: ReturnType<typeof setTimeout>;
    let snapping = false;

    function snapToNearest() {
      if (snapping) return;
      const vh  = window.innerHeight;
      const top = container!.getBoundingClientRect().top + window.scrollY;
      const y   = window.scrollY;

      // Only snap when inside the container
      if (y < top - vh || y > top + CONTAINER_H * vh / 100) return;

      const snapPoints = SNAP_VH.map((n) => Math.round(top + n * vh));
      const nearest = snapPoints.reduce((best, pt) =>
        Math.abs(pt - y) < Math.abs(best - y) ? pt : best,
      );

      if (Math.abs(nearest - y) > 8) {
        snapping = true;
        window.scrollTo({ top: nearest, behavior: 'smooth' });
        setTimeout(() => { snapping = false; }, 700);
      }
    }

    function onScroll() {
      if (snapping) return;
      clearTimeout(timer);
      timer = setTimeout(snapToNearest, 120);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} style={{ height: `${CONTAINER_H}vh` }} className="relative">
      {/* ═══════════ STICKY VIEWPORT ════════════ */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: BG_DEEP,
        }}
      >

        {/* ══ LAYER 1: Section 4 — always at the back ══════════════════════ */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          {/* Atmosphere */}
          <div
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(ellipse at 50% 38%,` +
                `rgba(60,8,8,0.9) 0%, rgba(12,4,4,0.95) 55%, ${BG_DEEP} 100%)`,
            }}
          />
          {/* Subtle dot grid (same as hero) */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(200,60,60,0.18) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ opacity: s4Opacity }}
          >
            {/* Static logo */}
            <motion.div
              style={{ scale: s4LogoScale }}
              className="mb-14 text-center select-none"
            >
              <p
                className="text-white/20 text-[11px] uppercase tracking-[0.4em] font-light mb-3"
              >
                {locale === 'ru' ? 'Добро пожаловать в' : 'Xush kelibsiz'}
              </p>
              <h2
                className="font-black text-white leading-none"
                style={{
                  fontSize: 'clamp(56px, 9vw, 112px)',
                  letterSpacing: '-0.025em',
                }}
              >
                AR{' '}
                <span style={{ color: 'var(--brand)' }}>Market</span>
              </h2>
            </motion.div>

            {/* Three feature cards */}
            <div className="grid grid-cols-3 gap-5 w-full max-w-3xl px-6">
              {FEATURE_CARDS.map((card, i) => {
                const { Icon } = card;
                return (
                  <motion.div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.035)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '16px',
                      padding: '24px',
                      backdropFilter: 'blur(12px)',
                      ...CARD_MOTIONS[i],
                    }}
                  >
                    <div
                      className="mb-4 inline-flex items-center justify-center rounded-xl"
                      style={{
                        width: 40, height: 40,
                        background: 'rgba(220,38,38,0.12)',
                      }}
                    >
                      <Icon size={18} style={{ color: 'var(--brand)' }} />
                    </div>
                    <p className="text-white font-semibold text-sm mb-1">
                      {locale === 'ru' ? card.titleRu : card.titleUz}
                    </p>
                    <p className="text-white/40 text-xs leading-relaxed">
                      {locale === 'ru' ? card.descRu : card.descUz}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div style={{ opacity: ctaOp, y: ctaY }} className="mt-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 font-semibold text-white rounded-full px-8 py-4 transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand)' }}
              >
                {locale === 'ru' ? 'Смотреть товары' : "Mahsulotlarni ko'rish"}
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ══ LAYER 2: Section 2 + 3 (zooms during S3) ════════════════════ */}
        <motion.div
          className="absolute inset-0"
          style={{
            zIndex: 3,
            opacity: s2WrapOpacity,
            scale: s23Scale,
            transformOrigin: 'center center',
          }}
        >
          {/* Atmospheric background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(ellipse at 50% 55%,` +
                `rgba(100,12,12,0.75) 0%, rgba(18,4,4,0.95) 55%, ${BG_DEEP} 100%)`,
            }}
          />

          {/* Concentric glow rings */}
          {[{ size: '62vw', max: 700, opacity: 0.12 }, { size: '40vw', max: 460, opacity: 0.18 }].map(
            (ring, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: ring.size, height: ring.size,
                  maxWidth: ring.max, maxHeight: ring.max,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: `1px solid rgba(220,38,38,${ring.opacity})`,
                  background: `radial-gradient(circle, rgba(180,20,20,${ring.opacity * 0.6}) 0%, transparent 70%)`,
                }}
              />
            ),
          )}

          {/* Section-2 tagline (fades out before zoom) */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
            style={{ opacity: s2TextOpacity, pointerEvents: 'none' }}
          >
            <p
              className="uppercase text-[11px] font-light tracking-[0.35em] mb-7"
              style={{ color: 'var(--brand)' }}
            >
              {locale === 'ru' ? 'Платформа закупок' : 'Xarid platformasi'}
            </p>
            <h2
              className="text-white font-extrabold leading-none mb-6"
              style={{
                fontSize: 'clamp(40px, 7.5vw, 88px)',
                letterSpacing: '-0.04em',
              }}
            >
              {locale === 'ru'
                ? <>Лучшие товары<br />по лучшим ценам</>
                : <>Eng yaxshi<br />mahsulotlar</>}
            </h2>
            <p className="text-white/35 text-lg max-w-sm leading-relaxed font-light">
              {locale === 'ru'
                ? 'Более 100,000 товаров для бизнеса'
                : '100,000 dan ortiq mahsulotlar'}
            </p>
          </motion.div>

          {/* Section-3 big number (appears during zoom) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: s3BigOpacity, pointerEvents: 'none' }}
          >
            <div className="text-center">
              <p
                className="font-black text-white leading-none"
                style={{
                  fontSize: 'clamp(88px, 22vw, 300px)',
                  letterSpacing: '-0.06em',
                  textShadow: '0 0 140px rgba(220,38,38,0.45)',
                }}
              >
                100k
                <span style={{ color: 'var(--brand)' }}>+</span>
              </p>
              <p
                className="text-white/30 uppercase tracking-[0.35em] mt-4 font-light"
                style={{ fontSize: 'clamp(13px, 1.8vw, 20px)' }}
              >
                {locale === 'ru' ? 'товаров в каталоге' : 'mahsulot katalogda'}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ══ LAYER 3: Interactive grid + jalousie cells ═══════════════════ */}
        {/* These ARE the hero background. Each cell becomes a jalousie blind. */}
        <div
          ref={gridRef}
          className="absolute inset-0"
          style={{ zIndex: 8 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* ══ LAYER 4: Hero content (text + rotating logo) ════════════════ */}
        <div
          ref={heroContentRef}
          className="absolute inset-0"
          style={{ zIndex: 20, pointerEvents: 'none' }}
        >
          {/* Big "AR MARKET" — lower-left */}
          <div
            className="absolute"
            style={{ left: '6vw', bottom: '11vh' }}
          >
            <span
              className="block text-white/20 font-light mb-2"
              style={{
                fontSize: '11px',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
              }}
            >
              {locale === 'ru' ? 'Платформа закупок' : 'Xarid platformasi'}
            </span>
            <h1
              className="font-black text-white leading-[0.92]"
              style={{
                fontSize: 'clamp(64px, 10vw, 132px)',
                letterSpacing: '-0.04em',
                textShadow: '0 0 90px rgba(220,38,38,0.18)',
              }}
            >
              AR
              <br />
              <span style={{ color: 'var(--brand)' }}>MARKET</span>
            </h1>
          </div>

          {/* 3D rotating "AR" logo — right side */}
          <div
            className="absolute hidden md:block"
            style={{
              right: '9vw',
              top: '50%',
              transform: 'translateY(-50%)',
              perspective: '700px',
            }}
          >
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/favicon.ico"
                alt="AR Market"
                style={{
                  width: 'clamp(80px, 11vw, 150px)',
                  height: 'clamp(80px, 11vw, 150px)',
                  borderRadius: '22%',
                  filter: 'drop-shadow(0 0 40px rgba(220,38,38,0.55)) brightness(1.05)',
                  display: 'block',
                }}
              />
            </motion.div>
          </div>

          {/* Subtle "scroll" hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.65 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' as const }}
          >
            <span
              className="text-white/40 font-light"
              style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase' }}
            >
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </div>

        {/* ══ LAYER 5: Fixed navigation bar ═══════════════════════════════ */}
        <nav
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-7 py-5"
          style={{ zIndex: 30 }}
        >
          {/* Left: nav links */}
          <div className="flex items-center gap-5">
            {(
              [
                { href: '/products', uz: 'Mahsulotlar', ru: 'Товары'  },
                { href: '/news',     uz: 'Yangiliklar', ru: 'Новости' },
                { href: '/about',    uz: 'Haqimizda',   ru: 'О нас'   },
                { href: '/contacts', uz: 'Kontakt',      ru: 'Контакт' },
              ] as const
            ).map(({ href, uz, ru }) => (
              <Link
                key={href}
                href={href}
                className="text-white/45 hover:text-white/90 text-sm font-medium transition-colors duration-200"
                style={{ letterSpacing: '0.04em' }}
              >
                {locale === 'ru' ? ru : uz}
              </Link>
            ))}
          </div>

          {/* Right: contact */}
          <div
            className="flex items-center gap-2 text-white/30 text-xs font-light"
            style={{ letterSpacing: '0.06em' }}
          >
            <Phone size={12} className="text-white/25" />
            +998 (71) 200-00-00
          </div>
        </nav>

      </div>{/* /sticky */}
    </div>
  );
}
