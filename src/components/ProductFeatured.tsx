"use client";
import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useFlashSaleProducts } from "@/hooks/useFlashSale";
import FlashSaleProductCard from "@/components/FlashSaleProductCard";

const ProductFeatured = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { products, isLoading, error, flashSale } = useFlashSaleProducts(8); // Lấy 8 sản phẩm

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative">
        <div className="grid grid-flow-col auto-cols-[minmax(300px,1fr)] gap-8 overflow-x-hidden py-4 px-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Không thể tải sản phẩm flash sale</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (!products || products.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Hiện tại không có flash sale nào</p>
            <p className="text-sm text-gray-400">Hãy quay lại sau để không bỏ lỡ các deal hấp dẫn!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Flash Sale Info */}
      {flashSale && (
        <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-800">{flashSale.name}</h3>
              <p className="text-sm text-red-600">{flashSale.description}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Giảm {flashSale.discountPercent}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Left Arrow */}
      {products.length > 4 && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Products Container */}
      <div
        ref={scrollContainerRef}
        className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-2"
      >
        {products.map((product) => (
          <FlashSaleProductCard
            key={product._id}
            product={product}
            discountPercent={flashSale?.discountPercent || 0}
          />
        ))}
      </div>

      {/* Right Arrow */}
      {products.length > 4 && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default ProductFeatured;
