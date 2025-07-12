/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import ReactPaginate from "react-paginate";

interface Review {
  _id: string;
  orderId: string;
  userId: { name: string; email: string };
  productId: { name: string };
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Quản lý đánh giá
          </h1>
          <div className="w-full sm:w-auto">
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
              className="block w-full sm:w-48 px-4 py-2 text-base border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả đánh giá</option>
              <option value="true">Đã duyệt</option>
              <option value="false">Chưa duyệt</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã đơn hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sản phẩm
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Người dùng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Đánh giá
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bình luận
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminReviews.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{review.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {review.productId.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {review.userId.name || review.userId.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-5 w-5 ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.comment}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        review.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {review.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApproveReview(review._id)}
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors"
                      >
                        Duyệt
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalReviews > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200">
            <ReactPaginate
              pageCount={Math.ceil(totalReviews / itemsPerPage)}
              onPageChange={handlePageChange}
              containerClassName="flex items-center justify-between"
              pageClassName="mx-1"
              pageLinkClassName="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-50"
              activeLinkClassName="bg-blue-50 text-blue-600 border-blue-200"
              previousClassName="mr-auto"
              nextClassName="ml-auto"
              previousLinkClassName="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-50"
              nextLinkClassName="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-50"
              disabledLinkClassName="text-gray-400 cursor-not-allowed hover:bg-white"
              previousLabel="← Trước"
              nextLabel="Sau →"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
