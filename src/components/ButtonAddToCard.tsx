"use client";
import { useAppContext } from "@/context/AppProvider";
import { ShoppingCartIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface ButtonAddToCardProps {
  productId: string;
}

const ButtonAddToCard = ({ productId }: ButtonAddToCardProps) => {
  const { quantity, fetchCart } = useAppContext();

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
        toast.error("Vui long dang nhap de them san pham vao gio hang");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <button
      className="mt-3 sm:mt-4 w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-white py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
      onClick={handleAddToCart}
    >
      <ShoppingCartIcon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm sm:text-base font-medium">
        Thêm vào giỏ hàng
      </span>
    </button>
  );
};

export default ButtonAddToCard;
