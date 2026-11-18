"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  IBookedShipmentResult,
  ICourierBookPayload,
  ICourierShipment,
  IFraudCheckResult,
  IShipmentQueryParams,
  IShippingZoneRule,
  IShippingZoneUpdatePayload,
} from "@/types/courier.types";

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
 * Fetch live shipping zone rules, delivery charges & estimated times
 * (Inside Dhaka, Dhaka Sub-area, Outside Dhaka)
 * Publicly available for Storefront Checkout calculation
 */
export const getShippingZones = async (): Promise<
  ApiResponse<IShippingZoneRule[]>
> => {
  try {
    const res = await httpClient.get<IShippingZoneRule[]>(
      "/courier/shipping-zones"
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch shipping zones";
    throw new Error(message);
  }
};

/**
 * Update shipping zone rules (Delivery charge, free shipping minimum threshold, estimated delivery text)
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const updateShippingZone = async (
  id: string,
  payload: IShippingZoneUpdatePayload
): Promise<ApiResponse<IShippingZoneRule>> => {
  try {
    const res = await httpClient.put<IShippingZoneRule>(
      `/courier/shipping-zones/${id}`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update shipping zone rule";
    throw new Error(message);
  }
};

/**
 * Fraud Shield & Courier Delivery Ratio Check
 * Evaluates courier delivery success rate, return frequency, and blacklist status across Steadfast/Pathao
 * Recommends: ACCEPT_COD, REQUIRE_ADVANCE_DELIVERY_FEE, or REJECT_ORDER
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const checkFraud = async (
  phone: string
): Promise<ApiResponse<IFraudCheckResult>> => {
  try {
    const res = await httpClient.get<IFraudCheckResult>(
      `/courier/check-fraud/${encodeURIComponent(phone)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to check customer fraud score";
    throw new Error(message);
  }
};

/**
 * Unified Courier Booking
 * Dispatches single or bulk orders to Steadfast or Pathao API in parallel
 * Generates consignment ID, tracking code, and tracking URL automatically
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const bookCourier = async (
  payload: ICourierBookPayload
): Promise<ApiResponse<IBookedShipmentResult[]>> => {
  try {
    const res = await httpClient.post<IBookedShipmentResult[]>(
      "/courier/book",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to book shipment with courier";
    throw new Error(message);
  }
};

/**
 * Courier Shipments Directory
 * Filterable and searchable list of all booked parcels (Provider, Courier Status, Payout Reconciled)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR, ACCOUNTANT, INVENTORY_STAFF
 */
export const getAllShipments = async (
  params?: IShipmentQueryParams
): Promise<ApiResponse<ICourierShipment[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<ICourierShipment[]>("/courier/shipments", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch courier shipments";
    throw new Error(message);
  }
};

/**
 * Track Shipment Lifecycle
 * Lookup by Consignment ID, Tracking Code, Order ID or Order Number
 * Public & Customer Accessible
 */
export const trackShipment = async (
  idOrCode: string
): Promise<ApiResponse<ICourierShipment>> => {
  try {
    const res = await httpClient.get<ICourierShipment>(
      `/courier/track/${encodeURIComponent(idOrCode)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Shipment tracking details not found";
    throw new Error(message);
  }
};

