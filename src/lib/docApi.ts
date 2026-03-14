import { api } from '@/lib/api';
import type {
  LinkRes,
  DocFamily,
  PurchaseKind,
  ApiDocDetails,
  ApiVendorPaymentDetails,
} from '@/types/docs';

export function resolveDocFamily(type: string): DocFamily {
  const t = (type || '').toLowerCase();
  if (t.includes('purchase')) return 'purchase';
  if (t.includes('sale') || t.includes('sales')) return 'sale';
  if (t.includes('payment')) return 'payment';
  return 'unknown';
}

export function resolvePurchaseKind(type: string): PurchaseKind {
  const t = (type || '').toLowerCase();
  if (t.includes('receipt')) return 'receipts';
  if (t.includes('order')) return 'orders';
  return 'invoices';
}

export async function resolveLink(linkId: string): Promise<LinkRes | null> {
  try {
    return await api<LinkRes>(`/api/bot/resolve/${encodeURIComponent(linkId)}`, {
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}

export async function fetchPurchaseDoc(
  kind: PurchaseKind,
  docEntry: number,
): Promise<ApiDocDetails | null> {
  try {
    return await api<ApiDocDetails>(`/api/purchases/${kind}/${docEntry}`, {
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}

export async function fetchSaleDoc(docEntry: number): Promise<ApiDocDetails | null> {
  try {
    return await api<ApiDocDetails>(`/api/invoices/${docEntry}`, {
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}

export async function fetchPaymentDoc(docEntry: number): Promise<ApiVendorPaymentDetails | null> {
  try {
    return await api<ApiVendorPaymentDetails>(`/api/vendors/payments/${docEntry}`, {
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}
