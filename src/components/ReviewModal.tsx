/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppProvider";

interface ReviewModalProps {
  isOpen: boolean;
  orderId: string;
  productId: string;
  productName: string;
  onClose: () => void;
}

const ReviewModal = ({
  productName,
  onClose,
  isOpen,
  orderId,
  productId,
}: ReviewModalProps) => {
  const { submitReview, fetchUserReviews } = useAppContext();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitReview = async () => {
    if (rating < 1 || !comment.trim()) {
      toast.error("Vui lòng nhập số sao và bình luận");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitReview(orderId, productId, rating, comment);
      await fetchUserReviews();
      toast.success("Đánh giá đã được gửi, đang chờ duyệt");
      onClose();
      setComment("");
      setRating(0);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay với opacity */}
          <div
            className="fixed inset-0 bg-black opacity-15"
            onClick={onClose} // Có thể thêm chức năng đóng khi click bên ngoài
          />

          {/* Form không bị ảnh hưởng bởi opacity */}
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              Đánh giá sản phẩm: {productName}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá sao
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } focus:outline-none`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bình luận
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Nhập bình luận của bạn..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className={`px-4 py-2 text-white rounded-md ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none`}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewModal;
