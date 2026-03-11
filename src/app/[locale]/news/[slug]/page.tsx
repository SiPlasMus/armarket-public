import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getNewsBySlug, getRelatedNews, DEMO_NEWS } from '@/lib/demo-data';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RelatedNews } from '@/components/sections/news/RelatedNews';
import { formatDate } from '@/lib/utils';

interface NewsArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return DEMO_NEWS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return {};
  return {
    title: locale === 'ru' ? article.titleRu : article.title,
    description: locale === 'ru' ? article.summaryRu : article.summary,
  };
}

const catVariants = {
  news:   'brand',
  promo:  'warning',
  update: 'success',
} as const;

const catLabels: Record<string, { uz: string; ru: string }> = {
  news:   { uz: 'Yangilik',     ru: 'Новость'     },
  promo:  { uz: 'Aksiya',       ru: 'Акция'        },
  update: { uz: 'Yangilanish',  ru: 'Обновление'  },
};

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const t  = await getTranslations({ locale, namespace: 'news' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const isRu    = locale === 'ru';
  const title   = isRu ? article.titleRu   : article.title;
  const summary = isRu ? article.summaryRu : article.summary;
  const content = isRu ? article.contentRu : article.content;

  const catLabel = catLabels[article.category]?.[isRu ? 'ru' : 'uz'] ?? article.category;
  const related  = getRelatedNews(article, 3);

  // Split content into paragraphs on double newlines
  const paragraphs = content?.split('\n\n').filter(Boolean) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">
          {isRu ? 'Главная' : 'Bosh sahifa'}
        </Link>
        <span>/</span>
        <Link href="/news" className="hover:text-brand transition-colors">
          {t('title')}
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{title}</span>
      </nav>

      {/* ── Article layout ──────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto">

        {/* Hero image */}
        <div className="relative aspect-[16/7] rounded-3xl overflow-hidden bg-surface-alt border border-border mb-8 shadow-theme-md">
          <ImageWithFallback
            src={article.image}
            alt={title}
            fill
            priority
            className="object-cover"
            fallbackText={title}
          />
          {/* Gradient overlay for visual depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </div>

        {/* Meta row: badge + date */}
        <div className="flex items-center gap-3 mb-4">
          <Badge
            variant={catVariants[article.category as keyof typeof catVariants] ?? 'brand'}
            size="md"
          >
            {catLabel}
          </Badge>
          <span className="flex items-center gap-1.5 text-sm text-foreground-muted">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {formatDate(article.date, locale as 'uz' | 'ru')}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
          {title}
        </h1>

        {/* Summary / lead */}
        <p className="text-lg text-foreground-muted leading-relaxed border-l-4 border-brand pl-4 mb-8">
          {summary}
        </p>

        {/* Body content */}
        {paragraphs.length > 0 ? (
          <div className="space-y-4 text-foreground leading-relaxed mb-10">
            {paragraphs.map((para, i) => {
              // Detect list-like paragraphs (lines starting with -)
              const lines = para.split('\n');
              const isList = lines.length > 1 && lines.slice(1).every((l) => l.startsWith('-'));
              if (isList) {
                return (
                  <div key={i}>
                    {lines[0] && <p className="font-medium mb-2">{lines[0]}</p>}
                    <ul className="space-y-1 pl-4">
                      {lines.slice(1).map((line, j) => (
                        <li key={j} className="flex items-start gap-2 text-foreground-muted">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                          {line.replace(/^-\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return <p key={i}>{para}</p>;
            })}
          </div>
        ) : (
          <div className="mb-10" />
        )}

        {/* Divider + Back button */}
        <div className="border-t border-border pt-6">
          <Button
            variant="secondary"
            size="md"
            href="/news"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            {t('backToNews')}
          </Button>
        </div>
      </div>

      {/* ── Related articles ────────────────────────────────────────── */}
      <RelatedNews items={related} />
    </div>
  );
}
