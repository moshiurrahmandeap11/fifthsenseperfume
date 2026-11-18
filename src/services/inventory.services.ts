"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  IBarcodeLabelData,
  IFactoryStockInPayload,
  IFactoryStockInResponse,
  ILowStockAlertQueryParams,
  ILowStockAlertVariant,
  IQuickStockUpdatePayload,
  ISizeMatrixProduct,
  ISizeMatrixQueryParams,
  IStockMovement,
  IStockMovementQueryParams,
} from "@/types/inventory.types";

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
 * Size Matrix Grid View
 * Displays footwear inventory structured by style code, colorway, and size columns (EU 38-45)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, INVENTORY_STAFF
 */
export const getSizeMatrix = async (
  params?: ISizeMatrixQueryParams
): Promise<ApiResponse<ISizeMatrixProduct[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<ISizeMatrixProduct[]>(
      "/inventory/size-matrix",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch inventory size matrix";
    throw new Error(message);
  }
};

/**
 * 1-Click Quick Stock Adjustment
 * Updates warehouse or showroom stock directly from the grid and logs a StockMovement audit record
 * Automatically recalculates broken-size status for the shoe style
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, INVENTORY_STAFF
 */
export const quickStockUpdate = async (
  payload: IQuickStockUpdatePayload
): Promise<ApiResponse<any>> => {
  try {
    const res = await httpClient.put<any>("/inventory/quick-update", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update stock quantity";
    throw new Error(message);
  }
};

/**
 * Low-stock & Broken-size Alerts
 * Identifies sizes running below safety thresholds and broken shoe runs
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, INVENTORY_STAFF
 */
export const getLowStockAlerts = async (
  params?: ILowStockAlertQueryParams
): Promise<ApiResponse<ILowStockAlertVariant[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<ILowStockAlertVariant[]>(
      "/inventory/low-stock-alerts",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch low stock alerts";
    throw new Error(message);
  }
};

/**
 * Stock Movement Audit History
 * Track every shoe pair moving in and out with actor, previous/new stock and reference ID
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, INVENTORY_STAFF, ACCOUNTANT
 */
export const getStockMovements = async (
  params?: IStockMovementQueryParams
): Promise<ApiResponse<IStockMovement[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IStockMovement[]>(
      "/inventory/movements",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch stock movement logs";
    throw new Error(message);
  }
};

/**
 * Bulk Factory Shipment Stock-In
 * Receive carton shipments directly from factory floor with batch PO reference and auto-increment stock
 * Allowed: SUPER_ADMIN, ADMIN, INVENTORY_STAFF
 */
export const factoryStockIn = async (
  payload: IFactoryStockInPayload
): Promise<ApiResponse<IFactoryStockInResponse>> => {
  try {
    const res = await httpClient.post<IFactoryStockInResponse>(
      "/inventory/factory-stock-in",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to receive factory stock shipment";
    throw new Error(message);
  }
};

/**
 * Shoe Box Thermal Barcode Label Print Data
 * Generates standardized print layout data (Style Code, Color, Size, EU/UK/US, Foot Length, Barcode, MRP)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, INVENTORY_STAFF
 */
export const getBarcodeLabel = async (
  variantId: string
): Promise<ApiResponse<IBarcodeLabelData>> => {
  try {
    const res = await httpClient.get<IBarcodeLabelData>(
      `/inventory/barcode-label/${encodeURIComponent(variantId)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to generate barcode label data";
    throw new Error(message);
  }
};

