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
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <button
      className="mt-4 w-full bg-black cursor-pointer text-white py-2 rounded-lg hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center space-x-2"
      onClick={handleAddToCart}
    >
      <ShoppingCartIcon className="w-5 h-5" />
      <span>Thêm vào giỏ hàng</span>
    </button>
  );
};

export default ButtonAddToCard;
