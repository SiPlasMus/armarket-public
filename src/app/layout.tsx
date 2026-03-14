import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { THEME_INIT_SCRIPT } from '@/lib/themes';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: 'AR Market',
    template: '%s | AR Market',
  },
  description: "AR Market — O'zbekistoning zamonaviy xarid platformasi",
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: data-theme & lang are set by client-side logic,
    // so a mismatch between SSR and CSR is expected and safe to suppress.
    <html lang="uz" suppressHydrationWarning>
      <head>
        {/* No-FOUC theme script — runs synchronously before paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
