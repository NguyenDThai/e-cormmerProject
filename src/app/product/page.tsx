"use client";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";
import ButtonAddToCard from "@/components/ButtonAddToCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  rating?: number;
}

const CategoryProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(
        `/api/product?${category ? `category=${category}` : ""}`
      );
      const data = await res.json();
      setProducts(data.product);
    };
    fetchProduct();
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/product/${product.name}`} key={product._id}>
            <div className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
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

                  {/* Rating (optional) */}
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-600 text-sm ml-1">{"4.5"}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <ButtonAddToCard />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryProduct;
