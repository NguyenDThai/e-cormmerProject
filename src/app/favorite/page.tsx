/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useAppContext } from "@/context/AppProvider";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

const FavoritePage = () => {
  const { data: session, status } = useSession();
  const { favorites, removeFavorite } = useAppContext();

  if (status === "loading") {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Favorite Products</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="container mx-auto p-4 h-screen">
        <p>Bạn cần đăng nhập để xem sản phẩm yêu thích.</p>
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="container mx-auto p-4">
        <p>Bạn chưa có sản phẩm yêu thích</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sản phẩm yêu thích</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {favorites.map((product, index) => (
          <Link href={`/product/${product.name}`} key={index}>
            <div className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              {session?.user.role === "user" && (
                <FaTrash
                  className="absolute right-5 z-10 top-2.5 cursor-pointer hover:text-red-500"
                  size={20}
                  onClick={(e) => {
                    e.preventDefault();
                    removeFavorite(product._id);
                  }}
                />
              )}
              {/* Product Image */}
              <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center p-4">
                <Image
                  src={product?.images[0]}
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

                <div className="flex items-center justify-between mt-3">
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
                      <p className="text-red-500 font-bold text-lg">
                        {product?.price?.toLocaleString("vi-VN")} đ
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
