"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { MdClear } from "react-icons/md";

const CartPage = () => {
  const [quantity, setQuantity] = useState(1);
  const price = 650; // Example price for the product

  const handleClickPlus = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleClickPrev = () => {
    if (quantity <= 1) {
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  return (
    <div className="h-screen max-w-[1170px] mx-auto flex flex-col gap-6 px-4 py-8">
      {/* Header */}
      <div className="rounded-lg shadow-sm bg-white border border-gray-100">
        <ul className="flex items-center justify-between px-8 py-5">
          <li className="text-lg font-medium text-gray-700 w-2/5">
            Tên sản phẩm
          </li>
          <li className="text-lg font-medium text-gray-700 w-1/5 text-center">
            Giá
          </li>
          <li className="text-lg font-medium text-gray-700 w-1/5 text-center">
            Giá khuyến mãi
          </li>
          <li className="text-lg font-medium text-gray-700 w-1/5 text-center">
            Số lượng
          </li>
          <li className="text-lg font-medium text-gray-700 w-1/5 text-right">
            Tổng cộng
          </li>
        </ul>
      </div>

      {/* Cart Item 1 */}
      <div className="rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow">
        <ul className="flex items-center justify-between px-8 py-6">
          <li className="w-2/5">
            <div className="flex items-center relative">
              <Image
                src="/authlogo1.png"
                alt="image-card"
                width={500}
                height={500}
                className="w-16 h-16 object-contain rounded-md border border-gray-200"
              />
              <p className="text-lg font-medium ml-4 text-gray-800">
                LCD Monitor
              </p>
              <MdClear className="absolute left-1 top-1 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer" />
            </div>
          </li>
          <li className="w-1/5 text-center text-lg text-gray-700">${price}</li>
          <li className="w-1/5 text-center text-lg text-gray-700">$0</li>
          <li className="w-1/5">
            <div className="flex items-center justify-center">
              <div className="flex items-center border border-gray-200 rounded-full px-4 py-2">
                <button
                  onClick={handleClickPrev}
                  className="cursor-pointer p-1 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <FiMinus size={16} />
                </button>
                <span className="mx-4 text-lg font-semibold text-gray-700 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleClickPlus}
                  className="cursor-pointer p-1 text-gray-500 hover:text-green-500 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <FaPlus size={16} />
                </button>
              </div>
            </div>
          </li>
          <li className="w-1/5 text-right text-lg font-semibold text-gray-800">
            {price * quantity}
          </li>
        </ul>
      </div>

      {/* Cart Item 2 */}
      <div className="rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow">
        <ul className="flex items-center justify-between px-8 py-6">
          <li className="w-2/5">
            <div className="flex items-center">
              <Image
                src="/authlogo1.png"
                alt="image-card"
                width={500}
                height={500}
                className="w-16 h-16 object-contain rounded-md border border-gray-200"
              />
              <p className="text-lg font-medium ml-4 text-gray-800">
                LCD Monitor
              </p>
            </div>
          </li>
          <li className="w-1/5 text-center text-lg text-gray-700">${price}</li>
          <li className="w-1/5 text-center text-lg text-gray-700">$0</li>
          <li className="w-1/5">
            <div className="flex items-center justify-center">
              <div className="flex items-center border border-gray-200 rounded-full px-4 py-2">
                <button
                  onClick={handleClickPrev}
                  className="cursor-pointer p-1 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <FiMinus size={16} />
                </button>
                <span className="mx-4 text-lg font-semibold text-gray-700 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleClickPlus}
                  className="cursor-pointer p-1 text-gray-500 hover:text-green-500 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <FaPlus size={16} />
                </button>
              </div>
            </div>
          </li>
          <li className="w-1/5 text-right text-lg font-semibold text-gray-800">
            {price * quantity}
          </li>
        </ul>
      </div>

      {/* You might want to add a checkout section here */}
      <div className="mt-4 flex items-center justify-between">
        <Button className="px-6 py-3 cursor-pointer hover:bg-blue-700 hover:text-white text-back font-medium rounded-lg shadow-sm transition-all">
          Trở về trang chủ
        </Button>
        <Button className="px-6 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all">
          Cập nhật giỏ hàng
        </Button>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-4">
          <Input placeholder="Nhập mã voucher..." type="text" />
          <Button className="bg-blue-500 text-white hover:bg-blue-700 py-4 px-12 rounded-sm cursor-pointer">
            Áp dụng
          </Button>
        </div>

        <div className="w-[500px] border border-gray-200 rounded-lg px-6 py-8 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            Tổng giá giỏ hàng
          </h3>
          <div className="flex justify-between items-center pb-3.5 pt-3.5">
            <p>Tổng cộng:</p>
            <span>${price * quantity}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-3.5 pb-3.5 ">
            <p>Phí vận chuyển</p>
            <select className="border border-gray-300 rounded-md p-2">
              <option value="GHN">Giao hàng nhanh</option>
              <option value="GHTK">Giao hàng tiết kiệm</option>
              <option value="FREE">Miễn phí giao hàng</option>
            </select>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-3.5">
            <p>Tổng:</p>
            <span>${price * quantity}</span>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm mt-4 py-5 cursor-pointer">
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
