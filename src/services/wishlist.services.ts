"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  IToggleWishlistResult,
  IWishlistItem,
  IWishlistQueryParams,
} from "@/types/wishlist.types";

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
 * 1. Toggle Product in Customer's Wishlist (Add if absent, Remove if present)
 * Authenticated Customer
 */
export const toggleWishlist = async (
  productId: string
): Promise<ApiResponse<IToggleWishlistResult>> => {
  try {
    const res = await httpClient.post<IToggleWishlistResult>(
      "/wishlist/toggle",
      { productId }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update wishlist";
    throw new Error(message);
  }
};

/**
 * 2. Get Customer's Saved Wishlist Products with colorways and sizes
 * Authenticated Customer
 */
export const getUserWishlist = async (
  params?: IWishlistQueryParams
): Promise<ApiResponse<IWishlistItem[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IWishlistItem[]>("/wishlist", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch wishlist items";
    throw new Error(message);
  }
};

