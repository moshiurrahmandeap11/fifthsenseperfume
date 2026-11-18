"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateReviewPayload,
  IProductReviewsData,
  IReview,
  IReviewQueryParams,
  IUpdateReviewStatusPayload,
} from "@/types/review.types";

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
 * Submit Footwear Review with Rating, Comment, Shoe Fit Feedback, and Photos
 * Public & Customer Accessible
 */
export const createReview = async (
  payload: ICreateReviewPayload
): Promise<ApiResponse<IReview>> => {
  try {
    const res = await httpClient.post<IReview>("/reviews", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to submit review";
    throw new Error(message);
  }
};

/**
 * Get Approved Reviews for a Specific Shoe Product with Fit Breakdown & Rating Histogram
 * Public Storefront
 */
export const getProductReviews = async (
  productId: string,
  params?: Record<string, any>
): Promise<ApiResponse<IProductReviewsData>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IProductReviewsData>(
      `/reviews/product/${productId}`,
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch product reviews";
    throw new Error(message);
  }
};

/**
 * Moderator: List all reviews with filters for moderation (Approved, Featured, Spam)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const getAllReviews = async (
  params?: IReviewQueryParams
): Promise<ApiResponse<IReview[]>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IReview[]>("/reviews", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch reviews list";
    throw new Error(message);
  }
};

/**
 * Moderator: Update Review Status (Approve or Feature on Storefront)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER, MODERATOR
 */
export const updateReviewStatus = async (
  id: string,
  payload: IUpdateReviewStatusPayload
): Promise<ApiResponse<IReview>> => {
  try {
    const res = await httpClient.put<IReview>(`/reviews/${id}/status`, payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update review status";
    throw new Error(message);
  }
};

/**
 * Moderator: Delete Spam / Inappropriate Review
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const deleteReview = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(`/reviews/${id}`);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete review";
    throw new Error(message);
  }
};

