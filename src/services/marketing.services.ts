"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  IApplyCouponPayload,
  IApplyCouponResult,
  ICampaignLandingPage,
  ICoupon,
  ICouponQueryParams,
  ICreateCouponPayload,
  ICreateFlashSalePayload,
  ICreateLandingPagePayload,
  IFlashSale,
  IFlashSaleQueryParams,
  ILandingPageQueryParams,
  ITestCapiPayload,
  IUpdateCouponPayload,
  IUpdateFlashSalePayload,
  IUpdateLandingPagePayload,
} from "@/types/marketing.types";

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

// ==========================================
// 1. COUPON SERVICES
// ==========================================

/**
 * Apply coupon code at checkout with pair count and prepaid validation
 * Public & Customer Accessible
 */
export const applyCoupon = async (
  payload: IApplyCouponPayload
): Promise<ApiResponse<IApplyCouponResult>> => {
  try {
    const res = await httpClient.post<IApplyCouponResult>(
      "/marketing/coupons/apply",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to apply coupon";
    throw new Error(message);
  }
};

/**
 * Fetch all coupons with filters (Discount type, active status, pagination)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const getAllCoupons = async (
  params?: ICouponQueryParams
): Promise<ApiResponse<ICoupon[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<ICoupon[]>("/marketing/coupons", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch coupons";
    throw new Error(message);
  }
};

/**
 * Get coupon details by ID or Code
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const getCouponById = async (
  idOrCode: string
): Promise<ApiResponse<ICoupon>> => {
  try {
    const res = await httpClient.get<ICoupon>(
      `/marketing/coupons/${encodeURIComponent(idOrCode)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch coupon details";
    throw new Error(message);
  }
};

/**
 * Create a new promotional discount coupon
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const createCoupon = async (
  payload: ICreateCouponPayload
): Promise<ApiResponse<ICoupon>> => {
  try {
    const res = await httpClient.post<ICoupon>("/marketing/coupons", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create coupon";
    throw new Error(message);
  }
};

/**
 * Update an existing coupon
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const updateCoupon = async (
  id: string,
  payload: IUpdateCouponPayload
): Promise<ApiResponse<ICoupon>> => {
  try {
    const res = await httpClient.put<ICoupon>(
      `/marketing/coupons/${id}`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update coupon";
    throw new Error(message);
  }
};

/**
 * Delete a coupon
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const deleteCoupon = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/marketing/coupons/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete coupon";
    throw new Error(message);
  }
};

// ==========================================
// 2. FLASH SALE SERVICES
// ==========================================

/**
 * Get currently active flash sale campaign with live countdown and discounted shoes
 * Public Storefront
 */
export const getActiveFlashSale = async (): Promise<
  ApiResponse<IFlashSale | null>
> => {
  try {
    const res = await httpClient.get<IFlashSale | null>(
      "/marketing/flash-sales/active"
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch active flash sale";
    throw new Error(message);
  }
};

/**
 * Fetch all flash sales campaigns
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const getAllFlashSales = async (
  params?: IFlashSaleQueryParams
): Promise<ApiResponse<IFlashSale[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IFlashSale[]>("/marketing/flash-sales", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch flash sales";
    throw new Error(message);
  }
};

/**
 * Get flash sale campaign details with items by ID or Slug
 */
export const getFlashSaleByIdOrSlug = async (
  idOrSlug: string
): Promise<ApiResponse<IFlashSale>> => {
  try {
    const res = await httpClient.get<IFlashSale>(
      `/marketing/flash-sales/${encodeURIComponent(idOrSlug)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch flash sale details";
    throw new Error(message);
  }
};

/**
 * Create a new flash sale campaign with timed duration and discount prices
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const createFlashSale = async (
  payload: ICreateFlashSalePayload
): Promise<ApiResponse<IFlashSale>> => {
  try {
    const res = await httpClient.post<IFlashSale>(
      "/marketing/flash-sales",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create flash sale";
    throw new Error(message);
  }
};

/**
 * Update an existing flash sale campaign
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const updateFlashSale = async (
  id: string,
  payload: IUpdateFlashSalePayload
): Promise<ApiResponse<IFlashSale>> => {
  try {
    const res = await httpClient.put<IFlashSale>(
      `/marketing/flash-sales/${id}`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update flash sale";
    throw new Error(message);
  }
};

/**
 * Delete a flash sale campaign
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const deleteFlashSale = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/marketing/flash-sales/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete flash sale";
    throw new Error(message);
  }
};

// ==========================================
// 3. CAMPAIGN LANDING PAGE SERVICES
// ==========================================

/**
 * Direct Ad Traffic Landing Page by slug (Single Shoe Sales Funnel)
 * Public Storefront
 */
export const getLandingPageBySlug = async (
  slug: string
): Promise<ApiResponse<ICampaignLandingPage>> => {
  try {
    const res = await httpClient.get<ICampaignLandingPage>(
      `/marketing/landing-pages/${encodeURIComponent(slug)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch campaign landing page";
    throw new Error(message);
  }
};

/**
 * Fetch all campaign landing pages
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const getAllLandingPages = async (
  params?: ILandingPageQueryParams
): Promise<ApiResponse<ICampaignLandingPage[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<ICampaignLandingPage[]>(
      "/marketing/landing-pages",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch campaign landing pages";
    throw new Error(message);
  }
};

/**
 * Create a new single-product sales funnel landing page
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const createLandingPage = async (
  payload: ICreateLandingPagePayload
): Promise<ApiResponse<ICampaignLandingPage>> => {
  try {
    const res = await httpClient.post<ICampaignLandingPage>(
      "/marketing/landing-pages",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create campaign landing page";
    throw new Error(message);
  }
};

/**
 * Update an existing campaign landing page
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const updateLandingPage = async (
  id: string,
  payload: IUpdateLandingPagePayload
): Promise<ApiResponse<ICampaignLandingPage>> => {
  try {
    const res = await httpClient.put<ICampaignLandingPage>(
      `/marketing/landing-pages/${id}`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update campaign landing page";
    throw new Error(message);
  }
};

/**
 * Delete a campaign landing page
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const deleteLandingPage = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/marketing/landing-pages/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete campaign landing page";
    throw new Error(message);
  }
};

// ==========================================
// 4. META CONVERSIONS API (CAPI) TESTER
// ==========================================

/**
 * Trigger test server-side Meta Conversions API (CAPI) event
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const testCapiEvent = async (
  payload: ITestCapiPayload
): Promise<ApiResponse<any>> => {
  try {
    const res = await httpClient.post<any>("/marketing/capi/test", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to trigger Meta CAPI test event";
    throw new Error(message);
  }
};

