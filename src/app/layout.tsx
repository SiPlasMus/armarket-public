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
        {/* Prevent Telegram WebView from showing "can't download" on overscroll.
            CSS overscroll-behavior:none is ignored by Telegram's scroll container,
            so we block the native bounce via touchmove when already at page bounds. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var _sy=0;document.addEventListener('touchstart',function(e){_sy=e.touches[0].pageY},{passive:true});document.addEventListener('touchmove',function(e){var y=e.touches[0].pageY,el=document.scrollingElement||document.documentElement,top=el.scrollTop,bot=el.scrollHeight-el.clientHeight-top;if((top<=0&&y>_sy)||(bot<=0&&y<_sy)){e.preventDefault();}},{passive:false});})();` }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
