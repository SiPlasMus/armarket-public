import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ProductsClient from '@/components/sections/products/ProductsClient';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ groupCode?: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return { title: t('title') };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale }    = await params;
  const { groupCode } = await searchParams;
  setRequestLocale(locale);

  const initialGroupCode = groupCode ? parseInt(groupCode, 10) : undefined;

  return <ProductsClient initialGroupCode={initialGroupCode} />;
}
