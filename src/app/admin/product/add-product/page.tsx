"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const AddProductForm = () => {
  const { data: session, status } = useSession();

  const route = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "phone",
    price: "",
    description: "",
    salePrice: "",
    image: null as File | null,
  });

  // Clean up URL.createObjectURL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
    };
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
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
    if (formData.image) data.append("image", formData.image);
    try {
      const response = await fetch("/api/product", {
        method: "post",
        body: data,
      });

      if (!response.ok) {
        const dataError = await response.json();
        throw new Error(dataError.error || "Failed to upload product");
      }

      const result = await response.json();
      console.log(result);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setFile(file);
    }
  };

  if (status === "loading") {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

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
            <option value="airpod">Airpod</option>
            <option value="mouse">Mouse</option>
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
          {file && (
            <div>
              <Image
                src={URL.createObjectURL(file)}
                alt="check-image"
                width={100}
                height={100}
              />
              <Button
                type="button"
                variant={"destructive"}
                size={"sm"}
                onClick={() => {
                  setFile(null);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
              >
                Xoa
              </Button>
            </div>
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
