"use client";
import { ShoppingCartIcon } from "lucide-react";
import React from "react";

const ButtonAddToCard = () => {
  return (
    <button className="mt-4 w-full bg-black cursor-pointer text-white py-2 rounded-lg hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center space-x-2">
      <ShoppingCartIcon className="w-5 h-5" />
      <span>Add to Cart</span>
    </button>
  );
};

export default ButtonAddToCard;
