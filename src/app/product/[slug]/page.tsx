import React from "react";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import ConfigurationModal from "@/components/ConfigurationModal";
import Image from "next/image";

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

const ProductDetail = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const productDetail = await getProductBySlug(decodedSlug);

  if (!productDetail) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phần hình ảnh */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
          <Image
            src={productDetail.image}
            alt={productDetail.name}
            width={500}
            height={500}
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>

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
    </div>
  );
};

export default ProductDetail;
