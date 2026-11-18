import { DeliveryZone } from "./user.types";

export type OrderStatus =
  | "PENDING"
  | "ON_HOLD"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "PARTIAL_DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "EXCHANGE_REQUESTED"
  | "EXCHANGED";

export type OrderSource =
  | "WEBSITE"
  | "AD_LANDING_PAGE"
  | "WHATSAPP"
  | "MESSENGER"
  | "PHONE_CALL"
  | "EXCHANGE_REPLACEMENT";

export type IncompleteOrderStatus =
  | "ABANDONED"
  | "CALLED_NO_RESPONSE"
  | "CONVERTED"
  | "DISCARDED";

export type PaymentMethod =
  | "COD"
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "SSLCOMMERZ"
  | "AAMARPAY";

export type PaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  styleCode: string;
  colorName: string;
  size: string;
  sku: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  unitCostPrice: number;
  totalPrice: number;
  variant?: {
    id: string;
    size: string;
    sku: string;
    stockQuantity: number;
  };
  createdAt: string;
}

export interface IOrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  comment?: string | null;
  changedById?: string | null;
  changedBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
  createdAt: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId?: string | null;

  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  division: string;
  district: string;
  thana: string;
  deliveryZone: DeliveryZone;

  subtotal: number;
  discountAmount: number;
  couponId?: string | null;
  couponCode?: string | null;
  shippingCharge: number;
  totalAmount: number;
  advancePaidAmount: number;
  codCollectibleAmount: number;
  totalCostPrice: number;

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  source: OrderSource;

  confirmedById?: string | null;
  confirmedBy?: { id: string; name: string } | null;
  confirmedAt?: string | null;
  packedById?: string | null;
  packedBy?: { id: string; name: string } | null;
  packedAt?: string | null;
  isBarcodeScanned: boolean;

  customerNote?: string | null;
  adminNote?: string | null;
  cancelReason?: string | null;

  isCapiPurchaseSent: boolean;
  fbp?: string | null;
  fbc?: string | null;
  clientIp?: string | null;
  clientUserAgent?: string | null;

  parentOrderId?: string | null;
  items: IOrderItem[];
  statusHistory?: IOrderStatusHistory[];
  shipment?: Record<string, unknown> | null;
  payments?: Array<Record<string, unknown>>;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface IIncompleteOrder {
  id: string;
  sessionKey?: string | null;
  customerName?: string | null;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress?: string | null;
  division?: string | null;
  district?: string | null;
  thana?: string | null;
  itemsJson: unknown;
  totalAmount: number;
  source: OrderSource;
  status: IncompleteOrderStatus;
  convertedOrderId?: string | null;
  adminNote?: string | null;
  handledById?: string | null;
  handledBy?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICheckoutItemInput {
  variantId: string;
  quantity: number;
}

export interface ICheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  division: string;
  district: string;
  thana: string;
  deliveryZone?: DeliveryZone;
  paymentMethod?: PaymentMethod;
  source?: OrderSource;
  couponCode?: string;
  customerNote?: string;
  items: ICheckoutItemInput[];
  fbp?: string;
  fbc?: string;
}

export interface IIncompleteOrderPayload {
  sessionKey?: string;
  customerName?: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress?: string;
  division?: string;
  district?: string;
  thana?: string;
  itemsJson: unknown;
  totalAmount?: number;
  source?: OrderSource;
}

export interface IUpdateOrderStatusPayload {
  status: OrderStatus;
  note?: string;
  tag?: string;
  cancelReason?: string;
}

export interface IUpdateOrderPayload {
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: string;
  division?: string;
  district?: string;
  thana?: string;
  adminNote?: string;
  items?: Array<{
    variantId: string;
    quantity: number;
    unitPrice?: number;
  }>;
}

export interface IBulkStatusPayload {
  orderIds: string[];
  newStatus: OrderStatus;
  note?: string;
}

export interface IBulkStatusResponse {
  totalRequested: number;
  totalUpdated: number;
  newStatus: OrderStatus;
}

export interface IScanVerifyPackPayload {
  orderId: string;
  scannedBarcode: string;
}

export interface IScanVerifyPackResponse {
  success: boolean;
  message: string;
  orderId: string;
  isBarcodeScanned: boolean;
  packedAt?: string;
}

export interface IOrderQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  deliveryZone?: DeliveryZone;
  source?: OrderSource;
  isBarcodeScanned?: boolean | string;
  startDate?: string;
  endDate?: string;
}

export interface IIncompleteOrderQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: IncompleteOrderStatus;
}

export interface IPublicOrderTrackingParams {
  orderNumber: string;
  phone: string;
}

export interface IPublicTrackingResult {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  deliveryZone: DeliveryZone;
  shippingAddress: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    productName: string;
    styleCode: string;
    colorName: string;
    size: string;
    imageUrl: string;
    quantity: number;
    totalPrice: number;
  }>;
  shipment?: Record<string, unknown> | null;
}

