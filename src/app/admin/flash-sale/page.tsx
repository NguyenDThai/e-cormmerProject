/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { FlashSale } from "@/types/flashSale";
import { FlashSaleForm } from "../_components/FlashSaleForm";

const FlashSaleManagement = () => {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFlashSale, setSelectedFlashSale] = useState<FlashSale | null>(
    null
  );

  useEffect(() => {
    fetchFlashSales();
  }, []);

  const fetchFlashSales = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/flash-sale");
      if (!response.ok) {
        throw new Error("Failed to fetch flash sales");
      }
      const data = await response.json();
      setFlashSales(data.flashSales || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/flash-sale/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update flash sale");
      }

      // Refresh the list
      fetchFlashSales();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa flash sale này?")) {
      return;
    }

    try {
      const response = await fetch(`/api/flash-sale/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete flash sale");
      }

      // Refresh the list
      fetchFlashSales();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleCreateNew = () => {
    setSelectedFlashSale(null);
    setIsModalOpen(true);
  };

  const handleEdit = (flashSale: FlashSale) => {
    setSelectedFlashSale(flashSale);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    const url = selectedFlashSale
      ? `/api/flash-sale/${selectedFlashSale._id}`
      : "/api/flash-sale";
    const method = selectedFlashSale ? "PUT" : "POST";

    // Convert local datetime strings to UTC ISO strings for the API
    const apiData = {
      ...data,
      startTime: data.startTime
        ? new Date(data.startTime).toISOString()
        : undefined,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined,
      products: data.productIds,
    };
    delete apiData.productIds;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save flash sale");
      }

      setIsModalOpen(false);
      fetchFlashSales();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
    <div className="container mx-auto p-4 sm:p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Quản lý Flash Sale
        </h1>
        <button
          onClick={handleCreateNew}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm sm:text-base"
        >
          Tạo Flash Sale mới
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              {selectedFlashSale
                ? "Chỉnh sửa Flash Sale"
                : "Tạo Flash Sale mới"}
            </h2>
            <FlashSaleForm
              initialData={selectedFlashSale}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
              isSaving={isSaving}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchFlashSales}
            className="mt-2 text-sm text-red-800 underline hover:no-underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {flashSales.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
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
            <div
              key={flashSale._id}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {flashSale.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          flashSale.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {flashSale.isActive
                          ? "🟢 Đang hoạt động"
                          : "⭕ Tạm dừng"}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        -{flashSale.discountPercent}%
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
                    {flashSale.description}
                  </p>

                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500">Bắt đầu:</span>
                      <p className="font-medium">
                        {formatDate(flashSale.startTime)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Kết thúc:</span>
                      <p className="font-medium">
                        {formatDate(flashSale.endTime)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:ml-4">
                  <button
                    onClick={() =>
                      handleToggleActive(flashSale._id, flashSale.isActive)
                    }
                    className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                      flashSale.isActive
                        ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {flashSale.isActive ? "Tạm dừng" : "Kích hoạt"}
                  </button>

                  <button
                    onClick={() => handleEdit(flashSale)}
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-100 text-blue-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-200 transition-colors flex-1 sm:flex-none"
                  >
                    Chỉnh sửa
                  </button>

                  <button
                    onClick={() => handleDelete(flashSale._id)}
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-red-100 text-red-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-200 transition-colors flex-1 sm:flex-none"
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
