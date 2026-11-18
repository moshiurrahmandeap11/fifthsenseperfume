"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateSizeChartPayload,
  ISizeChart,
  ISizeChartQueryParams,
  IUpdateSizeChartPayload,
} from "@/types/sizeChart.types";

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
 * Fetch list of footwear size charts with pagination & search
 */
export const getAllSizeCharts = async (
  params?: ISizeChartQueryParams
): Promise<ApiResponse<ISizeChart[]>> => {
  try {
    const cleanParams = buildQueryParams(params as Record<string, unknown>);
    const res = await httpClient.get<ISizeChart[]>("/size-charts", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch size charts";
    throw new Error(message);
  }
};

/**
 * Fetch size chart details with conversion rows (EU, UK, US, Foot length cm/inch)
 */
export const getSizeChartById = async (
  id: string
): Promise<ApiResponse<ISizeChart>> => {
  try {
    const res = await httpClient.get<ISizeChart>(`/size-charts/${id}`);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch size chart details";
    throw new Error(message);
  }
};

/**
 * Create a new footwear size conversion chart (supports JSON or FormData with guideImage)
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const createSizeChart = async (
  payload: ICreateSizeChartPayload | FormData
): Promise<ApiResponse<ISizeChart>> => {
  try {
    const res = await httpClient.post<ISizeChart>("/size-charts", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create size chart";
    throw new Error(message);
  }
};

/**
 * Update an existing footwear size chart
 * Allowed: SUPER_ADMIN, ADMIN, MANAGER
 */
export const updateSizeChart = async (
  id: string,
  payload: IUpdateSizeChartPayload | FormData
): Promise<ApiResponse<ISizeChart>> => {
  try {
    const res = await httpClient.put<ISizeChart>(`/size-charts/${id}`, payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update size chart";
    throw new Error(message);
  }
};

/**
 * Delete a size chart (protected if linked to products)
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const deleteSizeChart = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/size-charts/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete size chart";
    throw new Error(message);
  }
};

