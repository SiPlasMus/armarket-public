import {
  resolveLink,
  resolveDocFamily,
  resolvePurchaseKind,
  fetchPurchaseDoc,
  fetchSaleDoc,
  fetchPaymentDoc,
} from '@/lib/docApi';
import DocViewer from './DocViewer';
import type { Locale } from '@/types';

export default async function LinkPage({
  params,
}: {
  params: Promise<{ locale: string; linkId: string }>;
}) {
  const { locale, linkId } = await params;

  const link = await resolveLink(linkId);

  if (!link) {
    return (
      <DocViewer
        family="unknown"
        data={null}
        locale={locale as Locale}
        linkType=""
        docEntry={0}
        cardCode=""
        resolveError
      />
    );
  }

  const family = resolveDocFamily(link.type);
  const purchaseKind = family === 'purchase' ? resolvePurchaseKind(link.type) : undefined;

  let data = null;
  if (family === 'purchase' && purchaseKind) {
    data = await fetchPurchaseDoc(purchaseKind, link.docEntry);
  } else if (family === 'sale') {
    data = await fetchSaleDoc(link.docEntry);
  } else if (family === 'payment') {
    data = await fetchPaymentDoc(link.docEntry);
  }

  return (
    <DocViewer
      family={family}
      purchaseKind={purchaseKind}
      data={data}
      locale={locale as Locale}
      linkType={link.type}
      docEntry={link.docEntry}
      cardCode={link.cardCode}
    />
  );
}
