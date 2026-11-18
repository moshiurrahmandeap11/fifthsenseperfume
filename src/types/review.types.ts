import { FitType } from "./product.types";

export interface IReview {
  id: string;
  productId: string;
  userId?: string | null;
  orderId?: string | null;
  customerName: string;
  purchasedSize?: string | null;
  rating: number;
  fitFeedback: FitType;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  user?: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
  product?: {
    id: string;
    name: string;
    styleCode: string;
    thumbnailUrl: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReviewPayload {
  productId: string;
  orderId?: string;
  customerName: string;
  purchasedSize?: string;
  rating: number;
  fitFeedback?: FitType;
  comment: string;
  images?: string[];
}

export interface IUpdateReviewStatusPayload {
  isApproved?: boolean;
  isFeatured?: boolean;
}

export interface IProductReviewsSummary {
  averageRating: number;
  totalReviews: number;
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  fitBreakdown: {
    TRUE_TO_SIZE: number;
    RUNS_SMALL: number;
    RUNS_LARGE: number;
    WIDE_FIT: number;
  };
}

export interface IProductReviewsData {
  summary: IProductReviewsSummary;
  reviews: IReview[];
}

export interface IReviewQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isApproved?: boolean | string;
  isFeatured?: boolean | string;
  rating?: number;
  fitFeedback?: FitType;
  productId?: string;
}

