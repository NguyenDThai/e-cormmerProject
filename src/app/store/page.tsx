/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  images: string[];
  description: string;
  price: number;
  salePrice: number;
  quantity: number;
  configuration: {
    storage: number;
    screenSize: number;
    battery: number;
    features: string[];
    custom: Record<string, any>;
    _id: string;
  };
  createdAt: string;
}

const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/product", {
          headers: { "Content-type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Da xay ra loi khi lay san pham tu api");
        }
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.product || []);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setProducts([]);
      }
    };
    fetchProduct();
  }, []);

  console.log(products);

  //   Nhom san pham theo cate
  const groupedProducts = useMemo(() => {
    return products.reduce((acc: { [key: string]: Product[] }, product) => {
      const category = product.category || "Khác";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});
  }, [products]);

  // Định dạng giá tiền
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  // Định dạng tên danh mục
  const formatCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "phone":
        return "Điện thoại";
      case "laptop":
        return "Laptop";
      case "airport":
        return "Tai nghe";
      case "mouse":
        return "Chuột máy tính";
      case "gaming":
        return "Thiết bị chơi game";
      case "camera":
        return "Camera";
      case "other":
        return "Khác";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <p className="text-red-500 text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tiêu đề đơn giản */}
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Sản phẩm của chúng tôi
      </h1>

      {Object.keys(groupedProducts).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiện chưa có sản phẩm nào</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedProducts).map(([category, products]) => (
            <div key={category} className="mb-8">
              {/* Tên danh mục */}
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {formatCategory(category)}
              </h2>

              {/* Lưới sản phẩm */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <Link href={`/product/${product.name}`} key={product._id}>
                    <div className="bg-white min-h-full relative rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Sale badge */}
                      {product.salePrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                          GIẢM GIÁ
                        </div>
                      )}
                      {/* Ảnh sản phẩm */}
                      <div className="relative aspect-square">
                        <Image
                          src={product.images[0] || "/placeholder-product.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        />
                      </div>

                      {/* Thông tin sản phẩm */}
                      <div className="p-3">
                        <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {product.brand}
                        </p>

                        {/* Giá */}
                        {product.salePrice ? (
                          <div className="space-y-1">
                            <span className="text-red-600 font-bold">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className="text-gray-400 text-sm line-through block">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-600 font-bold">
                            {formatPrice(product.price)}
                          </span>
                        )}

                        {/* Trạng thái */}
                        <p
                          className={`text-xs mt-2 ${
                            product.quantity > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StorePage;
