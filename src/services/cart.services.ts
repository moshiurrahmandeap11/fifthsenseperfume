"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  IAddToCartPayload,
  ICartResponse,
  ISyncCartPayload,
  IUpdateCartItemPayload,
} from "@/types/cart.types";

/**
 * Fetch authenticated customer's server-persistent cart
 * Includes live stock calculation and out-of-stock item indicators
 */
export const getUserCart = async (): Promise<ApiResponse<ICartResponse>> => {
  try {
    const res = await httpClient.get<ICartResponse>("/cart");
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to retrieve cart";
    throw new Error(message);
  }
};

/**
 * Add a specific footwear size variant to customer's persistent cart
 */
export const addItemToCart = async (
  payload: IAddToCartPayload
): Promise<ApiResponse<ICartResponse>> => {
  try {
    const res = await httpClient.post<ICartResponse>("/cart/items", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to add shoe to cart";
    throw new Error(message);
  }
};

/**
 * Update quantity of a footwear item in cart
 * Setting quantity to 0 removes the item
 */
export const updateCartItem = async (
  itemId: string,
  payload: IUpdateCartItemPayload
): Promise<ApiResponse<ICartResponse>> => {
  try {
    const res = await httpClient.put<ICartResponse>(
      `/cart/items/${itemId}`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update cart item quantity";
    throw new Error(message);
  }
};

/**
 * Remove an item from customer's persistent cart
 */
export const removeCartItem = async (
  itemId: string
): Promise<ApiResponse<ICartResponse>> => {
  try {
    const res = await httpClient.delete<ICartResponse>(`/cart/items/${itemId}`);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to remove item from cart";
    throw new Error(message);
  }
};

/**
 * Clear customer's entire cart
 */
export const clearCart = async (): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>("/cart");
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to clear cart";
    throw new Error(message);
  }
};

/**
 * Hybrid Sync: Merge guest LocalStorage cart with user's DB cart upon login
 * Auto-caps quantities against available warehouse stock
 */
export const syncCart = async (
  payload: ISyncCartPayload
): Promise<ApiResponse<ICartResponse>> => {
  try {
    const res = await httpClient.post<ICartResponse>("/cart/sync", payload);
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to synchronize cart";
    throw new Error(message);
  }
};

