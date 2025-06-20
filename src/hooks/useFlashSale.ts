"use client";

import { useState, useEffect, useCallback } from "react";
import { FlashSale, FlashSaleProduct, FlashSaleProductsResponse, FlashSaleResponse } from "@/types/flashSale";

export const useFlashSale = () => {
  const [activeFlashSale, setActiveFlashSale] = useState<FlashSale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveFlashSale, setHasActiveFlashSale] = useState(false);

  const fetchActiveFlashSale = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/flash-sale/active');
      const data: FlashSaleResponse = await response.json();
      
      if (response.ok) {
        setHasActiveFlashSale(data.hasActiveFlashSale);
        if (data.flashSales && data.flashSales.length > 0) {
          setActiveFlashSale(data.flashSales[0]); // Get first active flash sale
        } else {
          setActiveFlashSale(null);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch active flash sale');
      }
    } catch (err) {
      console.error('Error fetching active flash sale:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHasActiveFlashSale(false);
      setActiveFlashSale(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveFlashSale();
    
    // Refresh every 30 seconds to check for new flash sales or expiry
    const interval = setInterval(fetchActiveFlashSale, 30000);
    
    return () => clearInterval(interval);
  }, [fetchActiveFlashSale]);

  return {
    activeFlashSale,
    hasActiveFlashSale,
    isLoading,
    error,
    refreshFlashSale: fetchActiveFlashSale
  };
};

export const useFlashSaleProducts = (limit: number = 10, category?: string) => {
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: limit
  });

  const fetchFlashSaleProducts = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString()
      });
      
      if (category && category !== 'all') {
        params.append('category', category);
      }
      
      const response = await fetch(`/api/flash-sale/products?${params}`);
      const data: FlashSaleProductsResponse = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
        setFlashSale(data.flashSale);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch flash sale products');
      }
    } catch (err) {
      console.error('Error fetching flash sale products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProducts([]);
      setFlashSale(null);
    } finally {
      setIsLoading(false);
    }
  }, [limit, category]);

  useEffect(() => {
    fetchFlashSaleProducts(1);
  }, [fetchFlashSaleProducts]);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      fetchFlashSaleProducts(pagination.currentPage + 1);
    }
  }, [pagination.hasNextPage, pagination.currentPage, fetchFlashSaleProducts]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      fetchFlashSaleProducts(pagination.currentPage - 1);
    }
  }, [pagination.hasPrevPage, pagination.currentPage, fetchFlashSaleProducts]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchFlashSaleProducts(page);
    }
  }, [pagination.totalPages, fetchFlashSaleProducts]);

  return {
    products,
    flashSale,
    isLoading,
    error,
    pagination,
    nextPage,
    prevPage,
    goToPage,
    refreshProducts: () => fetchFlashSaleProducts(pagination.currentPage)
  };
};
