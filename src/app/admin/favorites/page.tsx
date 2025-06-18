"use client";
import React, { useEffect } from "react";
import { useAppContext } from "@/context/AppProvider";
import { useSession } from "next-auth/react";

const FavotiteAdminPage = () => {
  const { data: session, status } = useSession();
  const { fetchAdminFavorites, adminFavorites } = useAppContext();

  useEffect(() => {
    if (status === "loading") return;
    fetchAdminFavorites();
  }, [status, session, fetchAdminFavorites]);

  if (status === "loading") {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm yêu thích</h1>
        <p>Đang tải...</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 md:p-6 h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Quản lý sản phẩm yêu thích
      </h1>

      {adminFavorites.length === 0 ? (
        <div className="text-center py-10">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-500 text-lg">
            Không có sản phẩm yêu thích nào
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá (VND)
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người yêu thích
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminFavorites.map((item, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-gray-50 even:bg-gray-50/30"
                >
                  <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item?.productName || "—"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 max-w-xs truncate">
                    {item?.productDescription || "—"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {item?.productSalePrice
                      ? item.productSalePrice.toLocaleString("vi") + "₫"
                      : item.productPrice.toLocaleString("vi") + "₫"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-blue-500">
                    {item?.userEmail || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FavotiteAdminPage;
