'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ProductCard } from './ProductCard';
import { staggerContainer, fadeInUp, viewportOnce } from '@/lib/animations';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations('products');

  if (products.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="text-xl font-bold text-foreground mb-6"
      >
        {t('relatedProducts')}
      </motion.h2>
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={fadeInUp}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
