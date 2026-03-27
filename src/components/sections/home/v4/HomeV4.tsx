'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  ArrowRight,
  BarChart3,
  Boxes,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import Categories from '@/components/sections/home/Categories';
import PopularProducts from '@/components/sections/home/PopularProducts';
import Advantages from '@/components/sections/home/Advantages';
import NewsPreview from '@/components/sections/home/NewsPreview';
import CTABanner from '@/components/sections/home/CTABanner';

const highlights = [
  {
    icon: Boxes,
    value: '100k+',
    labelUz: 'Mahsulot katalogi',
    labelRu: 'Каталог товаров',
  },
  {
    icon: Truck,
    value: '24/7',
    labelUz: 'Buyurtma oqimi',
    labelRu: 'Поток заказов',
  },
  {
    icon: MapPinned,
    value: '15+',
    labelUz: 'Hududlar',
    labelRu: 'Регионы',
  },
];

const signals = [
  {
    icon: ShieldCheck,
    titleUz: 'Barqaror ishlash',
    titleRu: 'Стабильная работа',
    textUz: 'Yengil animatsiyalar, tez ochilish va toza navigatsiya.',
    textRu: 'Легкая анимация, быстрое открытие и чистая навигация.',
  },
  {
    icon: Sparkles,
    titleUz: 'Zamonaviy ko‘rinish',
    titleRu: 'Современный вид',
    textUz: 'Qalin tipografiya, qatlamli fon va premium kartalar.',
    textRu: 'Сильная типографика, многослойный фон и premium-карточки.',
  },
  {
    icon: BarChart3,
    titleUz: 'Tez topish',
    titleRu: 'Быстрый поиск',
    textUz: 'Kategoriyalar, ommabop mahsulotlar va yangiliklar bir oqimda.',
    textRu: 'Категории, популярные товары и новости в одном потоке.',
  },
];

export default function HomeV4() {
  const locale = useLocale() as 'uz' | 'ru';
  const isRu = locale === 'ru';

  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand)_8%,var(--surface))_0%,var(--surface)_56%,var(--surface-alt)_100%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.16),transparent_62%)]" />
          <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -right-16 top-16 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(to right, color-mix(in srgb, var(--border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 55%, transparent) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
              <span className="h-2 w-2 rounded-full bg-brand" />
              {isRu ? 'AR Market digital flow' : 'AR Market digital flow'}
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-[-0.04em] text-foreground sm:text-5xl lg:text-7xl">
              {isRu ? 'Платформа закупок, которая ощущается быстро.' : 'Tez ishlaydigan va aniq his qilinadigan xarid platformasi.'}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-foreground-muted sm:text-lg">
              {isRu
                ? 'Новый домашний экран делает каталог, популярные товары и переходы между страницами заметно спокойнее и чище.'
                : 'Yangi bosh sahifa katalog, ommabop mahsulotlar va sahifalar orasidagi o‘tishni ancha silliq va toza qiladi.'}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                href="/products"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="shadow-theme-md"
              >
                {isRu ? 'Открыть каталог' : 'Katalogni ochish'}
              </Button>
              <Button variant="secondary" size="lg" href="/about">
                {isRu ? 'О платформе' : 'Platforma haqida'}
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, value, labelUz, labelRu }) => (
                <div
                  key={value}
                  className="rounded-3xl border border-border bg-surface-elevated/90 p-4 shadow-theme-sm backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-subtle text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{value}</div>
                      <div className="text-sm text-foreground-muted">
                        {isRu ? labelRu : labelUz}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-brand/12 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-slate-950 text-white shadow-theme-lg">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.34),transparent_32%),linear-gradient(160deg,#0b111d_0%,#160b0b_48%,#09090b_100%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
              <div className="relative p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-white/45">
                      {isRu ? 'Home V4' : 'Home V4'}
                    </div>
                    <div className="mt-2 text-2xl font-semibold">
                      {isRu ? 'Спокойный интерфейс, живой характер.' : 'Barqaror interfeys, jonli xarakter.'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                      {isRu ? 'режим' : 'rejim'}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-emerald-300">
                      {isRu ? 'Stable UI' : 'Stable UI'}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {signals.map(({ icon: Icon, titleUz, titleRu, textUz, textRu }) => (
                    <div
                      key={titleUz}
                      className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-rose-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {isRu ? titleRu : titleUz}
                          </div>
                          <div className="mt-1 text-sm leading-6 text-white/62">
                            {isRu ? textRu : textUz}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/news"
                    className="relative z-10 rounded-2xl border border-white/12 bg-white/6 px-4 py-4 text-sm font-medium text-white/88 transition-colors hover:bg-white/10"
                  >
                    {isRu ? 'Открыть новости' : 'Yangiliklarni ochish'}
                  </Link>
                  <Link
                    href="/contacts"
                    className="relative z-10 rounded-2xl border border-rose-300/20 bg-rose-400/12 px-4 py-4 text-sm font-medium text-rose-100 transition-colors hover:bg-rose-400/18"
                  >
                    {isRu ? 'Связаться с нами' : 'Bog‘lanish'}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="border-b border-border bg-surface-alt/70">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {signals.map(({ icon: Icon, titleUz, titleRu, textUz, textRu }) => (
            <div
              key={titleUz}
              className="rounded-2xl border border-border bg-surface-elevated px-4 py-4 shadow-theme-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-subtle text-brand">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {isRu ? titleRu : titleUz}
                  </div>
                  <div className="mt-1 text-sm text-foreground-muted">
                    {isRu ? textRu : textUz}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Categories />
      <PopularProducts />
      <Advantages />
      <NewsPreview />
      <CTABanner />
    </div>
  );
}
