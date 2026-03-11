'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'success' | 'error';

interface Field {
  name: string;
  phone: string;
  message: string;
}

const EMPTY: Field = { name: '', phone: '', message: '' };

export function ContactForm() {
  const t = useTranslations('contacts.form');

  const [fields, setFields]   = useState<Field>(EMPTY);
  const [status, setStatus]   = useState<Status>('idle');
  const [touched, setTouched] = useState<Partial<Record<keyof Field, boolean>>>({});

  const errors = {
    name:    fields.name.trim().length < 2,
    phone:   fields.phone.trim().length < 9,
    message: fields.message.trim().length < 5,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function change(key: keyof Field, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function blur(key: keyof Field) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, phone: true, message: true });
    if (hasErrors) return;

    setStatus('sending');
    // Simulate network delay — replace with real API call when backend is ready
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('success');
    setFields(EMPTY);
    setTouched({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <AnimatePresence mode="wait">
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-sm text-green-700 dark:text-green-400"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{t('success')}</span>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-700 dark:text-red-400"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{t('error')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">{t('name')}</label>
        <input
          type="text"
          value={fields.name}
          onChange={(e) => change('name', e.target.value)}
          onBlur={() => blur('name')}
          placeholder={t('namePlaceholder')}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-sm bg-surface-alt border transition-colors outline-none',
            'placeholder:text-foreground-muted text-foreground',
            'focus:border-brand focus:ring-2 focus:ring-brand/20',
            touched.name && errors.name ? 'border-red-500' : 'border-border',
          )}
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">{t('phone')}</label>
        <input
          type="tel"
          value={fields.phone}
          onChange={(e) => change('phone', e.target.value)}
          onBlur={() => blur('phone')}
          placeholder={t('phonePlaceholder')}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-sm bg-surface-alt border transition-colors outline-none',
            'placeholder:text-foreground-muted text-foreground',
            'focus:border-brand focus:ring-2 focus:ring-brand/20',
            touched.phone && errors.phone ? 'border-red-500' : 'border-border',
          )}
        />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">{t('message')}</label>
        <textarea
          rows={4}
          value={fields.message}
          onChange={(e) => change('message', e.target.value)}
          onBlur={() => blur('message')}
          placeholder={t('messagePlaceholder')}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-sm bg-surface-alt border transition-colors outline-none resize-none',
            'placeholder:text-foreground-muted text-foreground',
            'focus:border-brand focus:ring-2 focus:ring-brand/20',
            touched.message && errors.message ? 'border-red-500' : 'border-border',
          )}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={status === 'sending'}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? t('sending') : t('send')}
      </Button>
    </form>
  );
}
