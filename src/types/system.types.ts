export type BannerPosition =
  | "HERO_SLIDER"
  | "PROMO_BANNER"
  | "ANNOUNCEMENT_BAR"
  | "CATEGORY_BANNER";

export interface IBanner {
  id: string;
  title: string;
  titleBn: string | null;
  subtitle: string | null;
  subtitleBn: string | null;
  imageUrl: string;
  mobileImgUrl: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBannerPayload {
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  imageUrl?: string;
  mobileImgUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  position?: BannerPosition;
  sortOrder?: number;
  isActive?: boolean;
}

export interface IUpdateBannerPayload {
  title?: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  imageUrl?: string;
  mobileImgUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  position?: BannerPosition;
  sortOrder?: number;
  isActive?: boolean;
}

export interface IBannerQueryParams {
  searchTerm?: string;
  position?: BannerPosition;
  isActive?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IShowroomLocation {
  id: string;
  name: string;
  district: string;
  thana: string;
  fullAddress: string;
  phoneNumber: string;
  googleMapUrl: string | null;
  openingHours: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateShowroomPayload {
  name: string;
  district: string;
  thana: string;
  fullAddress: string;
  phoneNumber: string;
  googleMapUrl?: string;
  openingHours?: string;
  isActive?: boolean;
}

export interface IUpdateShowroomPayload {
  name?: string;
  district?: string;
  thana?: string;
  fullAddress?: string;
  phoneNumber?: string;
  googleMapUrl?: string;
  openingHours?: string;
  isActive?: boolean;
}

export interface IShowroomQueryParams {
  searchTerm?: string;
  district?: string;
  isActive?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPlatformSettings {
  id: string;
  brandName: string;
  brandNameBn: string | null;
  brandSlug?: string | null;
  tagline?: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  footerDescription?: string | null;
  supportPhone: string | null;
  whatsappNumber: string | null;
  messengerLink: string | null;
  announcementText: string | null;
  announcementTextBn: string | null;
  insideDhakaShipping: number;
  dhakaSubAreaShipping: number;
  outsideDhakaShipping: number;
  freeShippingThreshold: number | null;
  enabledPaymentMethods?: string[];
  loyaltyPointsPer100Bdt?: number;
  loyaltyPointValueBdt?: number;
  metaPixelId: string | null;
  metaCapiAccessToken: string | null;
  sendCapiOnConfirmOnly: boolean;
  tiktokPixelId: string | null;
  exchangeWindowDays: number;
  maintenanceMode: boolean;
  updatedAt: string;
}

export interface IUpdatePlatformSettingsPayload {
  brandName?: string;
  brandNameBn?: string;
  brandSlug?: string;
  tagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  footerDescription?: string;
  supportPhone?: string;
  whatsappNumber?: string;
  messengerLink?: string;
  announcementText?: string;
  announcementTextBn?: string;
  insideDhakaShipping?: number;
  dhakaSubAreaShipping?: number;
  outsideDhakaShipping?: number;
  freeShippingThreshold?: number | null;
  enabledPaymentMethods?: string[];
  loyaltyPointsPer100Bdt?: number;
  loyaltyPointValueBdt?: number;
  metaPixelId?: string;
  metaCapiAccessToken?: string;
  sendCapiOnConfirmOnly?: boolean;
  tiktokPixelId?: string;
  exchangeWindowDays?: number;
  maintenanceMode?: boolean;
}

