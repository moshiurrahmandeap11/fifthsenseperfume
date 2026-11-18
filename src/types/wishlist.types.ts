export interface IWishlistProductVariant {
  id: string;
  size: string;
  stockQuantity: number;
  sku: string;
}

export interface IWishlistProductColor {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  variants: IWishlistProductVariant[];
}

export interface IWishlistProduct {
  id: string;
  name: string;
  slug: string;
  styleCode: string;
  basePrice: number;
  thumbnailUrl: string;
  gender: string;
  fitType: string;
  status: string;
  colors: IWishlistProductColor[];
}

export interface IWishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: IWishlistProduct;
}

export interface IToggleWishlistPayload {
  productId: string;
}

export interface IToggleWishlistResult {
  inWishlist: boolean;
  productId: string;
  message: string;
}

export interface IWishlistQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

