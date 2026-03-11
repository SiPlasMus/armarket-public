import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { NewsClient } from '@/components/sections/news/NewsClient';

interface NewsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });
  return { title: t('title') };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <NewsClient />
    </div>
  );
}
