/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppProvider";
import { useState } from "react";
import { toast } from "sonner";

const InputApplyVoucher = () => {
  const { appliedVoucher, applyVoucher, removeVoucher } = useAppContext();
  const [voucherCode, setVoucherCode] = useState("");
  const [isApply, setIsApply] = useState(false);
  const [voucherError, setVoucherError] = useState("");

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;

    setIsApply(true);
    setVoucherError("");

    try {
      await applyVoucher(voucherCode.trim());
      toast.success("Áp dụng voucher thành công");
    } catch (error) {
      setVoucherError("Áp dụng voucher không thành công");
    } finally {
      setIsApply(false);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="flex gap-4">
          <Input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Nhập mã voucher..."
            type="text"
            disabled={isApply || !!appliedVoucher}
          />
          {appliedVoucher ? (
            <Button
              onClick={removeVoucher}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Hủy voucher
            </Button>
          ) : (
            <Button
              onClick={handleApplyVoucher}
              disabled={isApply || !voucherCode.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isApply ? "Đang áp dụng..." : "Áp dụng"}
            </Button>
          )}
        </div>

        {voucherError && (
          <div className="text-red-500 text-sm mt-2">{voucherError}</div>
        )}

        {appliedVoucher && (
          <div className="text-green-500 text-sm mt-2">
            Đã áp dụng voucher: {appliedVoucher.code} (-{appliedVoucher.value}%)
          </div>
        )}
      </div>
    </div>
  );
};

export default InputApplyVoucher;
