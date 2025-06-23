/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FlashSale } from "@/types/flashSale";
import { ProductType as Product } from "@/types/product";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type FlashSaleFormValues = {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  discountPercent: number;
  maxQuantityPerUser: number;
  productIds: string[];
};

interface FlashSaleFormProps {
  initialData?: FlashSale | null;
  onSave: (data: FlashSaleFormValues) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export const FlashSaleForm: React.FC<FlashSaleFormProps> = ({
  initialData,
  onSave,
  onCancel,
  isSaving,
}) => {
  const [formData, setFormData] = useState<FlashSaleFormValues>({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    discountPercent: 10,
    maxQuantityPerUser: 1,
    productIds: [],
  });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FlashSaleFormValues, string>>
  >({});
  const [searchTerm, setSearchTerm] = useState("");

  const formatToLocalDateTimeString = (dateString: string | Date): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        startTime: formatToLocalDateTimeString(initialData.startTime),
        endTime: formatToLocalDateTimeString(initialData.endTime),
        discountPercent: initialData.discountPercent || 10,
        maxQuantityPerUser: initialData.maxQuantityPerUser || 1,
        productIds:
          (initialData.products as any[]).map((p) =>
            typeof p === "string" ? p : p._id
          ) || [],
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await fetch("/api/product");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setAllProducts(data.product || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allProducts, searchTerm]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FlashSaleFormValues, string>> = {};
    if (!formData.name) newErrors.name = "Tên chương trình không được để trống";
    if (!formData.startTime) newErrors.startTime = "Ngày bắt đầu không hợp lệ";
    if (!formData.endTime) newErrors.endTime = "Ngày kết thúc không hợp lệ";
    if (new Date(formData.endTime) <= new Date(formData.startTime))
      newErrors.endTime = "Ngày kết thúc phải sau ngày bắt đầu";
    if (formData.discountPercent < 1 || formData.discountPercent > 100)
      newErrors.discountPercent = "Phần trăm giảm giá phải từ 1 đến 100";
    if (formData.maxQuantityPerUser < 1)
      newErrors.maxQuantityPerUser = "Giới hạn mua mỗi khách phải lớn hơn 0";
    if (formData.productIds.length === 0)
      newErrors.productIds = "Phải chọn ít nhất 1 sản phẩm";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => {
      const newProductIds = prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];
      return { ...prev, productIds: newProductIds };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết chương trình</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tên chương trình</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="V.d: Siêu sale bùng nổ"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn về chương trình flash sale..."
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Thời gian & Khuyến mãi</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm">{errors.startTime}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Thời gian kết thúc</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleChange}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm">{errors.endTime}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="discountPercent">Phần trăm giảm giá (%)</Label>
                <Input
                  id="discountPercent"
                  name="discountPercent"
                  type="number"
                  value={formData.discountPercent}
                  onChange={handleChange}
                />
                {errors.discountPercent && (
                  <p className="text-red-500 text-sm">
                    {errors.discountPercent}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxQuantityPerUser">
                  Giới hạn mua mỗi khách
                </Label>
                <Input
                  id="maxQuantityPerUser"
                  name="maxQuantityPerUser"
                  type="number"
                  value={formData.maxQuantityPerUser}
                  onChange={handleChange}
                />
                {errors.maxQuantityPerUser && (
                  <p className="text-red-500 text-sm">
                    {errors.maxQuantityPerUser}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm áp dụng</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loadingProducts ? (
            <p>Đang tải danh sách sản phẩm...</p>
          ) : (
            <>
              <ScrollArea className="h-96 w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductToggle(product._id!)}
                      className={cn(
                        "relative border rounded-lg p-2 cursor-pointer transition-all duration-200",
                        formData.productIds.includes(product._id!)
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-gray-200 hover:border-gray-400"
                      )}
                    >
                      <Image
                        src={product.images[0] || "/placeholder-product.jpg"}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                      <p
                        className="text-sm font-medium truncate"
                        title={product.name}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.price.toLocaleString("vi-VN")} đ
                      </p>
                      {formData.productIds.includes(product._id!) && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {errors.productIds && (
                <p className="text-red-500 text-sm mt-2">{errors.productIds}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="cursor-pointer"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          {isSaving ? "Đang lưu..." : initialData ? "Lưu thay đổi" : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
};
