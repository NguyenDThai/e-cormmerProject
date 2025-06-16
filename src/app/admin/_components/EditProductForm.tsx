"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ProductData {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  salePrice?: number;
  quantity: number; // Added quantity
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
    features: string[];
    custom: Record<string, string>;
  };
  images: string[];
}

interface EditProductFormProps {
  productId: string;
}

const EditProductForm = ({ productId }: EditProductFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // Theo dõi ảnh bị xóa

  const [formData, setFormData] = useState<ProductData>({
    _id: "",
    name: "",
    brand: "",
    category: "phone",
    price: 0,
    description: "",
    salePrice: undefined,
    quantity: 0, // Added quantity
    configuration: {
      ram: undefined,
      storage: undefined,
      screenSize: undefined,
      battery: undefined,
      processor: "",
      cpu: "",
      gpu: "",
      sensorResolution: undefined,
      lensType: "",
      videoResolution: "",
      type: "",
      features: [],
      custom: {},
    },
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/edit/${productId}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const product = await response.json();
        console.log("Fetched Product:", product);
        setFormData({
          ...product,
          price: product.price || 0,
          salePrice: product.salePrice || undefined,
          quantity: product.quantity || 0, // Added quantity
          configuration: {
            ram: product.configuration?.ram || undefined,
            storage: product.configuration?.storage || undefined,
            screenSize: product.configuration?.screenSize || undefined,
            battery: product.configuration?.battery || undefined,
            processor: product.configuration?.processor || "",
            cpu: product.configuration?.cpu || "",
            gpu: product.configuration?.gpu || "",
            sensorResolution:
              product.configuration?.sensorResolution || undefined,
            lensType: product.configuration?.lensType || "",
            videoResolution: product.configuration?.videoResolution || "",
            type: product.configuration?.type || "",
            features: product.configuration?.features || [],
            custom: product.configuration?.custom || {},
          },
        });
        setExistingImages(product.images || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    return () => {
      newImages.forEach((file) =>
        URL.revokeObjectURL(URL.createObjectURL(file))
      );
    };
  }, [newImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log("Submitting Existing Images:", existingImages);
    console.log(
      "Submitting New Images:",
      newImages.map((f) => f.name)
    );
    console.log("Deleted Images:", deletedImages);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("category", formData.category);
    data.append("price", formData.price.toString());
    data.append("description", formData.description);
    data.append("quantity", formData.quantity.toString()); // Added quantity
    if (formData.salePrice)
      data.append("salePrice", formData.salePrice.toString());
    newImages.forEach((file) => data.append("images", file));
    console.log("FormData Images:", Array.from(data.getAll("images")));
    data.append("existingImages", JSON.stringify(existingImages));
    data.append("deletedImages", JSON.stringify(deletedImages)); // Gửi danh sách ảnh bị xóa
    data.append("configuration", JSON.stringify(formData.configuration));

    try {
      const response = await fetch(`/api/product/edit/${productId}`, {
        method: "PUT",
        body: data,
      });

      if (!response.ok) {
        const dataError = await response.json();
        throw new Error(dataError.error || "Failed to update product");
      }

      const responseData = await response.json();
      setExistingImages(responseData.data.images); // Cập nhật existingImages từ response
      setNewImages([]); // Reset newImages
      setDeletedImages([]); // Reset deletedImages
      toast.success("Cập nhật sản phẩm thành công");
      router.push("/admin/product");
    } catch (error) {
      setError((error as Error).message);
      toast.error(`Cập nhật sản phẩm thất bại: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("config.")) {
      const configField = name.replace("config.", "");
      setFormData((prev) => ({
        ...prev,
        configuration: {
          ...prev.configuration,
          [configField]: [
            "ram",
            "storage",
            "screenSize",
            "battery",
            "sensorResolution",
          ].includes(configField)
            ? value
              ? parseFloat(value)
              : undefined
            : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: ["price", "salePrice", "quantity"].includes(name)
          ? value
            ? parseFloat(value)
            : name === "salePrice"
            ? undefined
            : 0
          : value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    console.log(
      "Selected Files:",
      selectedFiles.map((f) => f.name)
    );
    if (selectedFiles.length > 0) {
      setNewImages((prev) => [...prev, ...selectedFiles]);
    }
  };

  useEffect(() => {
    console.log(
      "Update New Images:",
      newImages.map((f) => f.name)
    );
  }, [newImages]);

  const removeImage = (index: number, isNew: boolean) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const imageToRemove = existingImages[index];
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setDeletedImages((prev) => [...prev, imageToRemove]); // Thêm ảnh bị xóa vào danh sách
    }
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);
    setFormData((prev) => ({
      ...prev,
      configuration: { ...prev.configuration, features },
    }));
  };

  const handleCustomChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        custom: { ...prev.configuration.custom, [key]: value },
      },
    }));
  };

  return (
    <div className="container mx-auto max-w-[700px] p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Chỉnh sửa sản phẩm
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Thương hiệu</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Loại sản phẩm</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="phone">Phone</option>
            <option value="laptop">Laptop</option>
            <option value="airpod">Airpod</option>
            <option value="mouse">Mouse</option>
            <option value="gaming">Gaming</option>
            <option value="camera">Camera</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Giá</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Số lượng</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            min="0"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Giảm giá (Optional)</label>
          <input
            type="number"
            name="salePrice"
            value={formData.salePrice || ""}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Hình ảnh</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            multiple
            className="w-full border rounded p-2"
          />
          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <Image
                    src={img}
                    alt={`${formData.name} - Ảnh ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => removeImage(index, false)}
                  >
                    X
                  </Button>
                </div>
              ))}
              {newImages.map((file, index) => (
                <div key={`new-${index}`} className="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`${formData.name} - Ảnh mới ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => removeImage(index, true)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-4">
          {formData.category !== "airpod" && formData.category !== "mouse" && (
            <h2 className="text-lg font-semibold mb-2">Cấu hình sản phẩm</h2>
          )}
          {formData.category === "phone" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700">RAM (GB)</label>
                <input
                  type="number"
                  name="config.ram"
                  value={formData.configuration.ram || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Lưu trữ (GB)</label>
                <input
                  type="number"
                  name="config.storage"
                  value={formData.configuration.storage || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">
                  Kích thước màn hình (inches)
                </label>
                <input
                  type="number"
                  name="config.screenSize"
                  value={formData.configuration.screenSize || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Pin (mAh)</label>
                <input
                  type="number"
                  name="config.battery"
                  value={formData.configuration.battery || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Bộ xử lý (chip)</label>
                <input
                  type="text"
                  name="config.processor"
                  value={formData.configuration.processor || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}
          {formData.category === "laptop" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700">RAM (GB)</label>
                <input
                  type="number"
                  name="config.ram"
                  value={formData.configuration.ram || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Lưu trữ (GB)</label>
                <input
                  type="number"
                  name="config.storage"
                  value={formData.configuration.storage || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">
                  Kích thước màn hình (inches)
                </label>
                <input
                  type="number"
                  name="config.screenSize"
                  value={formData.configuration.screenSize || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">CPU</label>
                <input
                  type="text"
                  name="config.cpu"
                  value={formData.configuration.cpu || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">GPU</label>
                <input
                  type="text"
                  name="config.gpu"
                  value={formData.configuration.gpu || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}
          {formData.category === "camera" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700">
                  Độ phân giải cảm biến (MP)
                </label>
                <input
                  type="number"
                  name="config.sensorResolution"
                  value={formData.configuration.sensorResolution || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Lưu trữ (GB)</label>
                <input
                  type="number"
                  name="config.storage"
                  value={formData.configuration.storage || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Loại ống kính</label>
                <input
                  type="text"
                  name="config.lensType"
                  value={formData.configuration.lensType || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">
                  Độ phân giải Video
                </label>
                <input
                  type="text"
                  name="config.videoResolution"
                  value={formData.configuration.videoResolution || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}
          {formData.category === "gaming" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700">RAM (GB)</label>
                <input
                  type="number"
                  name="config.ram"
                  value={formData.configuration.ram || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Lưu trữ (GB)</label>
                <input
                  type="number"
                  name="config.storage"
                  value={formData.configuration.storage || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Loại thiết bị</label>
                <input
                  type="text"
                  name="config.type"
                  value={formData.configuration.type || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">
                  Tính năng (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="config.features"
                  value={formData.configuration.features.join(", ") || ""}
                  onChange={handleFeaturesChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}
          {formData.category === "other" && (
            <div className="mb-2">
              <label className="block text-gray-700">Cấu hình tùy chỉnh</label>
              {Object.entries(formData.configuration.custom).map(
                ([key, value]) => (
                  <div key={key} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Khóa"
                      value={key}
                      onChange={(e) => {
                        const newCustom = { ...formData.configuration.custom };
                        delete newCustom[key];
                        if (e.target.value) newCustom[e.target.value] = value;
                        setFormData((prev) => ({
                          ...prev,
                          configuration: {
                            ...prev.configuration,
                            custom: newCustom,
                          },
                        }));
                      }}
                      className="w-1/2 border rounded p-2"
                    />
                    <input
                      type="text"
                      placeholder="Giá trị"
                      value={value}
                      onChange={(e) => handleCustomChange(key, e.target.value)}
                      className="w-1/2 border rounded p-2"
                    />
                  </div>
                )
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCustomChange(
                    `key${Object.keys(formData.configuration.custom).length}`,
                    ""
                  )
                }
              >
                Thêm cấu hình tùy chỉnh
              </Button>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 w-full"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
        </Button>
      </form>
    </div>
  );
};

export default EditProductForm;
