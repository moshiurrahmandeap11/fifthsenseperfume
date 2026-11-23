"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient, { extractErrorMessage } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICategory,
  ICategoryQueryParams,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "@/types/category.types";

/**
 * Filter and serialize query params by eliminating undefined/null/empty values
 */
const buildQueryParams = (
  params?: Record<string, unknown>
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
 * Fetch paginated or filtered categories list
 */
export const getAllCategories = async (
  params?: ICategoryQueryParams
): Promise<ApiResponse<ICategory[]>> => {
  try {
    const cleanParams = buildQueryParams(params as Record<string, unknown>);
    const res = await httpClient.get<ICategory[]>("/categories", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to fetch categories"));
  }
};

/**
 * Fetch nested category hierarchy tree (for MegaMenu & navigation)
 */
export const getCategoryTree = async (
  isActive?: boolean
): Promise<ApiResponse<ICategory[]>> => {
  try {
    const params: Record<string, unknown> = { tree: true };
    if (isActive !== undefined) {
      params.isActive = isActive;
    }
    const res = await httpClient.get<ICategory[]>("/categories", {
      params,
    });
    return res;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to fetch category tree"));
  }
};

/**
 * Fetch single category by ID or unique slug (including children and parent)
 */
export const getCategoryByIdOrSlug = async (
  idOrSlug: string
): Promise<ApiResponse<ICategory>> => {
  try {
    const res = await httpClient.get<ICategory>(
      `/categories/${encodeURIComponent(idOrSlug)}`
    );
    return res;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to fetch category details"));
  }
};

/**
 * Create a new category with auto-slug generation (supports JSON or FormData with image)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const createCategory = async (
  payload: ICreateCategoryPayload | FormData
): Promise<ApiResponse<ICategory>> => {
  try {
    const res = await httpClient.post<ICategory>("/categories", payload);
    return res;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to create category"));
  }
};

/**
 * Update an existing category (supports JSON or FormData with image)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const updateCategory = async (
  id: string,
  payload: IUpdateCategoryPayload | FormData
): Promise<ApiResponse<ICategory>> => {
  try {
    const res = await httpClient.put<ICategory>(`/categories/${id}`, payload);
    return res;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to update category"));
  }
};

/**
 * Delete a category (checks if children or products are attached)
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const deleteCategory = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/categories/${id}`
    );
    return res;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to delete category"));
  }
};

