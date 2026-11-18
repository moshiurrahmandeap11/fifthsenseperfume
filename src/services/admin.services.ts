"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import {
  IActivityLog,
  IActivityLogQueryParams,
  IBlacklistPayload,
  IBlacklistQueryParams,
  ICreateStaffPayload,
  ICustomerFraudScore,
  IStaffQueryParams,
  IStaffUser,
  IUpdateStaffPayload,
} from "@/types/admin.types";
import { ApiResponse } from "@/types/api.types";

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
 * Retrieve paginated, searchable and filterable list of internal staff members
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const getAllStaff = async (
  params?: IStaffQueryParams
): Promise<ApiResponse<IStaffUser[]>> => {
  try {
    const cleanParams = buildQueryParams(params as Record<string, unknown>);
    const res = await httpClient.get<IStaffUser[]>("/admin/staff", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch staff members";
    throw new Error(message);
  }
};

/**
 * Get detailed staff profile by ID
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const getStaffById = async (
  id: string
): Promise<ApiResponse<IStaffUser>> => {
  try {
    const res = await httpClient.get<IStaffUser>(`/admin/staff/${id}`);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch staff details";
    throw new Error(message);
  }
};

/**
 * Create a new staff member with assigned RBAC role and credentials
 * Allowed: SUPER_ADMIN
 */
export const createStaff = async (
  payload: ICreateStaffPayload
): Promise<ApiResponse<IStaffUser>> => {
  try {
    const res = await httpClient.post<IStaffUser>("/admin/staff", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create staff member";
    throw new Error(message);
  }
};

/**
 * Update staff details (Name, Phone, Role, Status)
 * Allowed: SUPER_ADMIN
 */
export const updateStaff = async (
  id: string,
  payload: IUpdateStaffPayload
): Promise<ApiResponse<IStaffUser>> => {
  try {
    const res = await httpClient.put<IStaffUser>(`/admin/staff/${id}`, payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update staff member";
    throw new Error(message);
  }
};

/**
 * Deactivate / Soft delete a staff member
 * Allowed: SUPER_ADMIN
 */
export const deleteStaff = async (
  id: string
): Promise<ApiResponse<IStaffUser>> => {
  try {
    const res = await httpClient.delete<IStaffUser>(`/admin/staff/${id}`);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to deactivate staff member";
    throw new Error(message);
  }
};

/**
 * Fetch staff audit activity logs with actor metadata and pagination
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const getActivityLogs = async (
  params?: IActivityLogQueryParams
): Promise<ApiResponse<IActivityLog[]>> => {
  try {
    const cleanParams = buildQueryParams(params as Record<string, unknown>);
    const res = await httpClient.get<IActivityLog[]>("/admin/activity-logs", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch activity logs";
    throw new Error(message);
  }
};

/**
 * Fetch paginated list of fraud-blacklisted customer phone numbers
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const getBlacklist = async (
  params?: IBlacklistQueryParams
): Promise<ApiResponse<ICustomerFraudScore[]>> => {
  try {
    const cleanParams = buildQueryParams(params as Record<string, unknown>);
    const res = await httpClient.get<ICustomerFraudScore[]>("/admin/blacklist", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch blacklisted records";
    throw new Error(message);
  }
};

/**
 * Add fraudulent customer phone number to blacklist with reason and risk level
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const addToBlacklist = async (
  payload: IBlacklistPayload
): Promise<ApiResponse<ICustomerFraudScore>> => {
  try {
    const res = await httpClient.post<ICustomerFraudScore>(
      "/admin/blacklist",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to add customer to blacklist";
    throw new Error(message);
  }
};

/**
 * Remove customer from fraud blacklist (by record ID or phone number)
 * Allowed: SUPER_ADMIN, ADMIN
 */
export const removeFromBlacklist = async (
  idOrPhone: string
): Promise<ApiResponse<ICustomerFraudScore>> => {
  try {
    const res = await httpClient.delete<ICustomerFraudScore>(
      `/admin/blacklist/${encodeURIComponent(idOrPhone)}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to remove customer from blacklist";
    throw new Error(message);
  }
};

