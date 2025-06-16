/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

const QuantityProduct = ({ productDetail }: any) => {
  const productQuantity = productDetail.quantity;

  const [quantity, setQuantity] = useState(1);

  const handleClickPlus = () => {
    if (quantity < productQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      return <span className="text-red-500">Số lượng sản phẩm đã hết</span>;
    }
  };

  const handleClickPrev = () => {
    if (quantity <= 0) {
      return;
    }
    setQuantity((prev) => prev - 1);
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
