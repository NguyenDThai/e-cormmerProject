/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import { useAppContext } from "@/context/AppProvider";
import Link from "next/link";

const CartPage = () => {
  const {
    fetchCart,
    cartItems,
    cartTotal,
    updateCartItemQuantity,
    removeFromCart,
  } = useAppContext();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  if (!cartItems) {
    return <div>Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="h-screen max-w-[1170px] mx-auto flex flex-col items-center justify-center gap-6 px-4 py-8">
        <h2 className="text-2xl font-semibold">Giỏ hàng trống</h2>
        <Button className="px-6 py-3">Tiếp tục mua sắm</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1170px] mx-auto flex flex-col gap-4 sm:gap-6 px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="rounded-lg shadow-sm bg-white border border-gray-100 hidden sm:block">
        <ul className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
          <li className="text-base sm:text-lg font-medium text-gray-700 w-2/5">
            Tên sản phẩm
          </li>
          <li className="text-base sm:text-lg font-medium text-gray-700 w-1/5 text-center">
            Giá
          </li>
          <li className="text-base sm:text-lg font-medium text-gray-700 w-1/5 text-center">
            Giá khuyến mãi
          </li>
          <li className="text-base sm:text-lg font-medium text-gray-700 w-1/5 text-center">
            Số lượng
          </li>
          <li className="text-base sm:text-lg font-medium text-gray-700 w-1/5 text-right">
            Tổng cộng
          </li>
        </ul>
      </div>

      {/* Cart Items */}
      {cartItems.map((item) => (
        <div
          key={item.product._id.toString()}
          className="rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow"
        >
          {/* Mobile View */}
          <div className="sm:hidden p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start relative">
                <Image
                  src={
                    "images" in item.product &&
                    Array.isArray((item.product as any).images)
                      ? (item.product as { images: string[] }).images[0] ||
                        "/placeholder-product.jpg"
                      : "/placeholder-product.jpg"
                  }
                  alt={
                    "name" in item.product
                      ? (item.product as { name: string }).name
                      : "Product image"
                  }
                  width={80}
                  height={80}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-md border border-gray-200"
                />
                <div className="ml-3">
                  <p className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2">
                    {"name" in item.product
                      ? (item.product as { name: string }).name
                      : ""}
                  </p>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>Giá: {item.originalPrice.toLocaleString("vi-VN")}</p>
                    <p>
                      KM:{" "}
                      {item.isFlashSale
                        ? `${item.price.toLocaleString("vi-VN")}`
                        : "0đ"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.product._id.toString())}
                className="w-5 h-5 bg-red-500 text-white rounded-full cursor-pointer flex items-center justify-center"
              >
                <MdClear size={12} />
              </button>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center border border-gray-200 rounded-full px-3 py-1.5">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.product._id.toString(),
                      item.quantity - 1
                    )
                  }
                  className="cursor-pointer p-1 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-full transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <FiMinus size={14} />
                </button>
                <span className="mx-3 text-base font-semibold text-gray-700 min-w-[20px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.product._id.toString(),
                      item.quantity + 1
                    )
                  }
                  className="cursor-pointer p-1 text-gray-500 hover:text-green-500 hover:bg-gray-50 rounded-full transition-colors"
                  disabled={
                    item.isFlashSale &&
                    item.quantity >= (item.maxQuantityPerUser || Infinity)
                  }
                >
                  <FaPlus size={14} />
                </button>
              </div>
              <div className="text-base font-semibold text-gray-800">
                {(item.price * item.quantity).toLocaleString("vi-VN")}
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <ul className="hidden sm:flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
            <li className="w-2/5">
              <div className="flex items-center relative">
                <Image
                  src={
                    "images" in item.product &&
                    Array.isArray((item.product as any).images)
                      ? (item.product as { images: string[] }).images[0] ||
                        "/placeholder-product.jpg"
                      : "/placeholder-product.jpg"
                  }
                  alt={
                    "name" in item.product
                      ? (item.product as { name: string }).name
                      : "Product image"
                  }
                  width={80}
                  height={80}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-md border border-gray-200"
                />
                <p className="text-sm sm:text-base md:text-lg font-medium ml-3 sm:ml-4 text-gray-800">
                  {"name" in item.product
                    ? (item.product as { name: string }).name
                    : ""}
                </p>
                <button
                  onClick={() => removeFromCart(item.product._id.toString())}
                  className="absolute left-0 top-0 sm:left-1 sm:top-1 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer flex items-center justify-center"
                >
                  <MdClear size={12} />
                </button>
              </div>
            </li>
            <li className="w-1/5 text-center text-sm sm:text-base md:text-lg text-gray-700">
              {item.originalPrice.toLocaleString("vi-VN")}
            </li>
            <li className="w-1/5 text-center text-sm sm:text-base md:text-lg text-gray-700">
              {item.isFlashSale
                ? `${item.price.toLocaleString("vi-VN")}`
                : "0đ"}
            </li>
            <li className="w-1/5">
              <div className="flex items-center justify-center">
                <div className="flex items-center border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product._id.toString(),
                        item.quantity - 1
                      )
                    }
                    className="cursor-pointer p-1 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-full transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="mx-3 sm:mx-4 text-sm sm:text-base md:text-lg font-semibold text-gray-700 min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product._id.toString(),
                        item.quantity + 1
                      )
                    }
                    className="cursor-pointer p-1 text-gray-500 hover:text-green-500 hover:bg-gray-50 rounded-full transition-colors"
                    disabled={
                      item.isFlashSale &&
                      item.quantity >= (item.maxQuantityPerUser || Infinity)
                    }
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
              </div>
            </li>
            <li className="w-1/5 text-right text-sm sm:text-base md:text-lg font-semibold text-gray-800">
              {(item.price * item.quantity).toLocaleString("vi-VN")}
            </li>
          </ul>
        </div>
      ))}

      {/* Checkout section */}
      <div className="mt-4 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <Link href={"/"} className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 hover:bg-blue-700 hover:text-white text-back font-medium rounded-lg shadow-sm transition-all text-sm sm:text-base">
            Trở về trang chủ
          </Button>
        </Link>
        <Button
          onClick={fetchCart}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all text-sm sm:text-base"
        >
          Cập nhật giỏ hàng
        </Button>
      </div>

      <div className="flex justify-end">
        <div className="w-full sm:w-[400px] md:w-[500px] border border-gray-200 rounded-lg px-4 sm:px-6 py-6 sm:py-8 bg-white shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Tổng giá giỏ hàng
          </h3>
          <div className="flex justify-between items-center pb-3 pt-3 sm:pb-3.5 sm:pt-3.5 text-sm sm:text-base">
            <p>Tổng cộng:</p>
            <span>{cartTotal.toLocaleString("vi-VN")}</span>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-3 pb-3 sm:pt-3.5 sm:pb-3.5 text-sm sm:text-base">
            <p>Số lượng:</p>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-3 sm:pt-3.5 text-sm sm:text-base">
            <p>Tổng:</p>
            <span>{cartTotal.toLocaleString("vi-VN")}</span>
          </div>

          <Link href={"/checkout"} className="block mt-3 sm:mt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm py-3 sm:py-4 md:py-5 cursor-pointer text-sm sm:text-base">
              Thanh toán
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
