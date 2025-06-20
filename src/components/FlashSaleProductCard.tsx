"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FlashSaleProduct } from "@/types/flashSale";

interface FlashSaleProductCardProps {
  product: FlashSaleProduct;
  discountPercent: number;
}

const FlashSaleProductCard: React.FC<FlashSaleProductCardProps> = ({ 
  product, 
  discountPercent 
}) => {
  const originalPrice = product.price;
  const discountedPrice = originalPrice * (1 - discountPercent / 100);
  const savings = originalPrice - discountedPrice;

  return (
    <Link href={`/product/${product._id}`}>
      <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        {/* Flash Sale Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
            -{discountPercent}%
          </span>
        </div>
        
        {/* Savings Badge */}
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-yellow-400 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
            Tiết kiệm {savings.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Category */}
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          
          {/* Price Section */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-red-600">
                {discountedPrice.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-sm text-gray-500 line-through">
                {originalPrice.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className="text-xs text-green-600 font-medium">
              Giảm {savings.toLocaleString('vi-VN')}đ
            </div>
          </div>

          {/* Stock Info */}
          {product.quantity <= 10 && product.quantity > 0 && (
            <div className="mt-2">
              <span className="text-xs text-orange-600 font-medium">
                ⚠️ Chỉ còn {product.quantity} sản phẩm
              </span>
            </div>
          )}
          
          {product.quantity === 0 && (
            <div className="mt-2">
              <span className="text-xs text-red-600 font-medium">
                ❌ Hết hàng
              </span>
            </div>
          )}

          {/* Flash Sale Indicator */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Flash Sale</span>
              <span className="text-red-500 font-medium animate-pulse">
                🔥 Deal HOT
              </span>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-200 rounded-lg pointer-events-none transition-colors duration-300"></div>
      </div>
    </Link>
  );
};

export default FlashSaleProductCard;
