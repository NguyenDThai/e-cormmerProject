"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Voucher {
  _id: string;
  code: string;
  value: number;
  createdAt: string;
  expiresAt: string;
}

interface VoucherFormProps {
  onVoucherCreated: (voucher: Voucher) => void;
  onVoucherUpdated: (voucher: Voucher) => void;
  editingVoucher: Voucher | null;
  setEditingVoucher: (voucher: Voucher | null) => void;
}

export default function VoucherForm({
  onVoucherCreated,
  onVoucherUpdated,
  editingVoucher,
  setEditingVoucher,
}: VoucherFormProps) {
  const [formData, setFormData] = useState({
    code: "",
    value: "",
    expiresAt: "",
  });

  // xét trường hợp có sửa hay không convert sang truthy falsthy
  const isEditingVoucher = !!editingVoucher;

  useEffect(() => {
    if (editingVoucher) {
      setFormData({
        code: editingVoucher.code,
        value: editingVoucher.value.toString(),
        expiresAt: new Date(editingVoucher.expiresAt)
          .toISOString()
          .split("T")[0],
      });
    } else {
      setFormData({ code: "", value: "", expiresAt: "" });
    }
  }, [editingVoucher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingVoucher
        ? `/api/vouchers/${editingVoucher._id}`
        : "/api/vouchers";
      const method = editingVoucher ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          value: Number(formData.value),
        }),
      });

      if (res.ok) {
        const voucher = await res.json();
        if (editingVoucher) {
          onVoucherUpdated(voucher);
          setEditingVoucher(null);
          toast.success("Chỉnh sửa voucher thành công");
        } else {
          onVoucherCreated(voucher);
          toast.success("Đã thêm voucher thành công");
        }
        setFormData({ code: "", value: "", expiresAt: "" });
      } else {
        const error = await res.json();
        toast.error(error.error);
      }
    } catch (error) {
      console.error(error);
      alert(`Error ${editingVoucher ? "updating" : "creating"} voucher`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setEditingVoucher(null);
    setFormData({ code: "", value: "", expiresAt: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Mã Voucher</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          readOnly={isEditingVoucher}
          className={
            isEditingVoucher
              ? "cursor-not-allowed w-full p-2 border rounded bg-gray-100"
              : "w-full p-2 border rounded"
          }
          required
        />
      </div>
      <div>
        <label className="block">Giá trị (%)</label>
        <input
          type="number"
          name="value"
          value={formData.value}
          onChange={handleChange}
          readOnly={isEditingVoucher}
          className={
            isEditingVoucher
              ? "cursor-not-allowed w-full p-2 border rounded bg-gray-100"
              : "w-full p-2 border rounded"
          }
          required
          min="0"
        />
      </div>
      <div>
        <label className="block">Ngày hết hạn</label>
        <input
          type="date"
          name="expiresAt"
          value={formData.expiresAt}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingVoucher ? "Cập nhật" : "Tạo"} Voucher
        </button>
        {editingVoucher && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
