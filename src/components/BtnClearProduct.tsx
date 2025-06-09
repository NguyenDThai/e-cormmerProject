"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { CiTrash } from "react-icons/ci";
import { toast } from "sonner";

const BtnClearProduct = ({ productId }: { productId: string }) => {
  const route = useRouter();
  const handleDelete = async (product: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }
    try {
      const response = await fetch(`/api/product/edit/${product}`, {
        method: "delete",
      });
      if (!response.ok) {
        throw new Error("Xóa sản phẩm thất bại");
      }
      toast.success("Xóa sản phẩm thành công");
      route.refresh();
    } catch (error) {
      console.error("Delete error: ", error);
      toast.error("Đã xảy ra lỗi khi xóa sản phẩm");
    }
  };

  return (
    <>
      <button
        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        onClick={() => handleDelete(productId)}
      >
        <CiTrash className="w-5 h-5" />
      </button>
    </>
  );
};

export default BtnClearProduct;
