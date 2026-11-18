import { ICourierShipment } from "./courier.types";
import { PaymentMethod, PaymentStatus } from "./order.types";

export type PaymentTransactionType =
  | "ADVANCE_DELIVERY_FEE"
  | "FULL_PREPAID"
  | "COD_COLLECTION"
  | "REFUND";

export type ExpenseCategory =
  | "META_ADS"
  | "TIKTOK_ADS"
  | "GOOGLE_ADS"
  | "PACKAGING"
  | "COURIER_LOSS"
  | "FACTORY_PAYMENT"
  | "SALARY"
  | "OTHER";

export interface IPaymentOrderSnapshot {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  advancePaidAmount: number;
  codCollectibleAmount: number;
  paymentStatus: PaymentStatus;
}

export interface IPaymentTransaction {
  id: string;
  orderId: string;
  method: PaymentMethod;
  transactionType: PaymentTransactionType;
  amount: number;
  transactionId?: string | null;
  senderPhone?: string | null;
  gatewayResponse?: unknown;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  order?: IPaymentOrderSnapshot;
}

export interface IInitiatePaymentPayload {
  orderId: string;
  method: PaymentMethod;
  transactionType: PaymentTransactionType;
  callbackUrl?: string;
}

export interface IInitiatePaymentResponse {
  paymentId: string;
  orderId: string;
  orderNumber: string;
  transactionId: string;
  amount: number;
  method: PaymentMethod;
  transactionType: PaymentTransactionType;
  gatewayUrl: string;
  redirectUrl: string;
}

export interface ITransactionQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  method?: PaymentMethod;
  transactionType?: PaymentTransactionType;
  status?: PaymentStatus;
  orderId?: string;
}

export interface ITransactionsData {
  transactions: IPaymentTransaction[];
  totalPaidRevenue: number;
}

export interface ICourierReconciliationSummary {
  totalPendingCod: number;
  totalDeliveryChargesDeducted: number;
  totalCodFeesDeducted: number;
  totalNetPayoutDisbursed: number;
  pendingReconciliationCount: number;
}

export interface ICourierReconciliationQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  provider?: string;
  courierStatus?: string;
  isPayoutReconciled?: boolean | string;
}

export interface ICourierReconciliationData {
  summary: ICourierReconciliationSummary;
  shipments: ICourierShipment[];
}

export interface IMarkReconciledPayload {
  shipmentIds: string[];
  note?: string;
}

export interface IMarkReconciledResponse {
  success: boolean;
  reconciledCount: number;
  message: string;
}

export interface IDailyExpense {
  id: string;
  date: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  note?: string | null;
  createdById?: string | null;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateExpensePayload {
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  note?: string;
}

export interface IUpdateExpensePayload {
  category?: ExpenseCategory;
  title?: string;
  amount?: number;
  date?: string;
  note?: string;
}

export interface IExpenseQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: ExpenseCategory;
  createdById?: string;
}

export interface IExpensesData {
  expenses: IDailyExpense[];
  totalExpenseAmount: number;
}

