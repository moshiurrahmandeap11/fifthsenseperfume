import { FraudRiskLevel } from "./admin.types";
import { DeliveryZone } from "./user.types";

export type CourierProvider = "STEADFAST" | "PATHAO" | "REDX";

export interface IShippingZoneRule {
  id: string;
  zone: DeliveryZone;
  title: string;
  charge: number;
  freeShippingMinAmount?: number | null;
  estimatedDeliveryText: string;
  isActive: boolean;
  updatedAt: string;
}

export interface IShippingZoneUpdatePayload {
  title?: string;
  charge?: number;
  freeShippingMinAmount?: number | null;
  estimatedDeliveryText?: string;
  isActive?: boolean;
}

export interface IFraudCheckResult {
  phoneNumber: string;
  totalParcels: number;
  deliveredCount: number;
  returnedCount: number;
  successRate: number;
  riskLevel: FraudRiskLevel;
  isBlacklisted: boolean;
  blacklistReason?: string | null;
  courierBreakdown?: Record<string, unknown> | null;
  recommendation: "ACCEPT_COD" | "REQUIRE_ADVANCE_DELIVERY_FEE" | "REJECT_ORDER";
}

export interface ICourierBookPayload {
  orderIds: string[];
  courierProvider: CourierProvider;
  note?: string;
}

export interface IBookedShipmentResult {
  orderId: string;
  orderNumber: string;
  consignmentId: string;
  trackingCode: string;
  trackingUrl: string;
  courierProvider: CourierProvider;
  codCollectibleAmount: number;
  status: string;
}

export interface ICourierShipmentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  district?: string;
  status: string;
  totalAmount: number;
  codCollectibleAmount: number;
  paymentStatus: string;
}

export interface ICourierShipment {
  id: string;
  orderId: string;
  provider: CourierProvider;
  consignmentId?: string | null;
  trackingCode?: string | null;
  trackingUrl?: string | null;
  codCollectibleAmount: number;
  deliveryFee?: number | null;
  codFee?: number | null;
  netPayoutAmount?: number | null;
  courierStatus?: string | null;
  webhookPayloadJson?: unknown;
  isPayoutReconciled: boolean;
  reconciledAt?: string | null;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
  returnedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  order?: ICourierShipmentOrder;
}

export interface IShipmentQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  provider?: CourierProvider;
  courierStatus?: string;
  isPayoutReconciled?: boolean | string;
}

