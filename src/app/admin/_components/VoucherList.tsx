"use client";

import React from "react";
import { FaTrash } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { toast } from "sonner";

interface Voucher {
  _id: string;
  code: string;
  value: number;
  createdAt: string;
  expiresAt: string;
}

interface VoucherListProps {
  voucher: Voucher[];
  onVoucherDeleted: (id: string) => void;
  onEditVoucher: (voucher: Voucher) => void;
}

const VoucherList = ({
  voucher,
  onVoucherDeleted,
  onEditVoucher,
}: VoucherListProps) => {
  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa voucher này?")) {
      try {
        const res = await fetch(`/api/vouchers/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          onVoucherDeleted(id);
          toast.success("Đã xóa voucher thành công");
        } else {
          const error = await res.json();
          toast.error(error.error);
        }
      } catch (error) {
        console.error(error);
        alert("Error deleting voucher");
      }
    }
  };
  return (
    <div className="mt-4">
      <div className=" rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã Voucher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá trị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hết hạn
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {voucher.map((vouchers) => (
              <tr
                key={vouchers._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {vouchers.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    {vouchers.value}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(vouchers.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      new Date(vouchers.expiresAt) < new Date()
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {new Date(vouchers.expiresAt).toLocaleDateString("vi-VN")}
                    {new Date(vouchers.expiresAt) < new Date() && (
                      <span className="ml-1">(Hết hạn)</span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEditVoucher(vouchers)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <IoPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(vouchers._id)}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors duration-200 cursor-pointer"
                      title="Xóa"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherList;
