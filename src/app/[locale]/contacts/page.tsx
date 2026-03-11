import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContactInfo } from '@/components/sections/contacts/ContactInfo';
import { ContactForm } from '@/components/sections/contacts/ContactForm';
import { PartnersCarousel } from '@/components/sections/contacts/PartnersCarousel';

interface ContactsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contacts' });
  return { title: t('title') };
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contacts' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-foreground-muted mt-1">{t('subtitle')}</p>
      </div>

      {/* ── Info + Form ───────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">

        {/* Left: contact info + socials */}
        <div>
          <ContactInfo />
        </div>

        {/* Right: form */}
        <div className="bg-surface-elevated border border-border rounded-3xl p-6 sm:p-8 shadow-theme-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">{t('form.title')}</h2>
          <ContactForm />
        </div>
      </div>

      {/* ── Google Maps ───────────────────────────────────────────── */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground mb-4">{t('mapTitle')}</h2>
        <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-border shadow-theme-sm">
          <iframe
            src="https://maps.google.com/maps?q=37.23687,67.27920&z=16&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('mapTitle')}
          />
        </div>
      </div>

      {/* ── Partners carousel ─────────────────────────────────────── */}
      <PartnersCarousel />

    </div>
  );
}
