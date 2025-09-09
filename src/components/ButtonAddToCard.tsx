"use client";
import { useAppContext } from "@/context/AppProvider";
import { ShoppingCartIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ButtonAddToCardProps {
  productId: string;
  quanlity: number;
}

const ButtonAddToCard = ({ productId, quanlity }: ButtonAddToCardProps) => {
  const { quantity, fetchCart } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (quanlity === 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        // Hiển thị thông báo thành công
        toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
        fetchCart();
      } else if (response.status === 401) {
        toast.error("Vui lòng dăng nhập để thêm sản phẩm vào giỏ hàng");
      } else if (response.status === 400) {
        toast.error("Sản phẩm đã hết hàng");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <button
      className={`relative w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
        quanlity === 0
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:to-purple-900 active:scale-95 cursor-pointer"
      } shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white `}
      onClick={handleAddToCart}
      disabled={quanlity === 0 || isAdding}
    >
      {/* Hiệu ứng loading */}
      {isAdding && (
        <div className="absolute inset-0 bg-white opacity-30 animate-pulse rounded-xl"></div>
      )}

      {/* Icon giỏ hàng với animation */}
      <div
        className={`transition-transform ${
          isAdding ? "scale-110" : "scale-100"
        }`}
      >
        <ShoppingCartIcon className="w-5 h-5 flex-shrink-0" />
      </div>

      {/* Text */}
      <span className="text-sm sm:text-base font-medium">
        {isAdding
          ? "Đang thêm..."
          : quanlity === 0
          ? "Hết hàng"
          : "Thêm vào giỏ hàng"}
      </span>
    </button>
  );
};

export default ButtonAddToCard;
