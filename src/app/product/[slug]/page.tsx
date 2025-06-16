import React from "react";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import ConfigurationModal from "@/components/ConfigurationModal";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import Link from "next/link";
import ImageProductDetail from "@/components/ImageProductDetail";
import ButtonAddToCard from "@/components/ButtonAddToCard";
import QuantityProduct from "@/components/QuantityProduct";

const getProductBySlug = async (name: string) => {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ name }).lean();
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error(error);
    return null;
  }
};
// Api goi san pham lien quan
const relatedProduct = async (category: string) => {
  try {
    await connectToDatabase();
    const productRelated = await Product.find({ category });
    return productRelated;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const ProductDetail = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const productDetail = await getProductBySlug(decodedSlug);
  // Api loc theo loai san pham để render tất cả sản phẩm có liên quan (vd: điện thoại thì render tất cả các sản phẩm liên quan đến điện thoại)
  const categoryProduct = await relatedProduct(productDetail.category);

  if (!productDetail) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phần hình ảnh */}
        <ImageProductDetail productDetail={productDetail} />

        {/* Phần thông tin */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{productDetail.name}</h1>
          <p className="text-gray-600">{productDetail.description}</p>

          <div>
            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4">
                  {productDetail.salePrice ? (
                    <>
                      <span className="text-2xl font-bold text-red-600">
                        {productDetail.salePrice?.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {productDetail.price?.toLocaleString("vi-VN")}đ
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-red-600">
                      {productDetail.price?.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>

                <QuantityProduct productDetail={productDetail} />
              </div>
              {productDetail.quantity && (
                <span>Chỉ còn có {productDetail.quantity} sản phẩm</span>
              )}
            </div>
            {/* Nút xem cấu hình (sẽ được xử lý bằng client component) */}
            <div className="mt-2.5">
              {productDetail.configuration ? (
                <ConfigurationModal
                  configuration={productDetail.configuration}
                  category={productDetail.category}
                />
              ) : (
                <p>Sản phẩm không có cấu hình</p>
              )}
            </div>
          </div>

          {/* Action btn */}
          <div className="flex gap-2.5">
            <ButtonAddToCard />
            <button className="mt-4 w-full bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center space-x-2">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* San pham Lien quan */}
      <div className="mt-10">
        <h1 className="text-2xl font-semibold">Sản phẩm liên quan</h1>
        <div className="container mx-auto px-4 py-8 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProduct.map((product) => (
              <Link href={`/product/${product.name}`} key={product._id}>
                <div className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="absolute flex justify-center items-center top-2.5 right-2.5 z-30 w-[34px] h-[34px] bg-white rounded-full">
                    <CiHeart className="size-6" />
                  </div>
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

                      {/* Rating (optional) */}
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-600 text-sm ml-1">
                          {"4.5"}
                        </span>
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
      </div>
    </div>
  );
};

export default ProductDetail;
