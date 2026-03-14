import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Locale } from '@/types';
import type {
  DocFamily,
  PurchaseKind,
  ApiDocDetails,
  ApiDocLine,
  ApiDocPayment,
  ApiVendorPaymentDetails,
  ApiVendorPaymentApplied,
} from '@/types/docs';

// ─── Labels ─────────────────────────────────────────────────────────────────

type Labels = {
  docTitle: Record<string, string>;
  counterparty: { purchase: string; sale: string; payment: string };
  docNum: string;
  date: string;
  dueDate: string;
  total: string;
  totalLocal: string;
  paid: string;
  remaining: string;
  discount: string;
  ref: string;
  comments: string;
  open: string;
  closed: string;
  canceled: string;
  lines: string;
  payments: string;
  applied: string;
  noLines: string;
  noPayments: string;
  noApplied: string;
  item: string;
  qty: string;
  lineTotal: string;
  whs: string;
  payType: { cash: string; card: string; transfer: string; other: string };
  cashAcct: string;
  targetDoc: string;
  notFound: string;
  invalidLink: string;
};

const L: Record<string, Labels> = {
  uz: {
    docTitle: {
      purchase_orders:   'Xarid buyurtmasi',
      purchase_receipts: 'Xarid kvitansiyasi',
      purchase_invoices: 'Xarid fakturasi',
      sale:              'Sotuv',
      payment:           "To'lov",
      unknown:           'Hujjat',
    },
    counterparty: { purchase: 'Yetkazib beruvchi', sale: 'Xaridor', payment: 'Kontragent' },
    docNum:     'Hujjat raqami',
    date:       'Sana',
    dueDate:    "To'lov muddati",
    total:      'Jami',
    totalLocal: 'Jami (mahalliy)',
    paid:       "To'langan",
    remaining:  'Qoldiq',
    discount:   'Chegirma',
    ref:        'Ref raqami',
    comments:   'Izoh',
    open:       'Ochiq',
    closed:     'Yopiq',
    canceled:   'Bekor qilingan',
    lines:      'Qatorlar',
    payments:   "To'lovlar",
    applied:    "Qo'llangan hujjatlar",
    noLines:    "Qatorlar yo'q",
    noPayments: "To'lovlar yo'q",
    noApplied:  "Qo'llangan hujjatlar yo'q",
    item:       'Mahsulot',
    qty:        'Miqdor',
    lineTotal:  'Summa',
    whs:        'Ombor',
    payType:    { cash: 'Naqd', card: 'Karta', transfer: "O'tkazma", other: 'Boshqa' },
    cashAcct:   'Kassa hisobi',
    targetDoc:  'Hujjat',
    notFound:   'Hujjat topilmadi',
    invalidLink: "Noto'g'ri havola yoki muddati tugagan",
  },
  ru: {
    docTitle: {
      purchase_orders:   'Заказ на закупку',
      purchase_receipts: 'Поступление',
      purchase_invoices: 'Счёт-фактура закупки',
      sale:              'Продажа',
      payment:           'Оплата',
      unknown:           'Документ',
    },
    counterparty: { purchase: 'Поставщик', sale: 'Покупатель', payment: 'Контрагент' },
    docNum:     'Номер документа',
    date:       'Дата',
    dueDate:    'Срок оплаты',
    total:      'Итого',
    totalLocal: 'Итого (местная)',
    paid:       'Оплачено',
    remaining:  'Остаток',
    discount:   'Скидка',
    ref:        'Реф. номер',
    comments:   'Комментарий',
    open:       'Открыт',
    closed:     'Закрыт',
    canceled:   'Отменён',
    lines:      'Строки',
    payments:   'Платежи',
    applied:    'Применённые документы',
    noLines:    'Строк нет',
    noPayments: 'Платежей нет',
    noApplied:  'Применённых документов нет',
    item:       'Товар',
    qty:        'Кол-во',
    lineTotal:  'Сумма',
    whs:        'Склад',
    payType:    { cash: 'Наличные', card: 'Карта', transfer: 'Перевод', other: 'Другое' },
    cashAcct:   'Кассовый счёт',
    targetDoc:  'Документ',
    notFound:   'Документ не найден',
    invalidLink: 'Неверная ссылка или срок действия истёк',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtAmt(amount: number, currency: string, locale: Locale): string {
  const n = new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 0 }).format(amount);
  if (currency === 'UZS') return `${n} ${locale === 'ru' ? 'сум' : "so'm"}`;
  return `${n} ${currency}`;
}

/** Returns [primary, secondary | null]. Primary is local (UZS) if available. */
function docAmounts(
  total: number,
  totalFC: number | null | undefined,
  currency: string,
  locale: Locale,
): [string, string | null] {
  const fc = Number(totalFC ?? 0);
  if (fc > 0 && currency !== 'UZS') {
    return [fmtAmt(fc, 'UZS', locale), fmtAmt(total, currency, locale)];
  }
  return [fmtAmt(total, currency, locale), null];
}

function shortDate(iso: string, locale: Locale): string {
  if (!iso) return '—';
  try {
    return formatDate(iso, locale);
  } catch {
    return iso.slice(0, 10);
  }
}

function payTypeLabel(type: string, l: Labels): string {
  const k = (type || '').toLowerCase();
  if (k === 'cash') return l.payType.cash;
  if (k === 'card') return l.payType.card;
  if (k === 'transfer') return l.payType.transfer;
  return l.payType.other;
}

function docTitleKey(family: DocFamily, purchaseKind: PurchaseKind | undefined): string {
  if (family === 'purchase' && purchaseKind) return `purchase_${purchaseKind}`;
  if (family === 'sale') return 'sale';
  if (family === 'payment') return 'payment';
  return 'unknown';
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-foreground-muted">{label}</div>
      <div className="font-medium text-sm mt-0.5">{value}</div>
    </div>
  );
}

function AmountBlock({
  label,
  primary,
  secondary,
  highlight,
}: {
  label: string;
  primary: string;
  secondary?: string | null;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-xs text-foreground-muted">{label}</div>
      <div className={`font-semibold mt-0.5 ${highlight ? 'text-brand' : ''}`}>{primary}</div>
      {secondary && <div className="text-xs text-foreground-muted mt-0.5">{secondary}</div>}
    </div>
  );
}

function LinesTable({ lines, l }: { lines: ApiDocLine[]; l: Labels }) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        {l.lines} ({lines.length})
      </div>
      {lines.length === 0 ? (
        <div className="px-4 py-4 text-sm text-foreground-muted">{l.noLines}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-foreground-muted">
                <th className="px-4 py-2 text-left font-medium">{l.item}</th>
                <th className="px-4 py-2 text-right font-medium w-20">{l.qty}</th>
                <th className="px-4 py-2 text-right font-medium w-36">{l.lineTotal}</th>
                <th className="px-4 py-2 text-right font-medium w-20">{l.whs}</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.LineNum} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-foreground-muted">{line.ItemCode}</div>
                    <div>{line.Dscription}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{line.Quantity}</td>
                  <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                    {Number(line.LineTotal > 0 ? line.LineTotal : line.LineTotalFC).toLocaleString('uz-UZ')}{' '}
                    <span className="text-foreground-muted text-xs">{line.Currency || ''}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground-muted text-xs">
                    {line.WhsCode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function PaymentsTable({
  payments,
  docCur,
  locale,
  l,
}: {
  payments: ApiDocPayment[];
  docCur: string;
  locale: Locale;
  l: Labels;
}) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-4 py-3 border-b border-border font-semibold text-sm flex items-center justify-between gap-3">
        <span>{l.payments} ({payments.length})</span>
        {payments.length > 0 && (
          <span className="text-xs text-foreground-muted tabular-nums">
            {fmtAmt(
              payments.reduce((s, p) => s + Number(p.SumApplied ?? 0), 0),
              docCur,
              locale,
            )}
          </span>
        )}
      </div>
      {payments.length === 0 ? (
        <div className="px-4 py-4 text-sm text-foreground-muted">{l.noPayments}</div>
      ) : (
        <div className="divide-y divide-border">
          {payments.map((p) => {
            const [primary, secondary] = docAmounts(
              p.SumApplied,
              p.SumAppliedFC,
              p.Currency || docCur,
              locale,
            );
            return (
              <div key={p.DocEntry} className="px-4 py-3 text-sm flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium">
                    {payTypeLabel(p.PaymentType, l)} · #{p.DocNum}
                    {p.Canceled && (
                      <Badge variant="error" className="ml-2">{l.canceled}</Badge>
                    )}
                  </div>
                  <div className="text-xs text-foreground-muted mt-0.5">
                    {shortDate(p.DocDate, locale)}
                  </div>
                  {(p.CashAccount || p.TransferAccount) && (
                    <div className="text-xs text-foreground-muted mt-1 font-mono">
                      {l.cashAcct}: {p.CashAccount || p.TransferAccount}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0 tabular-nums">
                  <div className="font-semibold">{primary}</div>
                  {secondary && <div className="text-xs text-foreground-muted">{secondary}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function AppliedTable({
  applied,
  locale,
  l,
}: {
  applied: ApiVendorPaymentApplied[];
  locale: Locale;
  l: Labels;
}) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        {l.applied} ({applied.length})
      </div>
      {applied.length === 0 ? (
        <div className="px-4 py-4 text-sm text-foreground-muted">{l.noApplied}</div>
      ) : (
        <div className="divide-y divide-border">
          {applied.map((a) => {
            const [primary, secondary] = docAmounts(a.SumApplied, a.SumAppliedFC, a.TargetCurrency, locale);
            return (
              <div key={a.LineId} className="px-4 py-3 text-sm flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{l.targetDoc} #{a.TargetDocNum}</div>
                  <div className="text-xs text-foreground-muted mt-0.5">
                    {shortDate(a.TargetDocDate, locale)}
                  </div>
                </div>
                <div className="text-right shrink-0 tabular-nums">
                  <div className="font-semibold">{primary}</div>
                  {secondary && <div className="text-xs text-foreground-muted">{secondary}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ─── Purchase / Sale view ─────────────────────────────────────────────────────

function PurchaseSaleView({
  family,
  purchaseKind,
  data,
  locale,
  l,
}: {
  family: 'purchase' | 'sale';
  purchaseKind?: PurchaseKind;
  data: ApiDocDetails;
  locale: Locale;
  l: Labels;
}) {
  const h = data.Header;
  const lines = data.Lines ?? [];
  const payments = data.Payments ?? [];
  const showPayments = purchaseKind === 'invoices' || family === 'sale';

  const totalUsd = Number(h.DocTotal ?? 0);
  const totalFC  = Number(h.DocTotalFC ?? 0);
  const paidUsd  = Number(h.PaidToDate ?? 0);
  const paidFC   = Number(h.PaidFC ?? h.PaidToDateFC ?? 0);

  const [totalPrimary, totalSecondary] = docAmounts(totalUsd, totalFC, h.DocCur, locale);

  const paidDisplay  = paidFC > 0 ? paidFC : paidUsd;
  const totalDisplay = totalFC > 0 ? totalFC : totalUsd;
  const remDisplay   = Math.max(0, totalDisplay - paidDisplay);
  const remCur       = paidFC > 0 ? 'UZS' : h.DocCur;

  return (
    <div className="space-y-4">
      {/* Header card */}
      <Card>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="text-xs text-foreground-muted mb-1">
              {l.docNum} #{h.DocNum}
            </div>
            <div className="font-semibold text-lg leading-tight">{h.CardName}</div>
            <div className="text-sm text-foreground-muted font-mono">{h.CardCode}</div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {h.Canceled ? (
              <Badge variant="error">{l.canceled}</Badge>
            ) : h.DocStatus === 'O' ? (
              <Badge variant="success">{l.open}</Badge>
            ) : (
              <Badge variant="muted">{l.closed}</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoRow label={l.date} value={shortDate(h.DocDate, locale)} />
          <InfoRow label={l.dueDate} value={shortDate(h.DocDueDate, locale)} />
          {h.NumAtCard && <InfoRow label={l.ref} value={h.NumAtCard} />}
          {h.DocDiscountPercent ? (
            <InfoRow label={l.discount} value={`${h.DocDiscountPercent}%`} />
          ) : null}
        </div>

        {h.Comments && (
          <div className="mt-3 pt-3 border-t border-border text-sm text-foreground-muted">
            {h.Comments}
          </div>
        )}
      </Card>

      {/* Totals */}
      <div className={`grid gap-3 ${showPayments ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <AmountBlock
          label={l.total}
          primary={totalPrimary}
          secondary={totalSecondary}
        />
        {showPayments && (
          <>
            <AmountBlock
              label={l.paid}
              primary={fmtAmt(paidDisplay, paidFC > 0 ? 'UZS' : h.DocCur, locale)}
            />
            <AmountBlock
              label={l.remaining}
              primary={fmtAmt(remDisplay, remCur, locale)}
              highlight={remDisplay > 0}
            />
          </>
        )}
      </div>

      {/* Lines */}
      <LinesTable lines={lines} l={l} />

      {/* Payments */}
      {showPayments && (
        <PaymentsTable payments={payments} docCur={h.DocCur} locale={locale} l={l} />
      )}
    </div>
  );
}

// ─── Payment view ─────────────────────────────────────────────────────────────

function PaymentView({
  data,
  locale,
  l,
}: {
  data: ApiVendorPaymentDetails;
  locale: Locale;
  l: Labels;
}) {
  const h = data.Header;
  const applied = data.Applied ?? [];

  const [totalPrimary, totalSecondary] = docAmounts(
    Number(h.DocTotal ?? 0),
    h.DocTotalFC,
    h.DocCurr,
    locale,
  );

  return (
    <div className="space-y-4">
      {/* Header card */}
      <Card>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="text-xs text-foreground-muted mb-1">
              {l.docNum} #{h.DocNum}
            </div>
            <div className="font-semibold text-lg leading-tight">{h.CardName}</div>
            <div className="text-sm text-foreground-muted font-mono">{h.CardCode}</div>
          </div>
          {h.Canceled && <Badge variant="error">{l.canceled}</Badge>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoRow label={l.date} value={shortDate(h.DocDate, locale)} />
          {h.CashAccount && (
            <InfoRow label={l.cashAcct} value={<span className="font-mono">{h.CashAccount}</span>} />
          )}
        </div>
      </Card>

      {/* Total */}
      <AmountBlock label={l.total} primary={totalPrimary} secondary={totalSecondary} />

      {/* Applied docs */}
      <AppliedTable applied={applied} locale={locale} l={l} />
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorView({ l }: { l: Labels }) {
  return (
    <Card className="text-center py-12">
      <div className="text-4xl mb-4">🔗</div>
      <div className="font-semibold text-lg mb-2">{l.notFound}</div>
      <div className="text-sm text-foreground-muted">{l.invalidLink}</div>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DocViewerProps {
  family: DocFamily;
  purchaseKind?: PurchaseKind;
  data: ApiDocDetails | ApiVendorPaymentDetails | null;
  locale: Locale;
  linkType: string;
  docEntry: number;
  cardCode: string;
  resolveError?: boolean;
}

export default function DocViewer({
  family,
  purchaseKind,
  data,
  locale,
  resolveError,
}: DocViewerProps) {
  const l = L[locale] ?? L.uz;
  const titleKey = docTitleKey(family, purchaseKind);
  const title = l.docTitle[titleKey];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      {/* Page title */}
      <h1 className="text-xl font-bold">{title}</h1>

      {resolveError || !data ? (
        <ErrorView l={l} />
      ) : family === 'payment' ? (
        <PaymentView
          data={data as ApiVendorPaymentDetails}
          locale={locale}
          l={l}
        />
      ) : (family === 'purchase' || family === 'sale') ? (
        <PurchaseSaleView
          family={family}
          purchaseKind={purchaseKind}
          data={data as ApiDocDetails}
          locale={locale}
          l={l}
        />
      ) : (
        <ErrorView l={l} />
      )}
    </div>
  );
}
