import { Button } from "@/components/ui/button";
import { PlusIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IoPencil } from "react-icons/io5";
import BtnClearProduct from "@/components/BtnClearProduct";

// Định nghĩa interface Product để đảm bảo type safety
interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[]; // Mảng URL ảnh
  brand?: string;
  category?: string;
}

const ProductPage = async () => {
  try {
    // Sửa endpoint thành /api/products (thêm "s")
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product`,
      {
        cache: "no-store", // Đảm bảo dữ liệu tươi mới
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const products: Product[] = result.product || []; // Đảm bảo products là mảng

    return (
      <div className="h-full container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Danh sách sản phẩm
          </h1>
          <Link href="/admin/product/add-product">
            <Button className="gap-2" variant="default">
              <PlusIcon className="h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <p className="text-center text-gray-600">Không có sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <Link href={`/product/${product.name}`} className="block">
                  {/* Product Image */}
                  <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.jpg"} // Lấy ảnh đầu tiên hoặc fallback
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    {/* Product Name */}
                    <h3 className="text-gray-900 font-medium text-lg truncate">
                      {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.salePrice ? (
                          <>
                            <span className="text-red-600 font-bold text-lg">
                              {product.salePrice.toLocaleString("vi-VN")}₫
                            </span>
                            <span className="text-gray-400 text-sm line-through">
                              {product.price.toLocaleString("vi-VN")}₫
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-900 font-bold text-lg">
                            {product.price.toLocaleString("vi-VN")}₫
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-600 text-sm ml-1">4.5</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Admin Actions */}
                <div className="flex justify-end items-center space-x-2 pt-2 border-t border-gray-100 mt-3">
                  <Link href={`/admin/product/edit/${product._id}`}>
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
                      <IoPencil className="w-5 h-5" />
                    </button>
                  </Link>
                  <BtnClearProduct productId={product._id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("[PRODUCT_PAGE_ERROR]", error);
    return (
      <div className="h-full container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Danh sách sản phẩm
        </h1>
        <p className="text-center text-red-600">
          Lỗi khi tải sản phẩm: {(error as Error).message}
        </p>
      </div>
    );
  }
};

export default ProductPage;
