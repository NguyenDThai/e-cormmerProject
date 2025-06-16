/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProductStats {
  totalProducts: number;
  categories: { name: string; count: number }[];
}
const ProductStatistics = () => {
  const [allProducts, setAllProducts] = useState<ProductStats | null>(null);

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const response = await fetch("/api/statistics/products");
        const data = await response.json();
        if (response.ok) {
          setAllProducts(data);
        } else {
          throw new Error(
            data.error || "Không thể lấy dữ liệu thống kê sản phẩm"
          );
        }
      } catch (error: any) {
        toast.error(`Lỗi: ${error.message}`);
      }
    };
    fetchProductStats();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Thống kê sản phẩm
        </h2>

        <div className="bg-blue-50 rounded-lg p-5 mb-6">
          <p className="text-xl text-gray-700 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Tổng số sản phẩm:
            <span className="font-bold text-blue-600 ml-2 text-2xl">
              {allProducts?.totalProducts}
            </span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 px-5 py-3 border-b border-gray-200 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Theo danh mục
          </h3>

          <ul className="divide-y divide-gray-200">
            {allProducts?.categories.map((category) => (
              <Link
                key={category.name}
                href={`/product?category=${category.name}`}
              >
                <li className="px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{category.name}</span>
                    <span className="font-bold text-gray-900 bg-blue-100 px-3 py-1 rounded-full text-sm">
                      {category.count}
                    </span>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductStatistics;
