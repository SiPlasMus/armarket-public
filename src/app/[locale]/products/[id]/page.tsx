import { cache, Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowLeft, CheckCircle2, XCircle, Tag, Barcode, Box, Hash } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { fetchProductById, fetchProducts } from '@/lib/armarketApi';
import type { UiProductDetails } from '@/lib/armarketApi';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Button } from '@/components/ui/Button';
import { RelatedProducts } from '@/components/sections/products/RelatedProducts';
import { formatPrice } from '@/lib/utils';

// cache() deduplicates calls within the same render pass —
// generateMetadata and the page component share one fetch instead of two.
const getProduct = cache(fetchProductById);

/** Fetches related products independently so the main product renders without waiting. */
async function RelatedSection({ groupCode, currentId }: { groupCode: number; currentId: string }) {
  const relatedRes = groupCode
    ? await fetchProducts({ groupCode, limit: 5 }).catch(() => null)
    : null;
  const related = (relatedRes?.products ?? []).filter((p) => p.id !== currentId).slice(0, 4);
  return <RelatedProducts products={related} />;
}

interface ProductDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

/** When the detail endpoint fails (Tax API 500), fall back to basic list data. */
async function getProductWithFallback(
  id: string,
): Promise<{ product: UiProductDetails; basicOnly: boolean } | null> {
  const full = await getProduct(id);
  if (full) return { product: full, basicOnly: false };

  // Detail endpoint failed — try to find the item in the product list
  const res = await fetchProducts({ search: id, limit: 20 }).catch(() => null);
  const card = res?.products.find((p) => p.id === id);
  if (!card) return null;

  return {
    basicOnly: true,
    product: {
      ...card,
      images:              [],
      mainImage:           card.image,
      mxikCode:            null,
      mxikName:            null,
      brandName:           null,
      internationalCode:   null,
      attributeName:       null,
      taxGroupName:        null,
      taxClassName:        null,
      taxPositionName:     null,
      taxSubPositionName:  null,
    },
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const result = await getProductWithFallback(id);
  if (!result) return {};
  const { product } = result;
  return { title: locale === 'ru' ? product.nameRu : product.name };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const result = await getProductWithFallback(id);

  if (!result) {
    const t = await getTranslations({ locale, namespace: 'products' });
    const isRu = locale === 'ru';
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center gap-6 text-center">
        <p className="text-4xl">📦</p>
        <h1 className="text-xl font-bold text-foreground">
          {isRu ? 'Информация о товаре временно недоступна' : "Mahsulot ma'lumotlari vaqtincha mavjud emas"}
        </h1>
        <p className="text-foreground-muted text-sm max-w-sm">
          {isRu
            ? 'Попробуйте позже или вернитесь в каталог.'
            : "Keyinroq qayta urinib ko'ring yoki katalogga qayting."}
        </p>
        <Button variant="secondary" href="/products" leftIcon={<ArrowLeft className="h-4 w-4" />}>
          {t('backToCatalog')}
        </Button>
      </div>
    );
  }

  const { product, basicOnly } = result;

  const t  = await getTranslations({ locale, namespace: 'products' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const isRu         = locale === 'ru';
  const name         = isRu ? product.nameRu : product.name;
  const categoryName = isRu ? product.categoryNameRu : product.categoryName;
  const price        = formatPrice(product.price, locale as 'uz' | 'ru');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
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

      {/* ── Partial data notice ─────────────────────────────────────── */}
      {basicOnly && (
        <div className="mb-6 px-4 py-3 rounded-2xl bg-surface-alt border border-border text-sm text-foreground-muted">
          {isRu
            ? 'Расширенная информация о товаре временно недоступна. Показаны основные данные.'
            : "Mahsulot haqida batafsil ma'lumot vaqtincha mavjud emas. Asosiy ma'lumotlar ko'rsatilmoqda."}
        </div>
      )}

      {/* ── Main layout — 2-col with image, 1-col without ─────────────── */}
      <div className={product.images.length > 0 ? 'grid lg:grid-cols-2 gap-10 lg:gap-16' : ''}>

        {/* ── Image gallery (only when images exist from tax API) ─────── */}
        {product.images.length > 0 && (
          <div className="space-y-3">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-alt border border-border shadow-theme-md">
              <ImageWithFallback
                src={product.mainImage}
                alt={name}
                fill
                priority
                unoptimized
                className="object-contain p-8"
                fallbackText={name}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((src, i) => (
                  <div
                    key={i}
                    className="shrink-0 h-16 w-16 rounded-xl overflow-hidden border border-border bg-surface-alt"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${name} ${i + 1}`} className="h-full w-full object-contain p-1" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Info panel ─────────────────────────────────────────────── */}
        <div className={`flex flex-col${product.images.length === 0 ? ' max-w-2xl' : ''}`}>
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

          {/* Price */}
          <div className="mb-5">
            <p className="text-3xl sm:text-4xl font-extrabold text-brand">{price}</p>
            <p className="text-xs text-foreground-muted mt-1">{product.currency}</p>
          </div>

          {/* Stock — hidden for basic-only items */}
          {!basicOnly && (
            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {tc('inStock')}
                    {product.onHand > 0 && (
                      <span className="text-foreground-muted font-normal ml-1">
                        ({product.onHand})
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-foreground-muted" />
                  <span className="text-sm font-medium text-foreground-muted">{tc('outOfStock')}</span>
                </>
              )}
            </div>
          )}

          {/* Meta info block */}
          {(product.id || product.brandName || (!basicOnly && product.barcodes.length > 0) || product.attributeName || product.mxikName) && (
            <div className="mb-6 p-4 bg-surface-alt rounded-2xl border border-border space-y-2.5">
              {product.id && (
                <div className="flex items-start gap-2.5">
                  <Hash className="h-4 w-4 text-foreground-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-foreground-muted">{isRu ? 'Код товара' : 'Tovar kodi'}</p>
                    <p className="text-sm font-medium text-foreground">{product.id}</p>
                  </div>
                </div>
              )}
              {product.brandName && (
                <div className="flex items-start gap-2.5">
                  <Tag className="h-4 w-4 text-foreground-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-foreground-muted">{isRu ? 'Бренд' : 'Brend'}</p>
                    <p className="text-sm font-medium text-foreground">{product.brandName}</p>
                  </div>
                </div>
              )}
              {!basicOnly && product.barcodes.length > 0 && (
                <div className="flex items-start gap-2.5">
                  <Barcode className="h-4 w-4 text-foreground-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-foreground-muted">{isRu ? 'Штрихкод' : 'Barkod'}</p>
                    <p className="text-sm font-medium text-foreground">{product.barcodes[0]}</p>
                  </div>
                </div>
              )}
              {product.mxikName && (
                <div className="flex items-start gap-2.5">
                  <Box className="h-4 w-4 text-foreground-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-foreground-muted">MXIK</p>
                    <p className="text-sm text-foreground leading-snug">{product.mxikName}</p>
                  </div>
                </div>
              )}
              {product.attributeName && (
                <div className="flex items-start gap-2.5">
                  <Box className="h-4 w-4 text-foreground-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-foreground-muted">{isRu ? 'Атрибут' : 'Atribut'}</p>
                    <p className="text-sm text-foreground">{product.attributeName}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tax classification (collapsed details) */}
          {(product.taxGroupName || product.taxClassName) && (
            <details className="mb-6 group">
              <summary className="text-sm text-foreground-muted cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-1.5">
                <span className="text-xs border border-border rounded px-2 py-0.5">
                  {isRu ? 'Налоговая классификация' : 'Soliq tasnifi'}
                </span>
              </summary>
              <div className="mt-2 p-3 bg-surface-alt rounded-xl border border-border text-xs text-foreground-muted space-y-1">
                {product.taxGroupName       && <p>{isRu ? 'Группа' : 'Guruh'}: {product.taxGroupName}</p>}
                {product.taxClassName       && <p>{isRu ? 'Класс' : 'Sinf'}: {product.taxClassName}</p>}
                {product.taxPositionName    && <p>{isRu ? 'Позиция' : 'Pozitsiya'}: {product.taxPositionName}</p>}
                {product.taxSubPositionName && <p>{isRu ? 'Подпозиция' : 'Kichik pozitsiya'}: {product.taxSubPositionName}</p>}
              </div>
            </details>
          )}

          {/* Actions */}
          <div className="mt-auto space-y-3">
            <Button variant="primary" size="lg" href="/contacts" className="w-full">
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

      {/* ── Related products — streamed separately so main content renders first ── */}
      <Suspense fallback={null}>
        <RelatedSection groupCode={product.groupCode} currentId={product.id} />
      </Suspense>
    </div>
  );
}
