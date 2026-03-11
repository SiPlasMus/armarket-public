import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

interface NewsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ru' ? 'Новости' : 'Yangiliklar',
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* TODO: NewsList with category filter — implementation in pages phase */}
      <h1 className="text-2xl font-bold text-foreground">
        {locale === 'ru' ? 'Новости' : 'Yangiliklar'}
      </h1>
    </div>
  );
}
