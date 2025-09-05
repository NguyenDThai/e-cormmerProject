/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

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
    ram?: number;
    storage?: number;
    screenSize?: number;
    battery?: number;
    processor?: string;
    cpu?: string;
    gpu?: string;
    sensorResolution?: number;
    lensType?: string;
    videoResolution?: string;
    type?: string;
    features?: string[];
    custom?: Record<string, any>;
    _id: string;
  };
  createdAt: string;
}

const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    priceRange: [number, number];
    ram: number[];
    storage: number[];
    screenSize: number[];
  }>({
    priceRange: [0, Infinity],
    ram: [],
    storage: [],
    screenSize: [],
  });
  const [displayPrice, setDisplayPrice] = useState<{
    minPrice: string;
    maxPrice: string;
  }>({
    minPrice: "",
    maxPrice: "",
  });
  const [filterOptions, setFilterOptions] = useState<{
    ram: number[];
    storage: number[];
    screenSize: number[];
  }>({
    ram: [],
    storage: [],
    screenSize: [],
  });

  const [debouncedFilters] = useDebounce(filters, 500);

  // Lấy sản phẩm
  const fetchProduct = useCallback(async (currentFilters: typeof filters) => {
    try {
      const queryParams = new URLSearchParams();
      if (
        currentFilters.priceRange[0] > 0 &&
        !isNaN(currentFilters.priceRange[0])
      )
        queryParams.append("minPrice", currentFilters.priceRange[0].toString());
      if (
        currentFilters.priceRange[1] !== Infinity &&
        !isNaN(currentFilters.priceRange[1])
      )
        queryParams.append("maxPrice", currentFilters.priceRange[1].toString());
      if (currentFilters.ram.length > 0)
        queryParams.append("ram", currentFilters.ram.join(","));
      if (currentFilters.storage.length > 0)
        queryParams.append("storage", currentFilters.storage.join(","));
      if (currentFilters.screenSize.length > 0)
        queryParams.append("screenSize", currentFilters.screenSize.join(","));

      const response = await fetch(
        `/api/product/filter?${queryParams.toString()}`,
        {
          headers: { "Content-type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Đã xảy ra lỗi khi lấy sản phẩm từ API");
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProduct(debouncedFilters);
  }, [debouncedFilters, fetchProduct]);

  // Lấy tùy chọn bộ lọc
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch("/api/product/filters");
        if (!response.ok) {
          throw new Error("Đã xảy ra lỗi khi lấy tùy chọn bộ lọc");
        }
        const data = await response.json();
        setFilterOptions({
          ram: data.ram || [],
          storage: data.storage || [],
          screenSize: data.screenSize || [],
        });
      } catch (error: any) {
        console.error("Error fetching filter options:", error);
        setError(error.message);
      }
    };
    fetchFilterOptions();
  }, []);

  // Nhóm sản phẩm theo danh mục
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

  // Xử lý thay đổi bộ lọc giá
  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Chỉ giữ số, loại bỏ dấu phẩy, dấu chấm, ký tự khác
    const value = parseInt(rawValue) || 0;
    setFilters((prev) => {
      const newRange = [...prev.priceRange] as [number, number];
      newRange[index] = value;
      if (index === 0 && value > prev.priceRange[1]) newRange[1] = value;
      if (index === 1 && value < prev.priceRange[0]) newRange[0] = value;
      return { ...prev, priceRange: newRange };
    });
    setDisplayPrice((prev) => ({
      ...prev,
      [index === 0 ? "minPrice" : "maxPrice"]:
        value > 0 ? value.toLocaleString("vi-VN") : "",
    }));
  };

  // Xử lý thay đổi bộ lọc checkbox
  const handleCheckboxChange = (
    type: "ram" | "storage" | "screenSize",
    value: number
  ) => {
    setFilters((prev) => {
      const newValues = prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: newValues.sort((a, b) => a - b) };
    });
  };

  // Cập nhật displayPrice khi filters.priceRange thay đổi từ nguồn khác
  useEffect(() => {
    setDisplayPrice({
      minPrice:
        filters.priceRange[0] > 0
          ? filters.priceRange[0].toLocaleString("vi-VN")
          : "",
      maxPrice:
        filters.priceRange[1] !== Infinity
          ? filters.priceRange[1].toLocaleString("vi-VN")
          : "",
    });
  }, [filters.priceRange]);

  if (error) {
    return (
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <p className="text-red-500 text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar bộ lọc - styled */}
        <div className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            Bộ lọc
          </h2>

          {/* Lọc theo giá - styled */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-3">
              Khoảng giá
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={displayPrice.minPrice}
                onChange={(e) => handlePriceChange(e, 0)}
                placeholder="Giá tối thiểu"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              />
              <input
                type="text"
                value={displayPrice.maxPrice}
                onChange={(e) => handlePriceChange(e, 1)}
                placeholder="Giá tối đa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Lọc theo RAM - styled */}
          {filterOptions.ram.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-700 mb-3">
                RAM (GB)
              </h3>
              <div className="space-y-2">
                {filterOptions.ram.map((value) => (
                  <label
                    key={value}
                    className="flex items-center space-x-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.ram.includes(value)}
                      onChange={() => handleCheckboxChange("ram", value)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">{value} GB</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Lọc theo dung lượng lưu trữ - styled */}
          {filterOptions.storage.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-700 mb-3">
                Dung lượng (GB)
              </h3>
              <div className="space-y-2">
                {filterOptions.storage.map((value) => (
                  <label
                    key={value}
                    className="flex items-center space-x-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.storage.includes(value)}
                      onChange={() => handleCheckboxChange("storage", value)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">
                      {value >= 1000 ? `${value / 1000} TB` : `${value} GB`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Lọc theo kích thước màn hình - styled */}
          {filterOptions.screenSize.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-700 mb-3">
                Kích thước màn hình (inch)
              </h3>
              <div className="space-y-2">
                {filterOptions.screenSize.map((value) => (
                  <label
                    key={value}
                    className="flex items-center space-x-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.screenSize.includes(value)}
                      onChange={() => handleCheckboxChange("screenSize", value)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">{value} inch</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nội dung chính - styled */}
        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Sản phẩm của chúng tôi
          </h1>

          {Object.keys(groupedProducts).length === 0 ? (
            <div className="text-center py-16  rounded-xl">
              <p className="text-gray-400">Hiện chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(([category, products]) => (
                <div key={category} className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                    {formatCategory(category)}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products.map((product) => (
                      <Link href={`/product/${product.name}`} key={product._id}>
                        <div className="bg-white relative h-full flex flex-col rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-500">
                          {product.salePrice && (
                            <div className="absolute right-1 top-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                              GIẢM GIÁ
                            </div>
                          )}
                          <div className="relative aspect-square w-full">
                            <Image
                              src={
                                product.images[0] || "/placeholder-product.jpg"
                              }
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            />
                          </div>
                          <div className="p-4 flex-grow flex flex-col">
                            <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                              {product.brand}
                            </p>
                            <div className="mt-auto">
                              {product.salePrice ? (
                                <div className="space-y-1">
                                  <span className="text-red-600 font-bold text-lg">
                                    {formatPrice(product.salePrice)}
                                  </span>
                                  <span className="text-gray-400 text-sm line-through block">
                                    {formatPrice(product.price)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-800 font-bold text-lg">
                                  {formatPrice(product.price)}
                                </span>
                              )}
                              <p
                                className={`text-xs mt-3 font-medium ${
                                  product.quantity >= 5
                                    ? "text-green-600"
                                    : product.quantity > 0
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {product.quantity > 5
                                  ? "🟢 Còn hàng"
                                  : product.quantity > 0
                                  ? "🟡 Gần hết hàng"
                                  : "🔴 Hết hàng"}
                              </p>
                            </div>
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
      </div>
    </div>
  );
};

export default StorePage;
