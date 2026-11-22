"use server";

import httpClient, { extractErrorMessage } from "@/lib/axios/httpClient";
import {
  IAuthActionResult,
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
const SECURE_SESSION_COOKIE_NAME = "__Secure-better-auth.session_token";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // Matches backend Better Auth 7d expiry

const persistSessionCookie = async (token?: string | null) => {
  if (!token) return;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
};

const clearSessionCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(SECURE_SESSION_COOKIE_NAME);
};

/**
 * Register a new customer
 */
export const registerUser = async (
  payload: IRegisterPayload
): Promise<IAuthActionResult<IAuthResponse>> => {
  try {
    const res = await httpClient.post<IAuthResponse>("/auth/register", payload);
    await persistSessionCookie(res.data?.token);
    return {
      success: true,
      message: res.message || "User registered successfully",
      data: res.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractErrorMessage(error, "Registration failed"),
    };
  }
};

/**
 * Login customer or staff
 */
export const loginUser = async (
  payload: ILoginPayload
): Promise<IAuthActionResult<IAuthResponse>> => {
  try {
    const res = await httpClient.post<IAuthResponse>("/auth/login", payload);
    await persistSessionCookie(res.data?.token);
    return {
      success: true,
      message: res.message || "Logged in successfully",
      data: res.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractErrorMessage(error, "Login failed"),
    };
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
    await clearSessionCookies();
    return res.data || { message: res.message || "Logged out successfully", success: true };
  } catch (error: unknown) {
    await clearSessionCookies();
    return {
      message: extractErrorMessage(error, "Logout failed"),
      success: false,
    };
  }
};

/**
 * Change user password
 */
export const changePassword = async (
  payload: IChangePasswordPayload
): Promise<IAuthActionResult<null>> => {
  try {
    const res = await httpClient.put<{ token?: string }>(
      "/auth/change-password",
      payload
    );
    await persistSessionCookie(res.data?.token);
    return {
      success: true,
      message: res.message || "Password changed successfully",
      data: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractErrorMessage(error, "Failed to change password"),
    };
  }
};

/**
 * Request OTP for email verification
 */
export const requestEmailOtp = async (
  payload: IRequestOtpPayload
): Promise<IAuthActionResult<null>> => {
  try {
    const res = await httpClient.post<null>("/auth/request-email-otp", payload);
    return {
      success: true,
      message: res.message || "Verification OTP sent successfully",
      data: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractErrorMessage(error, "Failed to send email verification OTP"),
    };
  }
};

/**
 * Verify email using received 6-digit OTP
 */
export const verifyEmail = async (
  payload: IVerifyEmailPayload
): Promise<IAuthActionResult<{ token?: string; user?: IUser }>> => {
  try {
    const res = await httpClient.post<{ token?: string; user?: IUser }>(
      "/auth/verify-email",
      payload
    );
    await persistSessionCookie(res.data?.token);
    return {
      success: true,
      message: res.message || "Email verified successfully",
      data: res.data || {},
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractErrorMessage(error, "Failed to verify email OTP"),
    };
  }
};

/**
 * Request password reset OTP to email
 */
export const forgotPassword = async (
  payload: IForgotPasswordPayload
): Promise<IAuthActionResult<null>> => {
  try {
    const res = await httpClient.post<null>("/auth/forget-password", payload);
    return {
      success: true,
      message: res.message || "Password reset OTP sent successfully",
      data: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractErrorMessage(error, "Failed to send password reset OTP"),
    };
  }
};

/**
 * Reset password using email, OTP and new password
 */
export const resetPassword = async (
  payload: IResetPasswordPayload
): Promise<IAuthActionResult<null>> => {
  try {
    const res = await httpClient.post<null>("/auth/reset-password", payload);
    return {
      success: true,
      message: res.message || "Password reset successfully",
      data: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractErrorMessage(error, "Failed to reset password"),
    };
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
