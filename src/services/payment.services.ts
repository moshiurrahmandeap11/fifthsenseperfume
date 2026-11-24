"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateExpensePayload,
  ICourierReconciliationData,
  ICourierReconciliationQueryParams,
  IDailyExpense,
  IExpenseQueryParams,
  IExpensesData,
  IInitiatePaymentPayload,
  IInitiatePaymentResponse,
  IMarkReconciledPayload,
  IMarkReconciledResponse,
  ITransactionQueryParams,
  ITransactionsData,
  IUpdateExpensePayload,
} from "@/types/payment.types";

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
 * Initiate Online Payment Session (bKash / SSLCommerz)
 * Generates gateway redirect URL for full prepayment or advance delivery fee
 * Public & Customer Accessible
 */
export const initiatePayment = async (
  payload: IInitiatePaymentPayload
): Promise<ApiResponse<IInitiatePaymentResponse>> => {
  try {
    const res = await httpClient.post<IInitiatePaymentResponse>(
      "/payments/initiate",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to initiate online payment session";
    return {
      success: false,
      message,
      data: null as unknown as IInitiatePaymentResponse,
    };
  }
};

/**
 * Verify Stripe Checkout Session after redirect back from Stripe
 */
export const verifyStripeSession = async (
  sessionId: string
): Promise<ApiResponse<any>> => {
  try {
    const res = await httpClient.get<any>("/payments/stripe/verify-session", {
      params: { sessionId },
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to verify Stripe payment session";
    throw new Error(message);
  }
};

/**
 * Payment Transactions Directory
 * Filterable and searchable ledger of all digital payments and COD settlements
 * Allowed: ACCOUNTANT, ADMIN, SUPER_ADMIN
 */
export const getAllTransactions = async (
  params?: ITransactionQueryParams
): Promise<ApiResponse<ITransactionsData>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<ITransactionsData>(
      "/payments/transactions",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch payment transactions";
    throw new Error(message);
  }
};

/**
 * Courier Payout Reconciliation Dashboard
 * Summarizes pending COD collections, deducted delivery & COD fees, and net bank payouts
 * Allowed: ACCOUNTANT, ADMIN, SUPER_ADMIN
 */
export const getCourierReconciliation = async (
  params?: ICourierReconciliationQueryParams
): Promise<ApiResponse<ICourierReconciliationData>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<ICourierReconciliationData>(
      "/payments/courier-reconciliation",
      {
        params: cleanParams,
      }
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch courier reconciliation report";
    throw new Error(message);
  }
};

/**
 * Mark Courier Shipments as Reconciled
 * Flags parcels as reconciled once courier company disburses payout into company bank account
 * Allowed: ACCOUNTANT, ADMIN, SUPER_ADMIN
 */
export const markShipmentsReconciled = async (
  payload: IMarkReconciledPayload
): Promise<ApiResponse<IMarkReconciledResponse>> => {
  try {
    const res = await httpClient.put<IMarkReconciledResponse>(
      "/payments/courier-reconciliation/mark-reconciled",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to reconcile courier shipments";
    throw new Error(message);
  }
};

/**
 * Record Daily Expense (Meta Ad spend, TikTok Ads, packaging, salaries, factory costs)
 * Allowed: ACCOUNTANT, ADMIN, SUPER_ADMIN
 */
export const createExpense = async (
  payload: ICreateExpensePayload
): Promise<ApiResponse<IDailyExpense>> => {
  try {
    const res = await httpClient.post<IDailyExpense>(
      "/payments/expenses",
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to record expense entry";
    throw new Error(message);
  }
};

/**
 * Fetch Daily Expenses with Total Aggregate Amount
 * Allowed: ACCOUNTANT, ADMIN, SUPER_ADMIN
 */
export const getAllExpenses = async (
  params?: IExpenseQueryParams
): Promise<ApiResponse<IExpensesData>> => {
  try {
    const cleanParams = buildQueryParams(params);
    const res = await httpClient.get<IExpensesData>("/payments/expenses", {
      params: cleanParams,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch daily expenses";
    throw new Error(message);
  }
};

/**
 * Update an existing Daily Expense entry
 * Allowed: ACCOUNTANT, ADMIN, SUPER_ADMIN
 */
export const updateExpense = async (
  id: string,
  payload: IUpdateExpensePayload
): Promise<ApiResponse<IDailyExpense>> => {
  try {
    const res = await httpClient.put<IDailyExpense>(
      `/payments/expenses/${id}`,
      payload
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update expense entry";
    throw new Error(message);
  }
};

/**
 * Delete an Expense entry
 * Allowed: ADMIN, SUPER_ADMIN
 */
export const deleteExpense = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/payments/expenses/${id}`
    );
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete expense entry";
    throw new Error(message);
  }
};

