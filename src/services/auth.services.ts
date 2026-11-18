"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient from "@/lib/axios/httpClient";
import {
  IAuthResponse,
  IChangePasswordPayload,
  IForgotPasswordPayload,
  ILoginPayload,
  IMessageResponse,
  IRegisterPayload,
  IRequestOtpPayload,
  IResetPasswordPayload,
  IUser,
  IVerifyEmailPayload,
} from "@/types/auth.types";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "better-auth.session_token";

/**
 * Register a new customer
 */
export const registerUser = async (
  payload: IRegisterPayload
): Promise<IAuthResponse> => {
  try {
    const res = await httpClient.post<IAuthResponse>("/auth/register", payload);

    if (res.data?.token) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, res.data.token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "Registration failed";
    throw new Error(message);
  }
};

/**
 * Login customer or staff
 */
export const loginUser = async (
  payload: ILoginPayload
): Promise<IAuthResponse> => {
  try {
    const res = await httpClient.post<IAuthResponse>("/auth/login", payload);

    if (res.data?.token) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, res.data.token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "Login failed";
    throw new Error(message);
  }
};

/**
 * Get current authenticated user profile & session
 */
export const getMe = async (): Promise<IUser | null> => {
  try {
    const res = await httpClient.get<IUser>("/auth/me");
    return res.data ?? null;
  } catch {
    return null;
  }
};

/**
 * Logout current user and clear session cookies
 */
export const logoutUser = async (): Promise<IMessageResponse> => {
  try {
    const res = await httpClient.post<IMessageResponse>("/auth/logout");

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return res.data || { message: "Logged out successfully" };
  } catch (error: any) {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    const message =
      error?.response?.data?.message || error?.message || "Logout failed";
    return { message, success: false };
  }
};

/**
 * Change user password
 */
export const changePassword = async (
  payload: IChangePasswordPayload
): Promise<IMessageResponse> => {
  try {
    const res = await httpClient.put<IMessageResponse>(
      "/auth/change-password",
      payload
    );
    return res.data || { message: "Password changed successfully" };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to change password";
    throw new Error(message);
  }
};

/**
 * Request OTP for email verification
 */
export const requestEmailOtp = async (
  payload: IRequestOtpPayload
): Promise<IMessageResponse> => {
  try {
    const res = await httpClient.post<IMessageResponse>(
      "/auth/request-email-otp",
      payload
    );
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to send email verification OTP";
    throw new Error(message);
  }
};

/**
 * Verify email using received 6-digit OTP
 */
export const verifyEmail = async (
  payload: IVerifyEmailPayload
): Promise<IMessageResponse> => {
  try {
    const res = await httpClient.post<IMessageResponse>(
      "/auth/verify-email",
      payload
    );
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to verify email OTP";
    throw new Error(message);
  }
};

/**
 * Request password reset OTP to email
 */
export const forgotPassword = async (
  payload: IForgotPasswordPayload
): Promise<IMessageResponse> => {
  try {
    const res = await httpClient.post<IMessageResponse>(
      "/auth/forget-password",
      payload
    );
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to send password reset OTP";
    throw new Error(message);
  }
};

/**
 * Reset password using email, OTP and new password
 */
export const resetPassword = async (
  payload: IResetPasswordPayload
): Promise<IMessageResponse> => {
  try {
    const res = await httpClient.post<IMessageResponse>(
      "/auth/reset-password",
      payload
    );
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to reset password";
    throw new Error(message);
  }
};

/**
 * Get Google OAuth Login URL
 */
export const getGoogleLoginUrl = async (): Promise<string> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
  return `${baseUrl}/auth/login/google`;
};

