import { IProduct } from "./product.types";

export type DiscountType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

export interface ICoupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  minPairCount: number;
  maxDiscountAmount?: number | null;
  onlyPrepaid: boolean;
  startsAt: string;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IApplyCouponPayload {
  code: string;
  cartSubtotal: number;
  totalPairs?: number;
  isPrepaid?: boolean;
}

export interface IApplyCouponResult {
  isValid: boolean;
  couponId: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  finalPayable: number;
  message?: string;
}

export interface ICreateCouponPayload {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  minPairCount?: number;
  maxDiscountAmount?: number | null;
  onlyPrepaid?: boolean;
  startsAt?: string;
  expiresAt?: string | null;
  usageLimit?: number | null;
  isActive?: boolean;
}

export interface IUpdateCouponPayload {
  code?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minOrderAmount?: number;
  minPairCount?: number;
  maxDiscountAmount?: number | null;
  onlyPrepaid?: boolean;
  startsAt?: string;
  expiresAt?: string | null;
  usageLimit?: number | null;
  isActive?: boolean;
}

export interface ICouponQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  discountType?: DiscountType;
  isActive?: boolean | string;
}

export interface IFlashSaleItemInput {
  productId: string;
  flashSalePrice: number;
  sortOrder?: number;
}

export interface IFlashSaleItem {
  id: string;
  flashSaleId: string;
  productId: string;
  flashSalePrice: number;
  sortOrder: number;
  product: {
    id: string;
    name: string;
    slug: string;
    styleCode: string;
    basePrice: number;
    thumbnailUrl: string;
    gender: string;
    colors?: Array<{
      id: string;
      colorName: string;
      images: string[];
      variants: Array<{
        id: string;
        size: string;
        stockQuantity: number;
      }>;
    }>;
  };
}

export interface IFlashSale {
  id: string;
  title: string;
  titleBn?: string | null;
  slug: string;
  bannerImage?: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  items: IFlashSaleItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateFlashSalePayload {
  title: string;
  titleBn?: string;
  slug?: string;
  bannerImage?: string;
  startsAt: string;
  endsAt: string;
  isActive?: boolean;
  items?: IFlashSaleItemInput[];
}

export interface IUpdateFlashSalePayload {
  title?: string;
  titleBn?: string;
  slug?: string;
  bannerImage?: string;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
  items?: IFlashSaleItemInput[];
}

export interface IFlashSaleQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean | string;
}

export interface ICampaignLandingPage {
  id: string;
  title: string;
  slug: string;
  productId: string;
  headline: string;
  subheadline?: string | null;
  heroVideoUrl?: string | null;
  bannerImages: string[];
  featureBullets: string[];
  offerPrice?: number | null;
  freeDelivery: boolean;
  showSizeChart: boolean;
  isActive: boolean;
  product?: IProduct;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateLandingPagePayload {
  title: string;
  slug?: string;
  productId: string;
  headline: string;
  subheadline?: string;
  heroVideoUrl?: string;
  bannerImages?: string[];
  featureBullets?: string[];
  offerPrice?: number | null;
  freeDelivery?: boolean;
  showSizeChart?: boolean;
  isActive?: boolean;
}

export interface IUpdateLandingPagePayload {
  title?: string;
  slug?: string;
  productId?: string;
  headline?: string;
  subheadline?: string;
  heroVideoUrl?: string;
  bannerImages?: string[];
  featureBullets?: string[];
  offerPrice?: number | null;
  freeDelivery?: boolean;
  showSizeChart?: boolean;
  isActive?: boolean;
}

export interface ILandingPageQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  productId?: string;
  isActive?: boolean | string;
}

export interface ITestCapiPayload {
  eventName: "Purchase" | "InitiateCheckout" | "ViewContent" | "AddToCart";
  orderId?: string;
  customerPhone?: string;
  customerEmail?: string;
  amount?: number;
  fbp?: string;
  fbc?: string;
}

