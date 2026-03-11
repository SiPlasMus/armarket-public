import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/demo-data';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* TODO: Full product detail — implementation in pages phase */}
      <h1 className="text-2xl font-bold text-foreground">
        {locale === 'ru' ? product.nameRu : product.name}
      </h1>
    </div>
  );
}
