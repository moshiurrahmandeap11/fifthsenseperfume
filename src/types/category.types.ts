export interface ICategory {
  id: string;
  name: string;
  nameBn?: string | null;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId?: string | null;
  parent?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  children?: ICategory[];
  _count?: {
    products: number;
    children?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCategoryPayload {
  name: string;
  nameBn?: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
  parentId?: string | null;
}

export interface IUpdateCategoryPayload {
  name?: string;
  nameBn?: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
  parentId?: string | null;
}

export interface ICategoryQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean | string;
  parentId?: string | null;
  tree?: boolean | string;
}

