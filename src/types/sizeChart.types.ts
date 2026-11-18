export interface ISizeChartRow {
  euSize: string;
  ukSize?: string;
  usSize?: string;
  footLengthCm?: number;
  footLengthInch?: number;
}

export interface ISizeChart {
  id: string;
  title: string;
  description?: string | null;
  guideImage?: string | null;
  rows: ISizeChartRow[];
  _count?: {
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSizeChartPayload {
  title: string;
  description?: string;
  guideImage?: string;
  rows: ISizeChartRow[];
}

export interface IUpdateSizeChartPayload {
  title?: string;
  description?: string;
  guideImage?: string;
  rows?: ISizeChartRow[];
}

export interface ISizeChartQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

