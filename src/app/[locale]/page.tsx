import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

// ── Design switch: uncomment ONE block ───────────────────────────────────────

// V3: farmminerals-inspired (ACTIVE)
// import HomeV3 from '@/components/sections/home/v3/HomeV3';

// V2: sticky-scroll / Zomato-inspired
import VideoHeroV2 from '@/components/sections/home/v2/VideoHeroV2';
import StickyScrollV2 from '@/components/sections/home/v2/StickyScrollV2';
import CTABanner from '@/components/sections/home/CTABanner';

// V1: original
// import HeroSection from '@/components/sections/home/HeroSection';
// import PopularProducts from '@/components/sections/home/PopularProducts';
// import Advantages from '@/components/sections/home/Advantages';
// import Categories from '@/components/sections/home/Categories';
// import NewsPreview from '@/components/sections/home/NewsPreview';
// import CTABanner from '@/components/sections/home/CTABanner';

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
      {/* V3 active — swap to V2 or V1 by changing imports above */}
      {/*<HomeV3 />*/}

       {/*V2: */}
      <VideoHeroV2 /> <StickyScrollV2 /> <CTABanner />
      {/* V1: <HeroSection /> <Categories /> <PopularProducts /> <Advantages /> <NewsPreview /> <CTABanner /> */}
    </>
  );
}
