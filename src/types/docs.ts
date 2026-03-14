// ─── Document viewer types ──────────────────────────────────────────────────

export type DocFamily = 'purchase' | 'sale' | 'payment' | 'unknown';
export type PurchaseKind = 'orders' | 'receipts' | 'invoices';

export type LinkRes = {
  type: string;
  docEntry: number;
  cardCode: string;
};

// ─── Purchase / Sale shared types ───────────────────────────────────────────

export type ApiDocHeader = {
  DocEntry: number;
  DocNum: number;
  CardCode: string;
  CardName: string;
  DocDate: string;
  DocDueDate: string;
  DocStatus: 'O' | 'C';
  Canceled: boolean;
  DocTotal: number;
  DocTotalFC?: number | null;
  DocCur: string;
  PaidToDate?: number | null;
  PaidFC?: number | null;
  PaidToDateFC?: number | null;
  DocDiscountPercent?: number | null;
  NumAtCard?: string | null;
  Comments?: string | null;
};

export type ApiDocLine = {
  LineNum: number;
  ItemCode: string;
  Dscription: string;
  Quantity: number;
  Price: number;
  LineTotal: number;
  LineTotalFC: number;
  WhsCode: string;
  Currency?: string | null;
};

export type ApiDocPayment = {
  DocEntry: number;
  DocNum: number;
  DocDate: string;
  SumApplied: number;
  SumAppliedFC?: number | null;
  Currency: string;
  PaymentType: 'cash' | 'card' | 'transfer' | string;
  CashAccount?: string | null;
  TransferAccount?: string | null;
  Canceled?: boolean;
};

export type ApiDocDetails = {
  Header: ApiDocHeader;
  Lines: ApiDocLine[];
  Payments?: ApiDocPayment[];
};

// ─── Vendor payment types ────────────────────────────────────────────────────

export type ApiVendorPaymentHeader = {
  DocEntry: number;
  DocNum: number;
  CardCode: string;
  CardName: string;
  DocDate: string;
  Canceled: boolean;
  DocTotal: number;
  DocTotalFC: number;
  DocCurr: string; // Note: DocCurr (not DocCur) from this endpoint
  CashAccount?: string | null;
  CashSum?: number | null;
  CashSumFC?: number | null;
};

export type ApiVendorPaymentApplied = {
  LineId: number;
  InvType: number;
  DocEntry: number;
  SumApplied: number;
  SumAppliedFC: number;
  TargetDocNum: number;
  TargetDocDate: string;
  TargetCurrency: string;
};

export type ApiVendorPaymentDetails = {
  Header: ApiVendorPaymentHeader;
  Applied: ApiVendorPaymentApplied[];
};
