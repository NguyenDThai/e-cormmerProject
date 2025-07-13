"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { StarIcon } from "lucide-react";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: { name: string };
}

interface RenderReviewsProps {
  reviews: Review[];
  averageRating: string;
}

const RenderReviews = ({ reviews }: RenderReviewsProps) => {
  return (
    <div className="mt-8 sm:mt-12 bg-white rounded-lg shadow-sm p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
        Đánh giá sản phẩm
        {reviews.length > 0 && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({reviews.length} đánh giá)
          </span>
        )}
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-base sm:text-lg">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        </div>
      ) : (
        <div className="space-y-6 divide-y divide-gray-100">
          {reviews.map((review: any) => (
            <div key={review._id} className="pt-6 first:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-800">
                    {review.userId?.name || "Ẩn danh"}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 text-base mt-2 pl-1">
                {review.comment}
              </p>

              {/* Thêm phần phản hồi (nếu có) */}
              {review.reply && (
                <div className="mt-3 ml-4 pl-4 border-l-2 border-blue-100 bg-blue-50 rounded-r p-3">
                  <p className="text-sm text-blue-800 font-medium">
                    Phản hồi từ cửa hàng
                  </p>
                  <p className="text-gray-600 text-sm mt-1">{review.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderReviews;
