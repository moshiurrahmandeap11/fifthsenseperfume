"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateAddressPayload,
  ICustomerAddress,
  ICustomerProfile,
  ICustomerQueryParams,
  IUpdateAddressPayload,
  IUpdateProfilePayload,
} from "@/types/user.types";

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
 * Fetch authenticated customer profile with address book & activity counts
 */
export const getMyProfile = async (): Promise<
  ApiResponse<ICustomerProfile>
> => {
  try {
    const res = await httpClient.get<ICustomerProfile>("/users/profile");
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch customer profile";
    throw new Error(message);
  }
};

/**
 * Update authenticated customer profile (supports JSON or FormData with avatar)
 */
export const updateMyProfile = async (
  payload: IUpdateProfilePayload | FormData
): Promise<ApiResponse<ICustomerProfile>> => {
  try {
    const res = await httpClient.put<ICustomerProfile>(
      "/users/profile",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update profile";
    throw new Error(message);
  }
};

/**
 * Fetch customer address book sorted with default address first
 */
export const getMyAddresses = async (): Promise<
  ApiResponse<ICustomerAddress[]>
> => {
  try {
    const res = await httpClient.get<ICustomerAddress[]>("/users/addresses");
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch addresses";
    throw new Error(message);
  }
};

/**
 * Add a new delivery address to customer address book
 */
export const createAddress = async (
  payload: ICreateAddressPayload
): Promise<ApiResponse<ICustomerAddress>> => {
  try {
    const res = await httpClient.post<ICustomerAddress>(
      "/users/addresses",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to add new address";
    throw new Error(message);
  }
};

/**
 * Update an existing delivery address
 */
export const updateAddress = async (
  id: string,
  payload: IUpdateAddressPayload
): Promise<ApiResponse<ICustomerAddress>> => {
  try {
    const res = await httpClient.put<ICustomerAddress>(
      `/users/addresses/${id}`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update address";
    throw new Error(message);
  }
};

/**
 * Delete a delivery address from customer address book
 */
export const deleteAddress = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/users/addresses/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete address";
    throw new Error(message);
  }
};

/**
 * CRM: Fetch paginated list of customers (Search by name/email/phone, filter by savedShoeSize & status)
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const getAllCustomers = async (
  params?: ICustomerQueryParams
): Promise<ApiResponse<ICustomerProfile[]>> => {
  try {
    const cleanParams = buildQueryParams(params as Record<string, unknown>);
    const res = await httpClient.get<ICustomerProfile[]>("/users/customers", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch customers list";
    throw new Error(message);
  }
};

/**
 * CRM: Fetch customer detailed 360-degree view (Addresses, recent 10 orders, counts)
 * Allowed: SUPER_ADMIN, ADMIN, MODERATOR
 */
export const getCustomerById = async (
  id: string
): Promise<ApiResponse<ICustomerProfile>> => {
  try {
    const res = await httpClient.get<ICustomerProfile>(
      `/users/customers/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch customer details";
    throw new Error(message);
  }
};

