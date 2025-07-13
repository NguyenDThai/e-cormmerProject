"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppContext } from "@/context/AppProvider";
import { toast } from "sonner";
import ReviewModal from "@/components/ReviewModal";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Order {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED"
    | "AWAITING_PAYMENT"
    | "CANCELLED"
    | "OVERDUE";
  paymentMethod: "ZaloPay" | "stripe" | "cod";
  items: OrderItem[];
  zalopayTransId?: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  codConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

const OrderPage = () => {
  const { data: session, status } = useSession();
  const {
    confirmOrder,
    fetchUserOrders,
    orders,
    userReviews,
    fetchUserReviews,
  } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProductName, setSelectedProductName] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.id) {
      console.log("No user session, cannot fetch orders");
      return;
    }
    fetchUserOrders();
    fetchUserReviews();
  }, [status, session, fetchUserOrders, fetchUserReviews]);

  const openReviewModal = (
    orderId: string,
    productId: string,
    productName: string
  ) => {
    setSelectedOrderId(orderId);
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId("");
    setSelectedProductId("");
    setSelectedProductName("");
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await confirmOrder(orderId);
      await fetchUserOrders();
      await fetchUserReviews(); // Làm mới reviews sau khi xác nhận đơn hàng
      toast.success("Xác nhận nhận hàng thành công");
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Lỗi khi xác nhận đơn hàng");
    }
  };

  const hasReviewedProduct = (orderId: string, productId: string) => {
    return userReviews.some(
      (review) => review.orderId === orderId && review.productId === productId
    );
  };

  if (status === "loading") {
    return <div>Đang tải...</div>;
  }

  if (!session?.user?.id) {
    return <div>Vui lòng đăng nhập để xem đơn hàng</div>;
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch("/api/orders/cancel-order", {
        method: "POST",
        body: JSON.stringify({ orderId, action: "cancel" }),
        headers: { "Content-type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Không thể hủy đơn hàng");
      }
      fetchUserOrders();
      toast.success("Đơn hàng đã của bạn đã được hủy");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử đơn hàng</h1>
          <p className="text-gray-500 mt-1">
            Xem và quản lý các đơn hàng của bạn
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Không có đơn hàng nào
            </h3>
            <p className="mt-1 text-gray-500">
              Bạn chưa có đơn hàng nào được ghi nhận
            </p>
          </div>
        ) : (
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
                    Tên sản phẩm
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tổng tiền
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phương thức
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày đặt
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
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        #{order.orderId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {order.items[0].name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.amount.toLocaleString("vi-VN")} đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          order.status === "SUCCESS"
                            ? "bg-green-100 text-green-800"
                            : order.status === "AWAITING_PAYMENT"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "OVERDUE"
                            ? "bg-red-100 text-red-800"
                            : order.status === "CANCELLED"
                            ? "bg-gray-100 text-gray-800"
                            : order.status === "PROCESSING"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "FAILED"
                            ? "bg-red-200 text-red-900"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status === "SUCCESS"
                          ? "Hoàn tất"
                          : order.status === "AWAITING_PAYMENT"
                          ? "Chờ thanh toán"
                          : order.status === "OVERDUE"
                          ? "Quá hạn"
                          : order.status === "CANCELLED"
                          ? "Đã hủy"
                          : order.status === "PROCESSING"
                          ? "Đang xử lý"
                          : order.status === "FAILED"
                          ? "Thất bại"
                          : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {order.paymentMethod === "ZaloPay"
                          ? "ZaloPay"
                          : order.paymentMethod === "stripe"
                          ? "Thẻ ATM"
                          : "Tiền mặt (COD)"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <>
                        {order.paymentMethod === "cod" &&
                          order.status === "AWAITING_PAYMENT" &&
                          !order.codConfirmed && (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() =>
                                  handleConfirmOrder(order.orderId)
                                }
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Xác nhận nhận hàng
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order.orderId)}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Hủy đơn
                              </button>
                            </div>
                          )}
                        {order.status === "SUCCESS" && (
                          <div className="flex justify-end space-x-2">
                            {order.items.map((item) => (
                              <button
                                key={item.productId}
                                onClick={() =>
                                  openReviewModal(
                                    order.orderId,
                                    item.productId,
                                    item.name
                                  )
                                }
                                disabled={hasReviewedProduct(
                                  order.orderId,
                                  item.productId
                                )}
                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                                  hasReviewedProduct(
                                    order.orderId,
                                    item.productId
                                  )
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                              >
                                {hasReviewedProduct(
                                  order.orderId,
                                  item.productId
                                )
                                  ? "Đã đánh giá"
                                  : `Đánh giá`}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={closeReviewModal}
        productName={selectedProductName}
        productId={selectedProductId}
        orderId={selectedOrderId}
      />
    </div>
  );
};

export default OrderPage;
