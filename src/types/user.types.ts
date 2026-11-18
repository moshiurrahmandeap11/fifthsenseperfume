import { Gender, UserRole, UserStatus } from "./auth.types";

export type DeliveryZone =
  | "INSIDE_DHAKA"
  | "DHAKA_SUB_AREA"
  | "OUTSIDE_DHAKA";

export interface ICustomerAddress {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  division: string;
  district: string;
  thana: string;
  fullAddress: string;
  deliveryZone: DeliveryZone;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAddressPayload {
  label?: string;
  recipientName: string;
  phoneNumber: string;
  division: string;
  district: string;
  thana: string;
  fullAddress: string;
  deliveryZone?: DeliveryZone;
  isDefault?: boolean;
}

export interface IUpdateAddressPayload {
  label?: string;
  recipientName?: string;
  phoneNumber?: string;
  division?: string;
  district?: string;
  thana?: string;
  fullAddress?: string;
  deliveryZone?: DeliveryZone;
  isDefault?: boolean;
}

export interface IUpdateProfilePayload {
  name?: string;
  phoneNumber?: string;
  gender?: Gender;
  birthdate?: string;
  address?: string;
  savedShoeSize?: string;
  image?: string;
  bio?: string;
}

export interface ICustomerCount {
  orders: number;
  reviews?: number;
  wishlists?: number;
}

export interface ICustomerRecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface ICustomerProfile {
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
  addresses?: ICustomerAddress[];
  orders?: ICustomerRecentOrder[];
  _count?: ICustomerCount;
}

export interface ICustomerQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: UserStatus;
  savedShoeSize?: string;
}

