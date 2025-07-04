/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

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
    | "CANCELLED";
  paymentMethod: "Stripe" | "cod";
  items: OrderItem[];
  createdAt: string;
}

const OrdersPage = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session || !session?.user.role || session.user.role !== "admin") {
        toast.error("Bạn không có quyền truy cập trang này");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/admin/orders?status=${selectedStatus}`
        );
        if (!response) {
          throw new Error("Không thể tải danh sách đơn hàng");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Có lỗi xảy ra khi tải đơn hàng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session, selectedStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="mb-6 p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả</option>
          <option value="SUCCESS">Hoàn tất</option>
          <option value="AWAITING_PAYMENT">Chờ toán toán</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="py-3 px-4 border-b">Mã đơn hàng</th>
              <th className="py-3 px-4 border-b">User ID</th>
              <th className="py-3 px-4 border-b">Tổng tiền</th>
              <th className="py-3 px-4 border-b">Trạng thái</th>
              <th className="py-3 px-4 border-b">Phương thức</th>
              <th className="py-3 px-4 border-b">Ngày đặt</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{order.orderId}</td>
                <td className="py-3 px-4">{order.userId}</td>
                <td className="py-3 px-4">
                  {order.amount.toLocaleString("vi-VN")} đ
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      order.status === "SUCCESS"
                        ? "bg-green-100 text-green-800"
                        : order.status === "AWAITING_PAYMENT"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status === "SUCCESS"
                      ? "Hoàn tất"
                      : order.status === "AWAITING_PAYMENT"
                      ? "Chờ thanh toán"
                      : order.status}
                  </span>
                </td>
                <td className="py-3 px-4">{order.paymentMethod}</td>
                <td className="py-3 px-4">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
