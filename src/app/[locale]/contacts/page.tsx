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
  const isRu = locale === 'ru';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative mb-12 overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(145deg,color-mix(in_srgb,var(--brand)_8%,var(--surface))_0%,var(--surface-elevated)_58%,var(--surface-alt)_100%)] p-6 shadow-theme-sm sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl" />
        </div>
        <div className="relative">
          <div className="mb-3 inline-flex rounded-full border border-brand/20 bg-brand/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Contact hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-1 text-foreground-muted">{t('subtitle')}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground-muted">{t('phone')}</div>
              <div className="mt-2 text-base font-semibold text-foreground">+998 90 123 45 67</div>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground-muted">{t('telegram')}</div>
              <div className="mt-2 text-base font-semibold text-foreground">@armarket_uz</div>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground-muted">{t('hours')}</div>
              <div className="mt-2 text-base font-semibold text-foreground">{t('hoursValue')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        <div>
          <ContactInfo />
        </div>

        <div className="bg-surface-elevated border border-border rounded-3xl p-6 sm:p-8 shadow-theme-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">{t('form.title')}</h2>
          <ContactForm />
        </div>
      </div>

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

      <PartnersCarousel />

      <div className="mt-12 rounded-[2rem] border border-border bg-slate-950 px-6 py-8 text-white shadow-theme-lg sm:px-8">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.24em] text-white/45">
            {isRu ? 'Response line' : 'Response line'}
          </div>
          <h2 className="mt-3 text-2xl font-semibold">
            {isRu ? 'Оставьте задачу и переходите к следующей.' : 'Savol qoldiring va keyingi ishga o‘ting.'}
          </h2>
          <p className="mt-2 text-white/65">
            {isRu
              ? 'Телефон, Telegram и форма собраны в одном потоке, чтобы пользователь не искал точку входа.'
              : 'Telefon, Telegram va forma bitta oqimga yig‘ildi, foydalanuvchi kirish nuqtasini qidirmaydi.'}
          </p>
        </div>
      </div>
    </div>
  );
}
