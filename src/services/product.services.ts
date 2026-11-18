"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateProductPayload,
  IProduct,
  IProductQueryParams,
  IShopBySizeQueryParams,
  IUpdateProductPayload,
} from "@/types/product.types";

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
 * Fetch products list with comprehensive filtering
 * (Search, Category, Shoe Size, Color, Price Range, Gender, Fit Type, Stock, Merchandising Badges)
 */
export const getAllProducts = async (
  params?: IProductQueryParams
): Promise<ApiResponse<IProduct[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IProduct[]>("/products", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch products";
    throw new Error(message);
  }
};

/**
 * Quick Fit Finder: Fetch all footwear in stock for a customer's specific shoe size
 * e.g., Size 41, 42, 43 with optional gender filter
 */
export const getShopBySize = async (
  params: IShopBySizeQueryParams
): Promise<ApiResponse<IProduct[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IProduct[]>("/products/shop-by-size", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch shoes for selected size";
    throw new Error(message);
  }
};

/**
 * Fetch detailed single product by ID or SEO slug
 * (Includes category, sizeChart, colorways with sizes, cross-sells, approved reviews)
 */
export const getProductByIdOrSlug = async (
  idOrSlug: string
): Promise<ApiResponse<IProduct>> => {
  try {
    const res = await httpClient.get<IProduct>(
      `/products/${encodeURIComponent(idOrSlug)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch product details";
    throw new Error(message);
  }
};

/**
 * Unified Product Creation
 * Atomically creates footwear style, colors, sizes with auto-generated SKU & barcode, and cross-sell addons
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const createProduct = async (
  payload: ICreateProductPayload
): Promise<ApiResponse<IProduct>> => {
  try {
    const res = await httpClient.post<IProduct>("/products", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create product";
    throw new Error(message);
  }
};

/**
 * Unified Product Update
 * Atomically updates product details, color palettes, and size variant matrices
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const updateProduct = async (
  id: string,
  payload: IUpdateProductPayload
): Promise<ApiResponse<IProduct>> => {
  try {
    const res = await httpClient.put<IProduct>(`/products/${id}`, payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update product";
    throw new Error(message);
  }
};

/**
 * Archive / Soft-delete a footwear style
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const deleteProduct = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/products/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to archive product";
    throw new Error(message);
  }
};
