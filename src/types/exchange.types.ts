export type ExchangeType =
  | "SIZE_EXCHANGE"
  | "DEFECT_EXCHANGE"
  | "RETURN_REFUND"
  | "WARRANTY_CLAIM";

export type ExchangeStatus =
  | "PENDING"
  | "APPROVED"
  | "REPLACEMENT_DISPATCHED"
  | "COMPLETED"
  | "REJECTED";

export type ReturnQcStatus =
  | "AWAITING_RETURN"
  | "RECEIVED_PENDING_QC"
  | "QC_PASSED_RESTOCKED"
  | "QC_FAILED_DAMAGED";

export interface ICreateExchangeRequestPayload {
  orderId: string;
  orderItemId: string;
  oldVariantId: string;
  newVariantId?: string;
  type?: ExchangeType;
  reason: string;
  customerImages?: string[];
}

export interface IExchangeStatusDecisionPayload {
  status: ExchangeStatus;
  exchangeDeliveryFee?: number;
  isBrandBearingCost?: boolean;
  rejectionReason?: string;
  adminNote?: string;
  courierNote?: string;
}

export interface IExchangeQcDecisionPayload {
  decision: ReturnQcStatus;
  receivedCondition?: string;
  note?: string;
}

export interface IExchangeOrderInfo {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  district?: string;
  division?: string;
  status: string;
  totalAmount: number;
}

export interface IExchangeOrderItemInfo {
  id: string;
  productName: string;
  styleCode: string;
  colorName: string;
  size: string;
  sku: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IExchangeVariantDetails {
  id: string;
  size: string;
  sku: string;
  stockQuantity: number;
  product?: {
    id: string;
    name: string;
    styleCode: string;
    basePrice: number;
  };
  productColor?: {
    colorName: string;
    images: string[];
  };
}

export interface IExchangeRequest {
  id: string;
  exchangeNumber: string;

  orderId: string;
  orderItemId: string;

  type: ExchangeType;

  oldVariantId: string;
  newVariantId?: string | null;

  reason: string;
  customerImages: string[];
  adminNote?: string | null;

  status: ExchangeStatus;
  returnQcStatus: ReturnQcStatus;

  replacementOrderId?: string | null;
  exchangeDeliveryFee: number;

  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  order?: IExchangeOrderInfo;
  orderItem?: IExchangeOrderItemInfo;
  oldVariant?: IExchangeVariantDetails;
  newVariant?: IExchangeVariantDetails | null;
  replacementOrder?: Record<string, unknown> | null;
}

export interface IExchangeQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: ExchangeStatus;
  type?: ExchangeType;
  returnQcStatus?: ReturnQcStatus;
  orderId?: string;
}

export interface IPendingQcQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  returnQcStatus?: ReturnQcStatus;
  status?: ExchangeStatus;
  type?: ExchangeType;
}

