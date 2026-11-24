"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  IBanner,
  IBannerQueryParams,
  ICreateBannerPayload,
  ICreateShowroomPayload,
  IPlatformSettings,
  IShowroomLocation,
  IShowroomQueryParams,
  IUpdateBannerPayload,
  IUpdatePlatformSettingsPayload,
  IUpdateShowroomPayload,
} from "@/types/system.types";

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
// 1. PLATFORM CONFIGURATION & SETTINGS
// ==========================================

/**
 * Get Platform Brand & Shipping Settings
 * Public Storefront & Admin
 */
export const getPlatformSettings = async (): Promise<
  ApiResponse<IPlatformSettings>
> => {
  try {
    const res = await httpClient.get<IPlatformSettings>("/system/settings");
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch platform settings";
    throw new Error(message);
  }
};

/**
 * Update Platform Settings (Shipping rates, brand logo, pixels, maintenance mode)
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const updatePlatformSettings = async (
  payload: FormData | IUpdatePlatformSettingsPayload
): Promise<ApiResponse<IPlatformSettings>> => {
  try {
    const res = await httpClient.put<IPlatformSettings>(
      "/system/settings",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update platform settings";
    throw new Error(message);
  }
};

// ==========================================
// 2. CMS BANNERS
// ==========================================

/**
 * Get all Promotional & Hero Banners with filters
 * Public Storefront & Admin
 */
export const getAllBanners = async (
  params?: IBannerQueryParams
): Promise<ApiResponse<IBanner[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IBanner[]>("/system/banners", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch banners";
    throw new Error(message);
  }
};

/**
 * Get Single Banner by ID
 */
export const getBannerById = async (
  id: string
): Promise<ApiResponse<IBanner>> => {
  try {
    const res = await httpClient.get<IBanner>(`/system/banners/${id}`);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch banner details";
    throw new Error(message);
  }
};

/**
 * Create a new Promotional Banner (Supports Image Upload via FormData or JSON)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const createBanner = async (
  payload: FormData | ICreateBannerPayload
): Promise<ApiResponse<IBanner>> => {
  try {
    const res = await httpClient.post<IBanner>("/system/banners", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create banner";
    throw new Error(message);
  }
};

/**
 * Update Banner details or image
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const updateBanner = async (
  id: string,
  payload: FormData | IUpdateBannerPayload
): Promise<ApiResponse<IBanner>> => {
  try {
    const res = await httpClient.put<IBanner>(`/system/banners/${id}`, payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update banner";
    throw new Error(message);
  }
};

/**
 * Delete Banner
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const deleteBanner = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/system/banners/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete banner";
    throw new Error(message);
  }
};

// ==========================================
// 3. PHYSICAL SHOWROOM OUTLETS
// ==========================================

/**
 * Get list of physical showroom outlets with district/status filtering
 * Public Storefront & Admin
 */
export const getAllShowrooms = async (
  params?: IShowroomQueryParams
): Promise<ApiResponse<IShowroomLocation[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IShowroomLocation[]>("/system/showrooms", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch showroom outlets";
    throw new Error(message);
  }
};

/**
 * Get Showroom outlet by ID
 */
export const getShowroomById = async (
  id: string
): Promise<ApiResponse<IShowroomLocation>> => {
  try {
    const res = await httpClient.get<IShowroomLocation>(
      `/system/showrooms/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch showroom details";
    throw new Error(message);
  }
};

/**
 * Create a new physical showroom outlet
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const createShowroom = async (
  payload: ICreateShowroomPayload
): Promise<ApiResponse<IShowroomLocation>> => {
  try {
    const res = await httpClient.post<IShowroomLocation>(
      "/system/showrooms",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create showroom outlet";
    throw new Error(message);
  }
};

/**
 * Update physical showroom outlet details
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const updateShowroom = async (
  id: string,
  payload: IUpdateShowroomPayload
): Promise<ApiResponse<IShowroomLocation>> => {
  try {
    const res = await httpClient.put<IShowroomLocation>(
      `/system/showrooms/${id}`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update showroom outlet";
    throw new Error(message);
  }
};

/**
 * Delete showroom outlet
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const deleteShowroom = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/system/showrooms/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete showroom outlet";
    throw new Error(message);
  }
};

// ==========================================
// 4. BANGLADESH LOCATIONS (BACKEND API)
// ==========================================

export interface ILocationsResponse {
  divisions?: string[];
  districts?: string[];
  thanas?: string[];
}

export interface IShippingQuoteResponse {
  deliveryZone: "INSIDE_DHAKA" | "DHAKA_SUB_AREA" | "OUTSIDE_DHAKA";
  label: string;
  eta: string;
  baseCharge: number;
  charge: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number | null;
}

/**
 * Fetch Bangladesh Divisions, Districts, or Thanas securely from Backend
 */
export const getBangladeshLocations = async (params?: {
  division?: string;
  district?: string;
}): Promise<ApiResponse<ILocationsResponse>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<ILocationsResponse>("/system/locations", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch locations";
    throw new Error(message);
  }
};

/**
 * Calculate authoritative delivery zone & shipping fee from Backend
 */
export const getShippingQuote = async (params: {
  division?: string;
  district?: string;
  thana?: string;
  subtotal?: number;
}): Promise<ApiResponse<IShippingQuoteResponse>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IShippingQuoteResponse>(
      "/system/shipping-quote",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to calculate shipping fee";
    throw new Error(message);
  }
};

