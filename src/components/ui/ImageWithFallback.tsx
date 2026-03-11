'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
  priority?: boolean;
  fill?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackText,
  priority = false,
  fill = false,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const showFallback = !src || error;

  if (showFallback) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-surface-alt text-foreground-muted select-none',
          className
        )}
        style={fill ? undefined : { width, height }}
        aria-label={alt}
      >
        {fallbackText ? (
          <span className="text-lg font-bold opacity-40">
            {fallbackText.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <Package className="h-10 w-10 opacity-25" />
        )}
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn('object-cover', className)}
        priority={priority}
        onError={() => setError(true)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-cover', className)}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
