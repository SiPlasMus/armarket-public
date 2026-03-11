import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages for client components
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <div className="flex min-h-screen flex-col bg-surface">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
