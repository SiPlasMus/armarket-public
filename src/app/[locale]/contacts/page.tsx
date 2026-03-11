import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

interface ContactsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ru' ? 'Контакты' : 'Aloqa',
  };
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* TODO: ContactBlock + ContactForm + Map — implementation in pages phase */}
      <h1 className="text-2xl font-bold text-foreground">
        {locale === 'ru' ? 'Контакты' : 'Aloqa'}
      </h1>
    </div>
  );
}
