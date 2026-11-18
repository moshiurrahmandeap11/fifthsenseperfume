"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  IBulkStatusPayload,
  IBulkStatusResponse,
  ICheckoutPayload,
  IIncompleteOrder,
  IIncompleteOrderPayload,
  IIncompleteOrderQueryParams,
  IOrder,
  IOrderQueryParams,
  IPublicOrderTrackingParams,
  IPublicTrackingResult,
  IScanVerifyPackPayload,
  IScanVerifyPackResponse,
  IUpdateOrderPayload,
  IUpdateOrderStatusPayload,
} from "@/types/order.types";

/**
 * Filter and serialize query params by eliminating undefined/null/empty values
 */
const buildQueryParams = (
  params?: Record<string, any>
): Record<string, unknown> => {
  const cleanParams: Record<string, unknown> = {};
  if (!params) return cleanParams;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      cleanParams[key] = value;
    }
  });

  return cleanParams;
};

/**
 * 1-Page Express Checkout
 * Atomically validates stock, calculates delivery fee by zone, applies coupon,
 * and creates order with Meta CAPI purchase tracking payload
 */
export const checkoutOrder = async (
  payload: ICheckoutPayload
): Promise<ApiResponse<IOrder>> => {
  try {
    const res = await httpClient.post<IOrder>("/orders/checkout", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to place order";
    throw new Error(message);
  }
};

/**
 * Incomplete / Abandoned Cart Capture
 * Silently captures customer phone number & selected shoe variants before full checkout submit
 */
export const incompleteCapture = async (
  payload: IIncompleteOrderPayload
): Promise<ApiResponse<IIncompleteOrder>> => {
  try {
    const res = await httpClient.post<IIncompleteOrder>(
      "/orders/incomplete-capture",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to capture incomplete order";
    throw new Error(message);
  }
};

/**
 * Public Order Tracking (For guest buyers without logging in)
 * Lookup by Order Number + Customer Phone
 */
export const trackPublicOrder = async (
  params: IPublicOrderTrackingParams
): Promise<ApiResponse<IPublicTrackingResult>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IPublicTrackingResult>(
      "/orders/track-public",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Order tracking details not found";
    throw new Error(message);
  }
};

/**
 * Call Center: Fetch abandoned / incomplete orders with phone numbers for outbound recovery calls
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const getIncompleteOrders = async (
  params?: IIncompleteOrderQueryParams
): Promise<ApiResponse<IIncompleteOrder[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IIncompleteOrder[]>(
      "/orders/incomplete",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch incomplete orders";
    throw new Error(message);
  }
};

/**
 * Call Center: Convert recovered abandoned cart into an active confirmed order
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const convertIncompleteOrder = async (
  id: string,
  payload: ICheckoutPayload
): Promise<ApiResponse<IOrder>> => {
  try {
    const res = await httpClient.post<IOrder>(
      `/orders/incomplete/${id}/convert`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to convert incomplete order";
    throw new Error(message);
  }
};

/**
 * CRM / Operations: Get paginated list of all orders with filters
 * (Order Number, Phone, Status, Payment Status, Delivery Zone, Date Range)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR, INVENTORY_STAFF, ACCOUNTANT
 */
export const getAllOrders = async (
  params?: IOrderQueryParams
): Promise<ApiResponse<IOrder[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IOrder[]>("/orders", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch orders";
    throw new Error(message);
  }
};

/**
 * Create Manual Order (For phone call, WhatsApp or social media sales)
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const createManualOrder = async (
  payload: ICheckoutPayload
): Promise<ApiResponse<IOrder>> => {
  try {
    const res = await httpClient.post<IOrder>("/orders", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create manual order";
    throw new Error(message);
  }
};

/**
 * Get detailed order view by ID or Order Number
 * (Includes items, shipment tracking, payment records, and status timeline)
 */
export const getOrderById = async (
  idOrOrderNumber: string
): Promise<ApiResponse<IOrder>> => {
  try {
    const res = await httpClient.get<IOrder>(
      `/orders/${encodeURIComponent(idOrOrderNumber)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch order details";
    throw new Error(message);
  }
};

/**
 * Update order items or customer delivery information
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const updateOrder = async (
  id: string,
  payload: IUpdateOrderPayload
): Promise<ApiResponse<IOrder>> => {
  try {
    const res = await httpClient.put<IOrder>(`/orders/${id}`, payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update order";
    throw new Error(message);
  }
};

/**
 * Update single order status (e.g. PENDING -> CONFIRMED, or CANCELLED)
 * Automatically appends status history with moderator ID and note
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const updateOrderStatus = async (
  id: string,
  payload: IUpdateOrderStatusPayload
): Promise<ApiResponse<IOrder>> => {
  try {
    const res = await httpClient.put<IOrder>(`/orders/${id}/status`, payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update order status";
    throw new Error(message);
  }
};

/**
 * Bulk status update for multiple orders (e.g., Confirm 20 orders at once)
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const bulkStatusUpdate = async (
  payload: IBulkStatusPayload
): Promise<ApiResponse<IBulkStatusResponse>> => {
  try {
    const res = await httpClient.put<IBulkStatusResponse>(
      "/orders/bulk-status",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to execute bulk status update";
    throw new Error(message);
  }
};

/**
 * Scan-To-Pack Warehouse Verification
 * Verifies that the scanned barcode on the physical shoe box matches the order items before packing
 * Allowed: SUPER_ADMIN, ADMIN, INVENTORY_STAFF
 */
export const scanVerifyPack = async (
  payload: IScanVerifyPackPayload
): Promise<ApiResponse<IScanVerifyPackResponse>> => {
  try {
    const res = await httpClient.post<IScanVerifyPackResponse>(
      "/orders/scan-verify-pack",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Barcode verification failed";
    throw new Error(message);
  }
};
