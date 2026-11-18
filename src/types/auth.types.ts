export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "MODERATOR"
  | "INVENTORY_STAFF"
  | "ACCOUNTANT"
  | "CUSTOMER";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface IUser {
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
  gender?: Gender | null;
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
  admin?: Record<string, unknown> | null;
  addresses?: Array<Record<string, unknown>>;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  birthdate?: string;
  gender?: Gender;
  address?: string;
  savedShoeSize?: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface IRequestOtpPayload {
  email: string;
}

export interface IVerifyEmailPayload {
  email: string;
  otp: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}

export interface IMessageResponse {
  message: string;
  success?: boolean;
}
