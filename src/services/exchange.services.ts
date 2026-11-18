"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateExchangeRequestPayload,
  IExchangeQcDecisionPayload,
  IExchangeQueryParams,
  IExchangeRequest,
  IExchangeStatusDecisionPayload,
  IPendingQcQueryParams,
} from "@/types/exchange.types";

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
 * Submit Footwear Size Exchange or Defect Return Request
 * Customers can request a different shoe size or report factory defect with photo proof
 * Public & Customer Accessible
 */
export const createExchangeRequest = async (
  payload: ICreateExchangeRequestPayload
): Promise<ApiResponse<IExchangeRequest>> => {
  try {
    const res = await httpClient.post<IExchangeRequest>(
      "/exchanges/request",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to submit exchange request";
    throw new Error(message);
  }
};

/**
 * Warehouse Returns Pending QC Queue
 * Lists returned shoe parcels awaiting warehouse inspection and grading
 * Allowed: INVENTORY_STAFF, SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const getPendingQcExchanges = async (
  params?: IPendingQcQueryParams
): Promise<ApiResponse<IExchangeRequest[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IExchangeRequest[]>(
      "/exchanges/pending-qc",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch pending return QC queue";
    throw new Error(message);
  }
};

/**
 * Mark Returned Shoe Parcel Received at Warehouse Gate
 * Updates parcel status from AWAITING_RETURN to RECEIVED_PENDING_QC
 * Allowed: INVENTORY_STAFF, SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const receiveReturnedParcel = async (
  id: string
): Promise<ApiResponse<IExchangeRequest>> => {
  try {
    const res = await httpClient.put<IExchangeRequest>(
      `/exchanges/${id}/receive-parcel`,
      {}
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to mark parcel as received";
    throw new Error(message);
  }
};

/**
 * Warehouse Return QC Decision & Restock
 * If shoes are brand-new / intact: QC_PASSED_RESTOCKED -> auto increments variant stock and logs StockMovement
 * If shoes are worn / damaged: QC_FAILED_DAMAGED -> writes off stock to damaged
 * Allowed: INVENTORY_STAFF, SUPER_ADMIN, ADMIN
 */
export const decideReturnQc = async (
  id: string,
  payload: IExchangeQcDecisionPayload
): Promise<ApiResponse<IExchangeRequest>> => {
  try {
    const res = await httpClient.put<IExchangeRequest>(
      `/exchanges/${id}/qc-decision`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to record warehouse QC decision";
    throw new Error(message);
  }
};

/**
 * Moderator Exchange Approval / Rejection Decision
 * When approved: Automatically reserves stock of requested replacement size,
 * calculates exchange delivery fee, and generates a linked Replacement Order
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const decideExchangeStatus = async (
  id: string,
  payload: IExchangeStatusDecisionPayload
): Promise<ApiResponse<IExchangeRequest>> => {
  try {
    const res = await httpClient.put<IExchangeRequest>(
      `/exchanges/${id}/status`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to process exchange decision";
    throw new Error(message);
  }
};

/**
 * Get detailed view of an exchange request by ID or Exchange Number
 * (Includes original order, order item, old and new shoe size variants, replacement order)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR, INVENTORY_STAFF
 */
export const getExchangeById = async (
  id: string
): Promise<ApiResponse<IExchangeRequest>> => {
  try {
    const res = await httpClient.get<IExchangeRequest>(
      `/exchanges/${encodeURIComponent(id)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch exchange details";
    throw new Error(message);
  }
};

/**
 * List all exchange & return requests with pagination, status, and type filtering
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR, ACCOUNTANT
 */
export const getAllExchanges = async (
  params?: IExchangeQueryParams
): Promise<ApiResponse<IExchangeRequest[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IExchangeRequest[]>("/exchanges", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch exchange requests";
    throw new Error(message);
  }
};

