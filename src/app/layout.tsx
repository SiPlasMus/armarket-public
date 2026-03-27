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
  description: "AR Market - O'zbekistoning zamonaviy xarid platformasi",
  icons: { icon: '/favicon.ico' },
};

const TELEGRAM_WEBVIEW_SCRIPT = `(function(){try{var ua=navigator.userAgent||'';var tg=window.Telegram&&window.Telegram.WebApp;var isTelegram=/Telegram/i.test(ua)||!!tg;if(!isTelegram)return;var root=document.documentElement;root.setAttribute('data-webview','telegram');if(tg&&typeof tg.ready==='function')tg.ready();if(tg&&typeof tg.expand==='function')tg.expand();if(tg&&typeof tg.disableVerticalSwipes==='function')tg.disableVerticalSwipes();var startY=0;document.addEventListener('touchstart',function(e){if(e.touches&&e.touches.length===1){startY=e.touches[0].clientY;}},{passive:true});document.addEventListener('touchmove',function(e){if(!e.cancelable||!e.touches||e.touches.length!==1)return;var target=e.target;if(target&&target.closest&&target.closest('input, textarea, [contenteditable="true"]'))return;var el=document.scrollingElement||document.documentElement;var currentY=e.touches[0].clientY;var atTop=el.scrollTop<=0;var atBottom=el.scrollTop+el.clientHeight>=el.scrollHeight-1;if((atTop&&currentY>startY+4)||(atBottom&&currentY<startY-4)){e.preventDefault();}},{passive:false});window.addEventListener('pageshow',function(){window.scrollTo(0,window.scrollY||0);});}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: TELEGRAM_WEBVIEW_SCRIPT }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
