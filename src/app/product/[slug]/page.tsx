import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import ConfigurationModal from "@/components/ConfigurationModal";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import ImageProductDetail from "@/components/ImageProductDetail";
import ButtonAddToCard from "@/components/ButtonAddToCard";
import QuantityProduct from "@/components/QuantityProduct";
import RenderReviews from "@/components/RenderReviews";
import Review from "@/models/review";
// import FavoriteButton from "@/components/FavoriteButton";

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

const getReviewsByProduct = async (productId: string) => {
  try {
    await connectToDatabase();
    const reviews = await Review.find({ productId, isApproved: true })
      .select("rating comment createdAt userId")
      .populate("userId", "name")
      .lean();

    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.log("Error fetching reviews:", error);
    return [];
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

const ProductDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const productDetail = await getProductBySlug(decodedSlug);
  // Api loc theo loai san pham để render tất cả sản phẩm có liên quan (vd: điện thoại thì render tất cả các sản phẩm liên quan đến điện thoại)
  const categoryProduct = await relatedProduct(productDetail?.category);
  const reviews = await getReviewsByProduct(productDetail._id);

  // Tính điểm đánh giá trung bình
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum: number, review: { rating: number }) => sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "Chưa có";

  if (!productDetail) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 h-full">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Image Section */}
        <ImageProductDetail productDetail={productDetail} />

        {/* Info Section */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {productDetail.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {productDetail.description}
          </p>

          {/* Price and Quantity */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-4">
                  {productDetail.salePrice ? (
                    <>
                      <span className="text-xl sm:text-2xl font-bold text-red-600">
                        {productDetail.salePrice?.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-base sm:text-lg text-gray-500 line-through">
                        {productDetail.price?.toLocaleString("vi-VN")}đ
                      </span>
                    </>
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold">
                      {productDetail.price?.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>

                <QuantityProduct productDetail={productDetail} />
              </div>
              {productDetail.quantity && (
                <span className="text-sm sm:text-base text-gray-600">
                  Chỉ còn có {productDetail.quantity} sản phẩm
                </span>
              )}
            </div>

            {/* Configuration */}
            <div className="mt-2 sm:mt-2.5">
              {productDetail.configuration ? (
                <ConfigurationModal
                  configuration={productDetail.configuration}
                  category={productDetail.category}
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-500">
                  Sản phẩm không có cấu hình
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
            <ButtonAddToCard productId={productDetail._id} />
            <button className="w-full bg-blue-600 cursor-pointer text-white py-2 mt-4 rounded-lg hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center space-x-2">
              Mua ngay
            </button>
          </div>
        </div>
        {/* Render reviews */}
        <RenderReviews reviews={reviews} averageRating={averageRating} />
      </div>

      {/* Related Products */}
      <div className="mt-8 sm:mt-10">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          Sản phẩm liên quan
        </h1>
        <div className="px-0 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProduct.map((product) => (
              <Link href={`/product/${product.name}`} key={product._id}>
                <div className="group relative bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden hover:shadow-md sm:hover:shadow-lg transition-all duration-300">
                  {/* <FavoriteButton productId={product._id.toString()} /> */}

                  {/* Product Image */}
                  <div className="relative w-full h-40 sm:h-40 md:h-48 bg-gray-100 flex items-center justify-center p-3 sm:p-4">
                    <Image
                      src={product?.images[0]}
                      alt={product?.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-contain bg-transparent transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-gray-800 font-medium text-sm sm:text-base md:text-lg mb-1 truncate">
                      {product?.name}
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 sm:mt-3 gap-1 sm:gap-0">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {product?.salePrice ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1.5">
                            <p className="text-red-500 font-bold text-base sm:text-lg">
                              {product?.salePrice?.toLocaleString("vi-VN")} đ
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm line-through">
                              {product?.price?.toLocaleString("vi-VN")} đ
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold text-base sm:text-lg">
                            {product?.price?.toLocaleString("vi-VN")} đ
                          </p>
                        )}
                      </div>

                      {/* Rating (optional) */}
                      <div className="flex items-center">
                        <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        <span className="text-gray-600 text-xs sm:text-sm ml-1">
                          {averageRating}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-2 sm:mt-3">
                      <ButtonAddToCard productId={product._id.toString()} />
                    </div>
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
