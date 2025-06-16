"use client";
import { ShoppingCartIcon } from "lucide-react";
import React from "react";

const ButtonAddToCard = () => {
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert("Add to Cart");
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
