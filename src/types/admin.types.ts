import { UserRole, UserStatus } from "./auth.types";

export type StaffRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "MODERATOR"
  | "INVENTORY_STAFF"
  | "ACCOUNTANT";

export type FraudRiskLevel = "SAFE" | "MEDIUM_RISK" | "HIGH_RISK";

export interface IAdminProfile {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  userId: string;
}

export interface IStaffUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  image?: string | null;
  bio?: string | null;
  birthdate?: string | null;
  gender?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  savedShoeSize?: string | null;
  loyaltyPoints: number;
  isActive: boolean;
  isBanned: boolean;
  bannedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  admin?: IAdminProfile | null;
}

export interface ICreateStaffPayload {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
  phoneNumber?: string;
  profilePhoto?: string;
  designation?: string;
  permissions?: Record<string, boolean>;
}

export interface IUpdateStaffPayload {
  name?: string;
  phoneNumber?: string;
  profilePhoto?: string;
  role?: StaffRole;
  status?: UserStatus;
  designation?: string;
  permissions?: Record<string, boolean>;
}

export interface IStaffQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: StaffRole;
  status?: UserStatus;
}

export interface IActivityLogActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
  actorId: string;
  actor?: IActivityLogActor;
  createdAt: string;
}

export interface IActivityLogQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  actorId?: string;
  action?: string;
  entity?: string;
}

export interface ICustomerFraudScore {
  id: string;
  phoneNumber: string;
  totalParcels: number;
  deliveredCount: number;
  returnedCount: number;
  successRate: number;
  riskLevel: FraudRiskLevel;
  courierBreakdown?: Record<string, unknown> | null;
  isBlacklisted: boolean;
  blacklistedIp?: string | null;
  blacklistReason?: string | null;
  blacklistedAt?: string | null;
  lastCheckedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlacklistPayload {
  phoneNumber: string;
  reason: string;
  riskLevel?: FraudRiskLevel;
}

export interface IBlacklistQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  riskLevel?: FraudRiskLevel;
}

