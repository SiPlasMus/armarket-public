import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ru' ? 'О нас' : 'Biz haqimizda',
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* TODO: About sections (mission, vision, values, stats) — implementation in pages phase */}
      <h1 className="text-2xl font-bold text-foreground">
        {locale === 'ru' ? 'О нас' : 'Biz haqimizda'}
      </h1>
    </div>
  );
}
