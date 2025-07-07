"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import { useSession } from "next-auth/react";
import ReactPaginate from "react-paginate";

const FavoriteAdminPage = () => {
  const { status } = useSession();
  const { fetchAdminFavorites, adminFavorites, totalFavorites } =
    useAppContext();
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (status === "loading") return;
    fetchAdminFavorites();
  }, [status, currentPage, fetchAdminFavorites]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm yêu thích</h1>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 h-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Quản lý sản phẩm yêu thích
      </h1>

      {adminFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="text-gray-500 text-lg">
            Không có sản phẩm yêu thích nào
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá (VND)
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số người yêu thích
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminFavorites.map((item) => (
                  <React.Fragment key={item.productId}>
                    <tr className="transition-colors hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {item.productName || "—"}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {item.productSalePrice
                          ? item.productSalePrice.toLocaleString("vi") + "₫"
                          : item.productPrice.toLocaleString("vi") + "₫"}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.favoriteCount || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() =>
                            setExpandedProduct(
                              expandedProduct === item.productId
                                ? null
                                : item.productId
                            )
                          }
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          {expandedProduct === item.productId
                            ? "Ẩn chi tiết"
                            : "Xem chi tiết"}
                        </button>
                      </td>
                    </tr>
                    {expandedProduct === item.productId && (
                      <tr>
                        <td colSpan={5} className="py-4 px-4 bg-gray-50">
                          <div className="text-sm text-gray-600">
                            <p className="font-medium mb-2 flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Danh sách người yêu thích:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-0">
                              {item.userEmails.map((email, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center bg-white p-2 rounded shadow-sm border border-gray-100"
                                >
                                  <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs mr-2">
                                    {idx + 1}
                                  </span>
                                  {email}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <ReactPaginate
              pageCount={Math.ceil(totalFavorites / itemsPerPage)}
              onPageChange={handlePageChange}
              containerClassName="flex items-center justify-center space-x-2"
              pageClassName="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 hover:text-black transition-colors"
              activeClassName="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              previousClassName="flex items-center justify-center px-4 h-10 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
              nextClassName="flex items-center justify-center px-4 h-10 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
              previousLabel="Trước"
              nextLabel="Sau"
              breakLabel="..."
              breakClassName="flex items-center justify-center w-10 h-10"
              disabledClassName="opacity-50 cursor-not-allowed"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteAdminPage;
