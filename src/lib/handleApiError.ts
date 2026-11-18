import toast from "react-hot-toast";

/**
 * Interface representing standard API Error Response from backend
 */
export interface ApiErrorPayload {
  success?: boolean;
  message?: string;
  errorMessages?: Array<{
    path?: string | number;
    message: string;
  }>;
  stack?: string;
}

/**
 * Centralized API Error Handler
 * Extracts human-readable error messages from backend responses,
 * re-throws Next.js redirect signals, logs during development,
 * and triggers a react-hot-toast error toast.
 *
 * @param error - The caught error (AxiosError, Error, string, etc.)
 * @param defaultMessage - Optional fallback message
 * @returns The resolved error message string
 */
export const handleApiError = (
  error: unknown,
  defaultMessage: string = "Something went wrong. Please try again."
): string => {
  // 1. Never intercept Next.js redirect exceptions
  if (
    error &&
    typeof error === "object" &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  ) {
    throw error;
  }

  let resolvedMessage = defaultMessage;

  // 2. Extract error from Axios response
  const axiosError = error as {
    response?: {
      data?: ApiErrorPayload;
      status?: number;
    };
    message?: string;
  };

  if (axiosError?.response?.data) {
    const data = axiosError.response.data;

    // Check Zod validation error messages array
    if (Array.isArray(data.errorMessages) && data.errorMessages.length > 0) {
      resolvedMessage = data.errorMessages
        .map((err) => (err.path ? `${err.path}: ${err.message}` : err.message))
        .join(", ");
    }
    // Check backend AppError message
    else if (data.message && typeof data.message === "string") {
      resolvedMessage = data.message;
    }
  }
  // 3. Fallback to standard JavaScript Error message
  else if (error instanceof Error && error.message) {
    resolvedMessage = error.message;
  }
  // 4. Fallback to string error
  else if (typeof error === "string") {
    resolvedMessage = error;
  }

  // 5. Development debugging
  if (process.env.NODE_ENV !== "production") {
    console.error("[API_ERROR]:", resolvedMessage, error);
  }

  // 6. Display hot toast in browser environment safely
  if (typeof window !== "undefined") {
    toast.error(resolvedMessage, {
      id: resolvedMessage, // Prevents duplicate spam toasts
      duration: 4000,
      position: "top-right",
    });
  }

  return resolvedMessage;
};

/**
 * Helper to show consistent success toast
 */
export const handleApiSuccess = (message: string): void => {
  if (typeof window !== "undefined") {
    toast.success(message, {
      id: message,
      duration: 3000,
      position: "top-right",
    });
  }
};

export default handleApiError;

