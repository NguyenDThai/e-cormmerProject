"use client";

import React from "react";
import { FlashSale } from "@/types/flashSale";

interface FlashSaleSectionHeaderProps {
  flashSale?: FlashSale | null;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const FlashSaleSectionHeader: React.FC<FlashSaleSectionHeaderProps> = ({ 
  flashSale, 
  isLoading, 
  error, 
  onRetry 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="w-[20px] h-[40px] bg-red-600 block rounded-md"></span>
          <div className="ml-4">
            <p className="text-lg text-red-500 font-medium">
              {isLoading ? "Đang tải..." : "Flash Sale"}
            </p>
            {flashSale && (
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {flashSale.name}
              </h2>
            )}
          </div>
        </div>
        
        {/* Flash Sale Status */}
        {flashSale && (
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              flashSale.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {flashSale.isActive ? '🟢 Đang diễn ra' : '⭕ Không hoạt động'}
            </span>
            
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold animate-pulse">
              🔥 Giảm {flashSale.discountPercent}%
            </span>
          </div>
        )}
      </div>
      
      {/* Description and Stats */}
      {flashSale && (
        <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              {flashSale.description && (
                <p className="text-gray-700 mb-2">{flashSale.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {flashSale.totalSold > 0 && (
                  <div className="flex items-center text-orange-600">
                    <span className="mr-1">🔥</span>
                    <span>Đã bán: <strong>{flashSale.totalSold}</strong> sản phẩm</span>
                  </div>
                )}
                
                {flashSale.maxQuantityPerUser && (
                  <div className="flex items-center text-blue-600">
                    <span className="mr-1">👤</span>
                    <span>Tối đa: <strong>{flashSale.maxQuantityPerUser}</strong> sản phẩm/khách</span>
                  </div>
                )}
                
                <div className="flex items-center text-green-600">
                  <span className="mr-1">⏰</span>
                  <span>Flash Sale đặc biệt - Số lượng có hạn!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-600">
              ⚠️ Không thể tải thông tin Flash Sale: {error}
            </p>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="text-sm text-red-800 underline hover:no-underline font-medium"
              >
                Thử lại
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSaleSectionHeader;
