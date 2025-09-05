/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import ReactPaginate from "react-paginate";
import { StarIcon } from "lucide-react";

interface Review {
  _id: string;
  orderId: string;
  userId: { name: string; email: string } | null;
  productId: { name: string } | null;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

const ReviewPage = () => {
  const { fetchAdminReviews, totalReviews, adminReviews } = useAppContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [isApprovedFilter, setIsApprovedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdminReviews({
      page: currentPage + 1,
      limit: itemsPerPage,
      isApproved: isApprovedFilter,
    });
  }, [currentPage, isApprovedFilter, fetchAdminReviews]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      const response = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ reviewId, action: "approve" }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Khong the duyet danh gia");
      }

      fetchAdminReviews({
        page: currentPage + 1,
        limit: itemsPerPage,
        isApproved: isApprovedFilter,
      });
    } catch (error: any) {
      alert(error.message || "Lỗi khi duyệt đánh giá");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      const response = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ reviewId, action: "delete" }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Khong the xoa danh gia");
      }
      fetchAdminReviews({
        page: currentPage + 1,
        limit: itemsPerPage,
        isApproved: isApprovedFilter,
      });
    } catch (error: any) {
      alert(error.message || "Lỗi khi xóa đánh giá");
    }
  };

  const toggleComment = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const reviews: Review[] = adminReviews as unknown as Review[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-gray-800">
            Quản lý đánh giá
          </h1>
          <div className="w-full sm:w-48">
            <select
              value={
                isApprovedFilter === undefined
                  ? ""
                  : isApprovedFilter.toString()
              }
              onChange={(e) =>
                setIsApprovedFilter(
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="w-full px-3 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả đánh giá</option>
              <option value="true">Đã duyệt</option>
              <option value="false">Chưa duyệt</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bình luận
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{review.orderId}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {review.productId?.name || "Sản phẩm đã bị xóa"}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900 line-clamp-1">
                      {review.userId?.name ||
                        review.userId?.email ||
                        "Người dùng đã bị xóa"}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="group relative">
                      <p
                        className={`text-sm text-gray-600 ${
                          !expandedComments[review._id] ? "line-clamp-2" : ""
                        }`}
                      >
                        {review.comment || "Không có bình luận"}
                      </p>
                      {review.comment.length > 60 && (
                        <button
                          onClick={() => toggleComment(review._id)}
                          className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                        >
                          {expandedComments[review._id]
                            ? "Thu gọn"
                            : "Xem thêm"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
                        review.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {review.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApproveReview(review._id)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-xs"
                      >
                        Duyệt
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded text-xs"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalReviews > itemsPerPage && (
          <div className="px-5 py-3 border-t border-gray-200">
            <ReactPaginate
              pageCount={Math.ceil(totalReviews / itemsPerPage)}
              onPageChange={handlePageChange}
              containerClassName="flex items-center justify-between text-sm"
              pageClassName="mx-1"
              pageLinkClassName="px-3 py-1 border rounded hover:bg-gray-50"
              activeLinkClassName="bg-blue-50 text-blue-600 border-blue-200"
              previousClassName="mr-2"
              nextClassName="ml-2"
              previousLinkClassName="px-3 py-1 border rounded hover:bg-gray-50"
              nextLinkClassName="px-3 py-1 border rounded hover:bg-gray-50"
              disabledLinkClassName="text-gray-400 cursor-not-allowed hover:bg-white"
              previousLabel="←"
              nextLabel="→"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
