"use client";

import React, { useState, useEffect } from "react";
import { FlashSale } from "@/types/flashSale";

const FlashSaleManagement = () => {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlashSales();
  }, []);

  const fetchFlashSales = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/flash-sale');
      if (!response.ok) {
        throw new Error('Failed to fetch flash sales');
      }
      const data = await response.json();
      setFlashSales(data.flashSales || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/flash-sale/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update flash sale');
      }

      // Refresh the list
      fetchFlashSales();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa flash sale này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/flash-sale/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete flash sale');
      }

      // Refresh the list
      fetchFlashSales();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Flash Sale</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Tạo Flash Sale mới
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchFlashSales}
            className="mt-2 text-sm text-red-800 underline hover:no-underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {flashSales.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium mb-2">Chưa có Flash Sale nào</h3>
            <p className="text-sm text-gray-400">
              Tạo flash sale đầu tiên để bắt đầu tăng doanh số!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {flashSales.map((flashSale) => (
            <div key={flashSale._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {flashSale.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      flashSale.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {flashSale.isActive ? '🟢 Đang hoạt động' : '⭕ Tạm dừng'}
                    </span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      -{flashSale.discountPercent}%
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{flashSale.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Bắt đầu:</span>
                      <p className="font-medium">{formatDate(flashSale.startTime)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Kết thúc:</span>
                      <p className="font-medium">{formatDate(flashSale.endTime)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Đã bán:</span>
                      <p className="font-medium text-orange-600">{flashSale.totalSold} sản phẩm</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Giới hạn/khách:</span>
                      <p className="font-medium">{flashSale.maxQuantityPerUser} sản phẩm</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(flashSale._id, flashSale.isActive)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      flashSale.isActive
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {flashSale.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>
                  
                  <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                    Chỉnh sửa
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(flashSale._id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashSaleManagement;
