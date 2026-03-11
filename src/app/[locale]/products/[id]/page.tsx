import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowLeft, CheckCircle2, XCircle, Star } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getProductById, DEMO_PRODUCTS, DEMO_CATEGORIES } from '@/lib/demo-data';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RelatedProducts } from '@/components/sections/products/RelatedProducts';
import { formatPrice } from '@/lib/utils';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: locale === 'ru' ? product.nameRu : product.name,
  };
}

const badgeVariants = {
  new:     'success',
  popular: 'brand',
  sale:    'warning',
  limited: 'muted',
} as const;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const product = getProductById(id);
  if (!product) notFound();

  const t  = await getTranslations({ locale, namespace: 'products' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const isRu       = locale === 'ru';
  const name        = isRu ? product.nameRu       : product.name;
  const description = isRu ? product.descriptionRu : product.description;
  const price       = formatPrice(product.price, locale as 'uz' | 'ru');

  // Category label
  const category = DEMO_CATEGORIES.find((c) => c.id === product.categoryId);
  const categoryName = category ? (isRu ? category.nameRu : category.name) : '';

  // Related products: same category, different product
  const related = DEMO_PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Breadcrumb + back ──────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">
          {isRu ? 'Главная' : 'Bosh sahifa'}
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand transition-colors">
          {t('title')}
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{name}</span>
      </nav>

      {/* ── Main product layout ─────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

        {/* Image */}
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden bg-surface-alt border border-border shadow-theme-md">
            <ImageWithFallback
              src={product.image}
              alt={name}
              fill
              priority
              className="object-contain p-8"
              fallbackText={name}
            />
          </div>

          {/* Badge overlay on image */}
          {product.badge && (
            <div className="absolute top-4 left-4">
              <Badge
                variant={badgeVariants[product.badge as keyof typeof badgeVariants] ?? 'brand'}
                size="md"
              >
                {tc(product.badge as 'new' | 'popular' | 'sale' | 'limited')}
              </Badge>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col">
          {/* Category */}
          {categoryName && (
            <p className="text-sm font-medium text-foreground-muted uppercase tracking-wider mb-2">
              {categoryName}
            </p>
          )}

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
            {name}
          </h1>

          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating!)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-foreground-muted">
                {product.rating.toFixed(1)}
                {product.reviewCount && ` (${product.reviewCount})`}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-5">
            <p className="text-3xl sm:text-4xl font-extrabold text-brand">{price}</p>
          </div>

          {/* In-stock status */}
          <div className="flex items-center gap-2 mb-6">
            {product.inStock ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {tc('inStock')}
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-foreground-muted" />
                <span className="text-sm font-medium text-foreground-muted">
                  {tc('outOfStock')}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="mb-8 p-4 bg-surface-alt rounded-2xl border border-border">
              <p className="text-sm font-medium text-foreground-muted mb-1">
                {isRu ? 'Характеристики' : 'Xususiyatlar'}
              </p>
              <p className="text-foreground text-sm leading-relaxed">{description}</p>
            </div>
          )}

          {/* Divider */}
          <div className="mt-auto space-y-3">
            <Button
              variant="primary"
              size="lg"
              href="/contacts"
              className="w-full"
            >
              {isRu ? 'Связаться для заказа' : 'Buyurtma berish'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/products"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="w-full"
            >
              {t('backToCatalog')}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Related products ────────────────────────────────────────── */}
      <RelatedProducts products={related} />
    </div>
  );
}
