export type StockMovementType =
  | "FACTORY_IN"
  | "ORDER_DEDUCT"
  | "ORDER_CANCEL_RESTOCK"
  | "EXCHANGE_RESERVE"
  | "RETURN_QC_RESTOCK"
  | "DAMAGED"
  | "MANUAL_ADJUSTMENT"
  | "SHOWROOM_SYNC";

export interface ISizeMatrixVariant {
  id: string;
  size: string;
  sku: string;
  barcode?: string | null;
  stockQuantity: number;
  showroomStock: number;
  lowStockThreshold: number;
  priceOverride?: number | null;
  salePriceOverride?: number | null;
}

export interface ISizeMatrixColor {
  id?: string;
  colorName: string;
  colorHex?: string | null;
  variants: ISizeMatrixVariant[];
}

export interface ISizeMatrixProduct {
  id: string;
  name: string;
  styleCode: string;
  isBrokenSize: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  colors: ISizeMatrixColor[];
}

export interface ISizeMatrixQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  categoryId?: string;
  status?: string;
  gender?: string;
}

export interface IQuickStockUpdatePayload {
  variantId: string;
  newStockQuantity: number;
  showroomStock?: number;
  type?: StockMovementType;
  note?: string;
}

export interface ILowStockAlertVariant {
  id: string;
  size: string;
  sku: string;
  barcode?: string | null;
  stockQuantity: number;
  showroomStock: number;
  lowStockThreshold: number;
  product: {
    id: string;
    name: string;
    styleCode: string;
    basePrice: number;
    isBrokenSize: boolean;
  };
  productColor: {
    id: string;
    colorName: string;
    images: string[];
  };
}

export interface ILowStockAlertQueryParams {
  page?: number;
  limit?: number;
  threshold?: number;
}

export interface IStockMovementActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IStockMovement {
  id: string;
  variantId: string;
  variant?: {
    id: string;
    size: string;
    sku: string;
    product: {
      id: string;
      name: string;
      styleCode: string;
    };
    productColor: {
      colorName: string;
    };
  };
  type: StockMovementType;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  referenceId?: string | null;
  note?: string | null;
  actorId?: string | null;
  actor?: IStockMovementActor | null;
  createdAt: string;
}

export interface IStockMovementQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  type?: StockMovementType;
  variantId?: string;
  actorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface IFactoryStockInItem {
  variantId: string;
  quantity: number;
  unitCostPrice?: number;
}

export interface IFactoryStockInPayload {
  items: IFactoryStockInItem[];
  shipmentReference?: string;
  note?: string;
}

export interface IFactoryStockInResponse {
  totalItemsCount: number;
  totalQuantityReceived: number;
  shipmentReference?: string;
  variants: Array<{
    id: string;
    size: string;
    stockQuantity: number;
    product: {
      name: string;
      styleCode: string;
    };
    productColor: {
      colorName: string;
    };
  }>;
}

export interface IBarcodeLabelData {
  productName: string;
  nameBn?: string | null;
  styleCode: string;
  color: string;
  size: string;
  ukSize?: string | null;
  usSize?: string | null;
  footLengthCm?: number | null;
  sku: string;
  barcode: string;
  mrp: number;
  salePrice?: number | null;
  upperMaterial?: string | null;
  soleMaterial?: string | null;
  currency: string;
  brand: string;
  origin: string;
}

