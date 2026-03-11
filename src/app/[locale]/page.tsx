import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import HeroSection from '@/components/sections/home/HeroSection';
import PopularProducts from '@/components/sections/home/PopularProducts';
import Advantages from '@/components/sections/home/Advantages';
import Categories from '@/components/sections/home/Categories';
import NewsPreview from '@/components/sections/home/NewsPreview';
import CTABanner from '@/components/sections/home/CTABanner';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ru' ? 'AR Market — Удобная платформа покупок' : 'AR Market — Qulay xarid platformasi',
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <Categories />
      <PopularProducts />
      <Advantages />
      <NewsPreview />
      <CTABanner />
    </>
  );
}
