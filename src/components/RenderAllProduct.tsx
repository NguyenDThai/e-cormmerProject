/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ButtonAddToCard from "@/components/ButtonAddToCard";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import FavoriteButton from "@/components/FavoriteButton";
import { useFlashSale } from "@/hooks/useFlashSale";

export type ProductList = [
  {
    _id: string;
    name: string;
    category: string;
    images: string[];
    price: number;
    salePrice: number;
  }
];

const RenderAllProduct = () => {
  const [productList, setProductList] = useState<ProductList | []>([]);
  const { data: session } = useSession();
  const { activeFlashSale } = useFlashSale();

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await fetch("/api/product");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        const dataProduct = await response.json();

        let products = dataProduct.product || [];

        // Lọc bỏ sản phẩm đang có trong flash sale để tránh trùng lặp
        if (
          activeFlashSale &&
          activeFlashSale.products &&
          activeFlashSale.products.length > 0
        ) {
          const flashSaleProductIds = activeFlashSale.products.map((p: any) =>
            typeof p === "string" ? p : p._id || p.productId
          );
          products = products.filter(
            (product: any) => !flashSaleProductIds.includes(product._id)
          );
        }

        setProductList(products);
      } catch (error: any) {
        console.error("Error fetching products:", error.message);
        setProductList([]); // Set empty array on error
      }
    };
    fetchProductList();
  }, [activeFlashSale]);

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product) => (
          <Link href={`/product/${product.name}`} key={product._id}>
            <div className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              {session?.user.role === "user" && (
                <FavoriteButton productId={product._id} />
              )}
              {/* Product Image */}
              <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center p-4">
                <Image
                  src={
                    product?.images && product.images.length > 0
                      ? product.images[0]
                      : "/placeholder-product.jpg"
                  }
                  alt={product?.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain bg-transparent transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-gray-800 font-medium text-lg mb-1 truncate">
                  {product?.name}
                </h3>

                <div className="mt-3">
                  <p className="font-light text-sm">{product.category}</p>
                  <div className="flex items-center space-x-2">
                    {product?.salePrice ? (
                      <div className="flex items-center gap-1.5">
                        <p className="text-red-500 font-bold text-lg">
                          {product?.salePrice?.toLocaleString("vi-VN")} đ
                        </p>
                        <p className="text-gray-400 text-sm line-through ">
                          {product?.price?.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    ) : (
                      <p className="text-black font-bold text-lg">
                        {product?.price?.toLocaleString("vi-VN")} đ
                      </p>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <ButtonAddToCard productId={product._id} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RenderAllProduct;
