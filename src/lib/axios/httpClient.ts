import { ApiResponse } from "@/types/api.types";
import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = async (): Promise<AxiosInstance> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const sessionToken =
    cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (cookieHeader) {
    defaultHeaders["Cookie"] = cookieHeader;
  }

  // Pass Bearer token so Better Auth's bearer plugin validates the session
  if (sessionToken) {
    defaultHeaders["Authorization"] = `Bearer ${sessionToken}`;
  }

  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: defaultHeaders,
  });

  return instance;
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const httpClient = {
  get: async <TData>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<TData>> => {
    const instance = await axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  },

  post: async <TData>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<TData>> => {
    const instance = await axiosInstance();
    if (typeof FormData !== "undefined" && data instanceof FormData) {
      delete instance.defaults.headers["Content-Type"];
    }
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  },

  put: async <TData>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<TData>> => {
    const instance = await axiosInstance();
    if (typeof FormData !== "undefined" && data instanceof FormData) {
      delete instance.defaults.headers["Content-Type"];
    }
    const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  },

  patch: async <TData>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<TData>> => {
    const instance = await axiosInstance();
    if (typeof FormData !== "undefined" && data instanceof FormData) {
      delete instance.defaults.headers["Content-Type"];
    }
    const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  },

  delete: async <TData>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<TData>> => {
    const instance = await axiosInstance();
    const response = await instance.delete<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  },
};

/**
 * Extract human-readable error messages from API responses, including Zod validation errors
 */
export const extractErrorMessage = (
  error: any,
  fallback = "An unexpected error occurred"
): string => {
  if (error?.response?.data) {
    const data = error.response.data;
    if (Array.isArray(data.errorSources) && data.errorSources.length > 0) {
      return data.errorSources
        .map((es: any) => es.message || `${es.path}: invalid value`)
        .join(", ");
    }
    if (data.message) {
      return data.message;
    }
  }
  return error?.message || fallback;
};

export default httpClient;
