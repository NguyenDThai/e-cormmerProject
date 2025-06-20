export interface FlashSale {
  _id: string;
  name: string;
  description: string;
  startTime: Date | string;
  endTime: Date | string;
  isActive: boolean;
  discountPercent: number;
  products: string[] | FlashSaleProduct[];
  maxQuantityPerUser: number;
  totalSold: number;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FlashSaleProduct {
  _id: string;
  name: string;
  brand: string;
  category: string;
  images: string[];
  price: number;
  salePrice: number;
  quantity: number;
  description: string;
  originalPrice?: number;
  discountPercent?: number;
  discountAmount?: number;
  flashSaleId?: string;
  flashSaleName?: string;
  maxQuantityPerUser?: number;
}

export interface FlashSaleResponse {
  message: string;
  hasActiveFlashSale: boolean;
  flashSales: FlashSale[];
  currentTime: Date | string;
}

export interface FlashSaleProductsResponse {
  message: string;
  products: FlashSaleProduct[];
  flashSale: FlashSale | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  currentTime: Date | string;
}

export interface FlashSaleStats {
  totalFlashSales: number;
  activeFlashSales: number;
  upcomingFlashSales: number;
  expiredFlashSales: number;
  totalProductsInSale: number;
  totalRevenue: number;
}
