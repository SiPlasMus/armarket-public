import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AboutClient } from '@/components/sections/about/AboutClient';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title') };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });
  const isRu = locale === 'ru';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative mb-12 overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(145deg,color-mix(in_srgb,var(--brand)_8%,var(--surface))_0%,var(--surface-elevated)_56%,var(--surface-alt)_100%)] p-6 shadow-theme-sm sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-36 w-36 rounded-full bg-yellow-400/10 blur-3xl" />
        </div>
        <div className="relative">
          <div className="mb-3 inline-flex rounded-full border border-brand/20 bg-brand/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Brand story
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-2 max-w-3xl text-foreground-muted">{t('subtitle')}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Focus</div>
              <div className="mt-2 text-base font-semibold text-foreground">
                {isRu ? 'Цифровой закупочный опыт' : 'Raqamli xarid tajribasi'}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Scale</div>
              <div className="mt-2 text-base font-semibold text-foreground">100k+ SKU</div>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Approach</div>
              <div className="mt-2 text-base font-semibold text-foreground">
                {isRu ? 'Скорость + доверие' : 'Tezlik + ishonch'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AboutClient />
    </div>
  );
}
