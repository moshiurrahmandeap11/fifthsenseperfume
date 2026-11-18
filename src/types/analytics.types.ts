export interface IDashboardRevenue {
  total: number;
  thisMonth: number;
  today: number;
}

export interface IDashboardOrders {
  total: number;
  delivered: number;
  shipped: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  returned: number;
  todayCount: number;
}

export interface IDashboardRates {
  deliverySuccessRate: number;
  returnRate: number;
  incompleteCartConversionRate: number;
}

export interface IDashboardOperationalAlerts {
  lowStockVariantsCount: number;
  pendingExchangesCount: number;
  unreconciledShipmentsCount: number;
  unresolvedIncompleteOrdersCount: number;
}

export interface IDashboardRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface IDashboardDailySalesTrend {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface IDashboardAnalyticsResult {
  revenue: IDashboardRevenue;
  orders: IDashboardOrders;
  rates: IDashboardRates;
  operationalAlerts: IDashboardOperationalAlerts;
  recentOrders: IDashboardRecentOrder[];
  dailySalesTrend: IDashboardDailySalesTrend[];
}

export interface ISizeDemandItem {
  size: string;
  totalPairsSold: number;
  percentageOfTotal: number;
  totalStockAvailable: number;
  brokenStockVariantCount: number;
}

export interface ISizeDemandResult {
  totalFootwearSold: number;
  sizeCurve: ISizeDemandItem[];
  recommendedFactoryProductionRatio: Record<string, string>;
}

export interface INetProfitExpenses {
  adSpend: number;
  courierLoss: number;
  packagingCost: number;
  operationalCost: number;
  totalExpenses: number;
}

export interface INetProfitResult {
  period: {
    startDate: string;
    endDate: string;
  };
  grossRevenue: number;
  cogs: number;
  grossProfit: number;
  expenses: INetProfitExpenses;
  netProfit: number;
  netProfitMargin: number;
}

export interface IModeratorPerformanceItem {
  staffId: string;
  staffName: string;
  email: string;
  role: string;
  confirmedOrdersCount: number;
  packedOrdersCount: number;
  incompleteConvertedCount: number;
  totalOrdersHandled: number;
  conversionRate: number;
}

export interface INetProfitQueryParams {
  startDate?: string;
  endDate?: string;
}

