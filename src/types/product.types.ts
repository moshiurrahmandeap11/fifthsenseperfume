import { ISizeChart } from "./sizeChart.types";

export type ProductGender = "MEN" | "WOMEN" | "KIDS" | "UNISEX";

export type FitType =
  | "TRUE_TO_SIZE"
  | "RUNS_SMALL"
  | "RUNS_LARGE"
  | "WIDE_FIT";

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface IProductVariant {
  id: string;
  productId: string;
  productColorId: string;
  size: string;
  ukSize?: string | null;
  usSize?: string | null;
  footLengthCm?: number | null;
  sku: string;
  barcode?: string | null;
  stockQuantity: number;
  showroomStock: number;
  lowStockThreshold: number;
  priceOverride?: number | null;
  salePriceOverride?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProductColor {
  id: string;
  productId: string;
  colorName: string;
  colorHex?: string | null;
  images: string[];
  videoUrl?: string | null;
  isDefault: boolean;
  sortOrder: number;
  variants: IProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface IProductCrossSellItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  discountPrice?: number | null;
  thumbnailUrl: string;
}

export interface IProductCrossSell {
  id: string;
  mainProductId: string;
  addonProductId: string;
  addonProduct: IProductCrossSellItem;
  bundleDiscount: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface IProductReviewUser {
  id: string;
  name: string;
  image?: string | null;
}

export interface IProductReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: IProductReviewUser;
}

export interface IProduct {
  id: string;
  name: string;
  nameBn?: string | null;
  slug: string;
  styleCode: string;
  shortDescription?: string | null;
  description: string;
  specifications?: Record<string, unknown> | null;

  // Shoe specific attributes
  gender: ProductGender;
  fitType: FitType;
  upperMaterial?: string | null;
  soleMaterial?: string | null;
  insoleType?: string | null;
  heelHeight?: string | null;
  closureType?: string | null;
  warrantyDays: number;

  // Pricing
  costPrice: number;
  basePrice: number;
  discountPrice?: number | null;

  // Media
  thumbnailUrl: string;
  videoUrl?: string | null;

  // Merchandising & Stock Flags
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isBrokenSize: boolean;
  isDeleted: boolean;

  // Relations
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  sizeChartId?: string | null;
  sizeChart?: ISizeChart | null;

  colors: IProductColor[];
  variants?: IProductVariant[];
  crossSells?: IProductCrossSell[];
  reviews?: IProductReview[];
  _count?: {
    reviews?: number;
    wishlists?: number;
  };

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ICreateVariantInput {
  id?: string;
  size: string;
  ukSize?: string;
  usSize?: string;
  footLengthCm?: number;
  sku?: string;
  barcode?: string;
  stockQuantity: number;
  showroomStock?: number;
  lowStockThreshold?: number;
  priceOverride?: number;
  salePriceOverride?: number;
  isActive?: boolean;
}

export interface ICreateColorInput {
  id?: string;
  colorName: string;
  colorHex?: string;
  images: string[];
  videoUrl?: string;
  isDefault?: boolean;
  sortOrder?: number;
  variants: ICreateVariantInput[];
}

export interface ICreateProductPayload {
  name: string;
  nameBn?: string;
  slug?: string;
  styleCode: string;
  shortDescription?: string;
  description: string;
  specifications?: Record<string, unknown>;

  gender?: ProductGender;
  fitType?: FitType;
  upperMaterial?: string;
  soleMaterial?: string;
  insoleType?: string;
  heelHeight?: string;
  closureType?: string;
  warrantyDays?: number;

  costPrice: number;
  basePrice: number;
  discountPrice?: number;

  thumbnailUrl?: string;
  videoUrl?: string;

  status?: ProductStatus;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;

  categoryId: string;
  sizeChartId?: string;

  crossSellProductIds?: string[];
  colors: ICreateColorInput[];
}

export interface IUpdateProductPayload extends Partial<ICreateProductPayload> {
  isBrokenSize?: boolean;
}

export interface IProductQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  gender?: ProductGender;
  status?: ProductStatus;
  fitType?: FitType;
  categoryId?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean | string;
  isFeatured?: boolean | string;
  isNewArrival?: boolean | string;
  isBestSeller?: boolean | string;
  isBrokenSize?: boolean | string;
}

export interface IShopBySizeQueryParams {
  size: string;
  gender?: ProductGender;
  page?: number;
  limit?: number;
}

