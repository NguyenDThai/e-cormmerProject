"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FaRegTrashAlt } from "react-icons/fa";

const AddProductForm = () => {
  const route = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "phone",
    price: "",
    description: "",
    salePrice: "",
    configuration: {
      ram: "",
      storage: "",
      screenSize: "",
      battery: "",
      processor: "",
      cpu: "",
      gpu: "",
      sensorResolution: "",
      lensType: "",
      videoResolution: "",
      type: "",
      features: [] as string[],
      custom: {} as Record<string, string>,
    },
  });

  // Clean up URL.createObjectURL to prevent memory leaks
  useEffect(() => {
    return () => {
      files.forEach((files) => URL.revokeObjectURL(URL.createObjectURL(files)));
    };
  }, [files]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("description", formData.description);
    if (formData.salePrice) data.append("salePrice", formData.salePrice);
    files.forEach((file) => data.append("images", file));
    data.append("configuration", JSON.stringify(formData.configuration));

    try {
      const response = await fetch("/api/product/add-product", {
        method: "post",
        body: data,
      });

      if (!response.ok) {
        const dataError = await response.json();
        throw new Error(dataError.error || "Failed to upload product");
      }

      await response.json();
      toast.success("Đã thêm sản phẩm thành công");
      route.push("/admin/product");
    } catch (error) {
      setError((error as Error).message);
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
        configuration: { ...prev.configuration, [configField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (inputRef.current) {
      inputRef.current.value = "";
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

  return (
    <div className="container mx-auto max-w-[700px] p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Thêm sản phẩm mới</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 "
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
            <option value="airport">Airport</option>
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
          <label className="block text-gray-700">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Giảm giá (Optional)</label>
          <input
            type="number"
            name="salePrice"
            value={formData.salePrice}
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
            name="image"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            className="w-full border rounded p-2"
            required
          />
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    width={100}
                    height={100}
                    className="rounded object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-4"
                    onClick={() => removeFile(index)}
                  >
                    <FaRegTrashAlt />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* config */}
        <div className="mb-4">
          {formData.category !== "airport" && formData.category !== "mouse" && (
            <h2 className="text-lg font-semibold mb-2">Cấu hình sản phẩm</h2>
          )}

          {/* Phone */}
          {formData.category === "phone" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700">RAM (GB)</label>
                <input
                  type="number"
                  name="config.ram"
                  value={formData.configuration.ram}
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
                  value={formData.configuration.storage}
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
                  value={formData.configuration.screenSize}
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
                  value={formData.configuration.battery}
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
                  value={formData.configuration.processor}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}
          {/* laptop */}
          {formData.category === "laptop" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700">RAM (GB)</label>
                <input
                  type="number"
                  name="config.ram"
                  value={formData.configuration.ram}
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
                  value={formData.configuration.storage}
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
                  value={formData.configuration.screenSize}
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
                  value={formData.configuration.cpu}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">GPU</label>
                <input
                  type="text"
                  name="config.gpu"
                  value={formData.configuration.gpu}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}
          {/* Camera */}
          {formData.category === "camera" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700">
                  Độ phân giải cảm biến (MP)
                </label>
                <input
                  type="number"
                  name="config.sensorResolution"
                  value={formData.configuration.sensorResolution}
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
                  value={formData.configuration.storage}
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
                  value={formData.configuration.lensType}
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
                  value={formData.configuration.videoResolution}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}
          {/* Thiết bị cơi game */}
          {formData.category === "gaming" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700">RAM (GB)</label>
                <input
                  type="number"
                  name="config.ram"
                  value={formData.configuration.ram}
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
                  value={formData.configuration.storage}
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
                  value={formData.configuration.type}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Tính Năng</label>
                <input
                  type="text"
                  name="config.features"
                  value={formData.configuration.features.join(", ")}
                  onChange={handleFeaturesChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Thêm sản phẩm"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
