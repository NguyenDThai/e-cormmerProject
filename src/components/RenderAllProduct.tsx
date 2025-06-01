"use client";

import { ShoppingCartIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";

type ProductList = [
  {
    _id: string;
    name: string;
    image: string;
    price: number;
    salePrice: number;
  }
];

const RenderAllProduct = () => {
  const [productList, setProductList] = useState<ProductList | []>([]);

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await fetch("/api/product");
        const dataProduct = await response.json();
        if (!response.ok) {
          throw new Error("Da co loi xay ra khi lay san pham tu csdl");
        }
        setProductList(dataProduct.product);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProductList();
  }, []);

  console.log(productList);
  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product) => (
          <div
            key={product?._id}
            className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute flex justify-center items-center top-2.5 right-2.5 z-30 w-[34px] h-[34px] bg-white rounded-full">
              <CiHeart className="size-6" />
            </div>
            {/* Product Image */}
            <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center p-4">
              <Image
                src={product?.image}
                alt={product?.name}
                width={200}
                height={200}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-gray-800 font-medium text-lg mb-1 truncate">
                {product?.name}
              </h3>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <p className="text-red-500 font-bold text-lg">
                    {product?.price.toLocaleString("vi-VN")} đ
                  </p>
                  {product?.salePrice && (
                    <p className="text-gray-400 text-sm line-through">
                      {product.salePrice.toLocaleString("vi-VN")} đ
                    </p>
                  )}
                </div>

                {/* Rating (optional) */}
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-600 text-sm ml-1">
                    {product?.rating || "4.5"}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="mt-4 w-full bg-black cursor-pointer text-white py-2 rounded-lg hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center space-x-2">
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderAllProduct;
