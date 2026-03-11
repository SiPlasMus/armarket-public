import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ProductsClient from '@/components/sections/products/ProductsClient';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return { title: t('title') };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  return <ProductsClient initialCategory={category} />;
}
