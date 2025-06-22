/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useAppContext } from "@/context/AppProvider";

const QuantityProduct = ({ productDetail }: any) => {
  const productQuantity = productDetail.quantity;
  const { quantity = 1, setQuantity } = useAppContext();

  const handleClickPlus = () => {
    if (quantity < productQuantity) {
      if (setQuantity) {
        setQuantity(quantity + 1);
      }
    } else {
      return <span className="text-red-500">Số lượng sản phẩm đã hết</span>;
    }
  };

  const handleClickPrev = () => {
    if (quantity <= 0) {
      return;
    }
    if (setQuantity) {
      setQuantity(quantity - 1);
    }
  };
  return (
    <div className="flex items-center border border-gray-300 rounded-full px-3 py-1">
      <button
        onClick={handleClickPrev}
        className="cursor-pointer p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
      >
        <FiMinus size={15} />
      </button>
      <span className="mx-4 text-lg font-semibold">{quantity}</span>
      <button
        onClick={handleClickPlus}
        className="cursor-pointer p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
      >
        <FaPlus size={15} />
      </button>
    </div>
  );
};

export default QuantityProduct;
