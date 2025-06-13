import React from "react";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import ConfigurationModal from "@/components/ConfigurationModal";
import Image from "next/image";
import { ShoppingCartIcon, StarIcon } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import Link from "next/link";
import ImageProductDetail from "@/components/ImageProductDetail";

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
  // Api loc theo loai san pham
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

          <div className="flex items-center gap-4 justify-between">
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
            {/* Nút xem cấu hình (sẽ được xử lý bằng client component) */}
            {productDetail.configuration ? (
              <ConfigurationModal
                configuration={productDetail.configuration}
                category={productDetail.category}
              />
            ) : (
              <p>Sản phẩm không có cấu hình</p>
            )}
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Thêm vào giỏ hàng
          </button>
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
                    <button className="mt-4 w-full bg-black cursor-pointer text-white py-2 rounded-lg hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center space-x-2">
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
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
