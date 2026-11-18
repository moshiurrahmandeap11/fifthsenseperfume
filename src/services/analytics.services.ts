"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import {
  IDashboardAnalyticsResult,
  IModeratorPerformanceItem,
  INetProfitQueryParams,
  INetProfitResult,
  ISizeDemandResult,
} from "@/types/analytics.types";
import { ApiResponse } from "@/types/api.types";

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
 * 1. Executive Dashboard Overview
 * Revenue, order funnel, delivery/return rates, operational alerts, and daily sales trends
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const getDashboardAnalytics = async (): Promise<
  ApiResponse<IDashboardAnalyticsResult>
> => {
  try {
    const res = await httpClient.get<IDashboardAnalyticsResult>(
      "/analytics/dashboard"
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch executive dashboard metrics";
    throw new Error(message);
  }
};

/**
 * 2. Footwear Size-Run Demand Curve
 * Aggregates footwear sales per shoe size (39-45), calculates sold % and broken stock flags,
 * and outputs optimal factory production batch ratios (e.g. 1:2:3:3:2:1)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, INVENTORY_STAFF
 */
export const getSizeDemandAnalytics = async (): Promise<
  ApiResponse<ISizeDemandResult>
> => {
  try {
    const res = await httpClient.get<ISizeDemandResult>(
      "/analytics/size-demand"
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch footwear size demand curve";
    throw new Error(message);
  }
};

/**
 * 3. Real Net Profit Calculator
 * Gross Revenue - COGS - Courier Return Loss - Ad Spend - Packaging - Operational Expenses
 * Allowed: SUPER_ADMIN, ADMIN, ACCOUNTANT
 */
export const getNetProfitAnalytics = async (
  params?: INetProfitQueryParams
): Promise<ApiResponse<INetProfitResult>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<INetProfitResult>(
      "/analytics/net-profit",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to calculate net profit analytics";
    throw new Error(message);
  }
};

/**
 * 4. Call Center & Moderator Performance Report
 * Tracks individual staff confirmed orders, packed orders, incomplete order recovery rate,
 * and overall order confirmation conversion rate
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const getModeratorPerformance = async (): Promise<
  ApiResponse<IModeratorPerformanceItem[]>
> => {
  try {
    const res = await httpClient.get<IModeratorPerformanceItem[]>(
      "/analytics/moderator-performance"
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch moderator performance report";
    throw new Error(message);
  }
};

