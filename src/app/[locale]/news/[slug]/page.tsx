import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getNewsBySlug } from '@/lib/demo-data';

interface NewsArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getNewsBySlug(slug);
  if (!article) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* TODO: Full article layout — implementation in pages phase */}
      <h1 className="text-2xl font-bold text-foreground">
        {locale === 'ru' ? article.titleRu : article.title}
      </h1>
    </div>
  );
}
