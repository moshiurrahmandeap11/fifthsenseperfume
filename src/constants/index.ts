export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
} as const;

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
} as const;

export const SHOE_SIZES = [
  "EU 38",
  "EU 39",
  "EU 40",
  "EU 41",
  "EU 42",
  "EU 43",
  "EU 44",
  "EU 45",
] as const;

export const DEFAULT_PAGE_LIMIT = 10;

