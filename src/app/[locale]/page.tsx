import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import HomeV4 from '@/components/sections/home/v4/HomeV4';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ru' ? 'AR Market - Удобная платформа покупок' : 'AR Market - Qulay xarid platformasi',
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeV4 />;
}
