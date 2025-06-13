"use client";
import VoucherForm from "@/app/admin/_components/VoucherForm";
import VoucherList from "@/app/admin/_components/VoucherList";
import { useEffect, useState } from "react";

interface Voucher {
  _id: string;
  code: string;
  value: number;
  createdAt: string;
  expiresAt: string;
}

const VoucherPage = () => {
  const [voucher, setVoucher] = useState<Voucher[]>([]);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  const fetchVouchers = async () => {
    try {
      const res = await fetch("/api/vouchers", {
        cache: "no-store", // Đảm bảo dữ liệu mới nhất
      });
      if (!res.ok) {
        throw new Error("Failed to fetch vouchers");
      }
      const data = await res.json();
      setVoucher(data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };
  useEffect(() => {
    fetchVouchers();
  }, []);
  const handleVoucherCreated = (newVoucher: Voucher) => {
    setVoucher([newVoucher, ...voucher]);
  };
  const handleVoucherUpdated = (updatedVoucher: Voucher) => {
    setVoucher(
      voucher.map((voucher) =>
        voucher._id === updatedVoucher._id ? updatedVoucher : voucher
      )
    );
  };
  const handleVoucherDeleted = (id: string) => {
    setVoucher(voucher.filter((voucher) => voucher._id !== id));
  };

  const handleEditVoucher = (voucher: Voucher) => {
    setEditingVoucher(voucher);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Voucher</h1>
          <div className="mt-2 md:mt-0 flex items-center space-x-2">
            <span className="text-sm text-gray-500">Tổng số voucher:</span>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
              {voucher.length}
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingVoucher ? "Cập nhật Voucher" : "Tạo Voucher Mới"}
              </h2>
            </div>
            <div className="p-5">
              <VoucherForm
                onVoucherCreated={handleVoucherCreated}
                onVoucherUpdated={handleVoucherUpdated}
                editingVoucher={editingVoucher}
                setEditingVoucher={setEditingVoucher}
              />
            </div>
          </div>

          {/* List Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-800  pt-5 px-5">
              Danh sách Voucher
            </h2>
            <div className="p-1">
              <VoucherList
                voucher={voucher}
                onVoucherDeleted={handleVoucherDeleted}
                onEditVoucher={handleEditVoucher}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherPage;
