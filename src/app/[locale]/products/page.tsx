import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ru' ? 'Товары' : 'Mahsulotlar',
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* TODO: ProductFilters + ProductGrid — implementation in pages phase */}
      <h1 className="text-2xl font-bold text-foreground">
        {locale === 'ru' ? 'Товары' : 'Mahsulotlar'}
      </h1>
    </div>
  );
}
