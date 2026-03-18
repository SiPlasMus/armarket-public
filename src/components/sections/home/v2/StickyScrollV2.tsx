'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  Package,
  ShieldCheck,
  Zap,
  Award,
  Phone,
  ArrowRight,
  Newspaper,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ImageWithFallback } from '@/components/ui';
import { fetchCategories, fetchPopularProducts } from '@/lib/armarketApi';
import { formatPrice } from '@/lib/utils';
import type { UiCategory, UiPopularProduct } from '@/lib/armarketApi';

// ─── Easing ───────────────────────────────────────────────────────────────────
const EASE_OUT: [number, number, number, number] = [0.32, 0.72, 0, 1];

// ─── Panel backgrounds ────────────────────────────────────────────────────────
const PANEL_BG = [
  'radial-gradient(ellipse at 70% 30%, #1a0505 0%, #0d0000 50%, #080808 100%)',
  'radial-gradient(ellipse at 30% 60%, #05101a 0%, #020d14 50%, #080808 100%)',
  'radial-gradient(ellipse at 60% 40%, #0a0a1a 0%, #050510 50%, #080808 100%)',
  'radial-gradient(ellipse at 40% 50%, #0f0505 0%, #0a0000 50%, #080808 100%)',
];

// ─── Panel scroll ranges ──────────────────────────────────────────────────────
// [inputRange, yOutputRange, opacityOutputRange]
type PanelScrollConfig = {
  progressIn:    number;
  progressPeak:  number;
  progressOut:   number;
  progressGone?: number;
};

const PANEL_CONFIGS: PanelScrollConfig[] = [
  { progressIn: 0,    progressPeak: 0.08, progressOut: 0.23, progressGone: 0.28 },
  { progressIn: 0.23, progressPeak: 0.31, progressOut: 0.48, progressGone: 0.53 },
  { progressIn: 0.48, progressPeak: 0.56, progressOut: 0.73, progressGone: 0.78 },
  { progressIn: 0.73, progressPeak: 0.81, progressOut: 1.0  },
];

// ─── Advantages data ──────────────────────────────────────────────────────────
const ADVANTAGES = [
  {
    Icon: ShieldCheck,
    titleUz: "Ishonchli yetkazib berish",
    titleRu: "Надёжная доставка",
    descUz:  "O'z vaqtida va xavfsiz",
    descRu:  "Вовремя и безопасно",
  },
  {
    Icon: Zap,
    titleUz: "Tez buyurtma",
    titleRu: "Быстрый заказ",
    descUz:  "Bir necha daqiqada",
    descRu:  "За несколько минут",
  },
  {
    Icon: Award,
    titleUz: "Sifat kafolati",
    titleRu: "Гарантия качества",
    descUz:  "Tasdiqlangan mahsulotlar",
    descRu:  "Проверенные товары",
  },
  {
    Icon: Phone,
    titleUz: "24/7 qo'llab-quvvatlash",
    titleRu: "Поддержка 24/7",
    descUz:  "Doim yordamga tayyormiz",
    descRu:  "Всегда готовы помочь",
  },
];

// ─── Placeholder news cards ───────────────────────────────────────────────────
const NEWS_CARDS = [
  {
    tagUz: 'Yangilik',
    tagRu: 'Новость',
    titleUz: 'AR Market yangiliklari',
    titleRu: 'Новости AR Market',
    date: '12 mar 2025',
    accent: 'rgba(239,68,68,0.15)',
    tagColor: '#f87171',
  },
  {
    tagUz: 'Katalog',
    tagRu: 'Каталог',
    titleUz: 'Yangi mahsulotlar kataloqi',
    titleRu: 'Новый каталог товаров',
    date: '8 mar 2025',
    accent: 'rgba(251,146,60,0.12)',
    tagColor: '#fb923c',
  },
  {
    tagUz: 'Taklif',
    tagRu: 'Акция',
    titleUz: 'Maxsus takliflar',
    titleRu: 'Специальные предложения',
    date: '5 mar 2025',
    accent: 'rgba(167,139,250,0.12)',
    tagColor: '#a78bfa',
  },
];

// ─── Helper: build useTransform args for a panel ─────────────────────────────
function usePanelTransforms(
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'],
  config: PanelScrollConfig
) {
  const { progressIn, progressPeak, progressOut, progressGone } = config;

  const hasExit = progressGone !== undefined;

  const yInput = hasExit
    ? [progressIn, progressPeak, progressOut, progressGone!]
    : [progressIn, progressPeak, progressOut];

  const yOutput = hasExit ? [80, 0, 0, -60] : [80, 0, 0];
  const opacityOutput = hasExit ? [0, 1, 1, 0] : [0, 1, 1];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const y       = useTransform(scrollYProgress, yInput, yOutput);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const opacity = useTransform(scrollYProgress, yInput, opacityOutput);

  return { y, opacity };
}

// ─── Panel 0: Categories ──────────────────────────────────────────────────────
function CategoriesPanel({
  locale,
  scrollYProgress,
}: {
  locale: 'uz' | 'ru';
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const { y, opacity } = usePanelTransforms(scrollYProgress, PANEL_CONFIGS[0]);
  const [categories, setCategories] = useState<UiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      style={{ y, opacity, background: PANEL_BG[0], willChange: 'transform, opacity' }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <div className="max-w-lg lg:max-w-2xl mx-auto px-6 lg:px-8 w-full h-full flex flex-col justify-center">
        <div
          className="rounded-2xl lg:rounded-3xl p-6 lg:p-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
        <p className="uppercase text-xs tracking-widest mb-3 font-semibold" style={{ color: '#f87171' }}>
          {locale === 'ru' ? 'Категории' : 'Kategoriyalar'}
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: '#fff' }}
        >
          {locale === 'ru' ? 'Найдите свою\nкатегорию' : "O'z toifangizni\ntoping"}
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {locale === 'ru' ? 'Тысячи товаров по всем категориям' : "Barcha toifalar bo'yicha minglab mahsulotlar"}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse h-[72px]"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {categories.map((cat) => (
              <Link
                key={cat.groupCode}
                href={`/products?groupCode=${cat.groupCode}`}
                className="flex flex-col items-center gap-2 rounded-2xl p-3 transition-colors duration-200 group"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                }}
              >
                <Package
                  className="h-5 w-5 shrink-0"
                  style={{ color: '#f87171' }}
                />
                <span
                  className="text-xs text-center leading-tight line-clamp-2"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  {locale === 'ru' ? cat.nameRu : cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold group"
          style={{ color: '#f87171' }}
        >
          {locale === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Panel 1: Popular Products ────────────────────────────────────────────────
function ProductsPanel({
  locale,
  scrollYProgress,
}: {
  locale: 'uz' | 'ru';
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const { y, opacity } = usePanelTransforms(scrollYProgress, PANEL_CONFIGS[1]);
  const [products, setProducts] = useState<UiPopularProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularProducts({ period: 'week', limit: 5 })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      style={{ y, opacity, background: PANEL_BG[1], willChange: 'transform, opacity' }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <div className="max-w-lg lg:max-w-2xl mx-auto px-6 lg:px-8 w-full h-full flex flex-col justify-center">
        <div
          className="rounded-2xl lg:rounded-3xl p-6 lg:p-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
        <p className="uppercase text-xs tracking-widest mb-3 font-semibold" style={{ color: '#f87171' }}>
          {locale === 'ru' ? 'Популярное' : 'Ommabop mahsulotlar'}
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: '#fff' }}
        >
          {locale === 'ru' ? 'Что покупают\nчаще всего' : "Eng ko'p sotib\nolganlar"}
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {locale === 'ru' ? 'Топ товаров за эту неделю' : "Bu hafta eng ommabop mahsulotlar"}
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-pulse"
                >
                  <div
                    className="rounded-xl shrink-0 h-12 w-12"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  />
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-3 rounded"
                      style={{ background: 'rgba(255,255,255,0.08)', width: '70%' }}
                    />
                    <div
                      className="h-3 rounded"
                      style={{ background: 'rgba(255,255,255,0.05)', width: '40%' }}
                    />
                  </div>
                </div>
              ))
            : products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.09)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
                  }}
                >
                  <div
                    className="rounded-xl shrink-0 h-12 w-12 overflow-hidden relative flex items-center justify-center"
                    style={{ background: 'rgba(239,68,68,0.08)' }}
                  >
                    {product.image ? (
                      <ImageWithFallback
                        src={product.image}
                        alt={locale === 'ru' ? product.nameRu : product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Package
                        className="h-5 w-5 shrink-0"
                        style={{ color: 'rgba(248,113,113,0.7)' }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium line-clamp-1"
                      style={{ color: 'rgba(255,255,255,0.88)' }}
                    >
                      {locale === 'ru' ? product.nameRu : product.name}
                    </p>
                    <p
                      className="text-sm font-semibold mt-0.5"
                      style={{ color: '#f87171' }}
                    >
                      {formatPrice(product.price, locale)}
                    </p>
                  </div>
                </Link>
              ))}
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold group"
          style={{ color: '#f87171' }}
        >
          {locale === 'ru' ? 'Все товары' : 'Barcha mahsulotlar'}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Panel 2: Advantages ──────────────────────────────────────────────────────
function AdvantagesPanel({
  locale,
  scrollYProgress,
}: {
  locale: 'uz' | 'ru';
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const { y, opacity } = usePanelTransforms(scrollYProgress, PANEL_CONFIGS[2]);

  return (
    <motion.div
      style={{ y, opacity, background: PANEL_BG[2], willChange: 'transform, opacity' }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <div className="max-w-lg lg:max-w-2xl mx-auto px-6 lg:px-8 w-full h-full flex flex-col justify-center">
        <div
          className="rounded-2xl lg:rounded-3xl p-6 lg:p-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
        <p className="uppercase text-xs tracking-widest mb-3 font-semibold" style={{ color: '#f87171' }}>
          {locale === 'ru' ? 'Преимущества' : 'Afzalliklar'}
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: '#fff' }}
        >
          {locale === 'ru' ? 'Почему выбирают\nнас' : "Nima uchun bizni\ntanlashadi"}
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {locale === 'ru' ? 'Надёжность, скорость, качество' : "Ishonchlilik, tezlik, sifat"}
        </p>

        <div className="flex flex-col gap-5">
          {ADVANTAGES.map(({ Icon, titleUz, titleRu, descUz, descRu }, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className="rounded-full p-3 flex items-center justify-center shrink-0"
                style={{ background: 'rgba(239,68,68,0.1)' }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: '#f87171' }}
                />
              </div>
              <div>
                <p
                  className="font-semibold text-sm leading-tight"
                  style={{ color: '#fff' }}
                >
                  {locale === 'ru' ? titleRu : titleUz}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {locale === 'ru' ? descRu : descUz}
                </p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Panel 3: News / CTA ──────────────────────────────────────────────────────
function NewsCTAPanel({
  locale,
  scrollYProgress,
}: {
  locale: 'uz' | 'ru';
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const { y, opacity } = usePanelTransforms(scrollYProgress, PANEL_CONFIGS[3]);

  return (
    <motion.div
      style={{ y, opacity, background: PANEL_BG[3], willChange: 'transform, opacity' }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <div className="max-w-lg lg:max-w-2xl mx-auto px-6 lg:px-8 w-full h-full flex flex-col justify-center">
        <div
          className="rounded-2xl lg:rounded-3xl p-6 lg:p-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
        <p className="uppercase text-xs tracking-widest mb-3 font-semibold" style={{ color: '#f87171' }}>
          {locale === 'ru' ? 'Новости' : 'Yangiliklar'}
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: '#fff' }}
        >
          {locale === 'ru' ? 'Будьте в курсе\nсобытий' : "Yangiliklardan\nxabardor bo'ling"}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {locale === 'ru' ? 'Акции, обновления и новые поступления' : "Chegirmalar, yangiliklar va yangi mahsulotlar"}
        </p>

        {/* News cards */}
        <div className="flex flex-col gap-3 mb-6">
          {NEWS_CARDS.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{
                background: card.accent,
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span
                className="inline-block text-xs rounded-full px-2 py-0.5 font-semibold mb-2"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  color: card.tagColor,
                  border: `1px solid ${card.tagColor}30`,
                }}
              >
                {locale === 'ru' ? card.tagRu : card.tagUz}
              </span>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {locale === 'ru' ? card.titleRu : card.titleUz}
              </p>
              <div className="flex items-center gap-1.5">
                <Newspaper
                  className="h-3 w-3"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                />
                <p
                  className="text-xs"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  {card.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* News link */}
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-4 group" style={{ color: '#f87171' }}>
          {locale === 'ru' ? 'Все новости' : 'Barcha yangiliklar'}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        {/* CTA button */}
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 w-full rounded-full py-4 font-semibold text-sm transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: '#fff',
            boxShadow: '0 4px 24px rgba(220,38,38,0.35)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 32px rgba(220,38,38,0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 24px rgba(220,38,38,0.35)';
          }}
        >
          {locale === 'ru' ? 'Смотреть товары →' : "Mahsulotlarni ko'rish →"}
        </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scroll progress dots indicator ──────────────────────────────────────────
function ScrollDots({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v < 0.25)      setActiveIndex(0);
      else if (v < 0.5)  setActiveIndex(1);
      else if (v < 0.75) setActiveIndex(2);
      else               setActiveIndex(3);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: activeIndex === i ? 1.35 : 1,
            opacity: activeIndex === i ? 1 : 0.3,
          }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="rounded-full"
          style={{
            width: activeIndex === i ? '20px' : '8px',
            height: '8px',
            background: activeIndex === i ? '#ef4444' : 'rgba(255,255,255,0.4)',
            transition: 'width 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StickyScrollV2() {
  const locale = useLocale() as 'uz' | 'ru';

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      ref={containerRef}
      style={{ height: '400vh' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          willChange: 'transform',
          contain: 'layout paint',
        }}
      >
        {/* Ambient background (always dark) */}
        <div
          className="absolute inset-0"
          style={{ background: '#080808' }}
        />

        {/* 4 panels — absolute, driven by scroll */}
        <CategoriesPanel  locale={locale} scrollYProgress={scrollYProgress} />
        <ProductsPanel    locale={locale} scrollYProgress={scrollYProgress} />
        <AdvantagesPanel  locale={locale} scrollYProgress={scrollYProgress} />
        <NewsCTAPanel     locale={locale} scrollYProgress={scrollYProgress} />

        {/* Scroll progress dots */}
        <ScrollDots scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
