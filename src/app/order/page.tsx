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
  amount: number;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED"
    | "AWAITING_PAYMENT"
    | "CANCELLED";
  paymentMethod: "stripe" | "cod";
  items: OrderItem[];
  createdAt: string;
}

const OrderPage = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!session?.user.id) {
        toast.error("Vui lòng đăng nhập để xem đơn hàng!");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders?userId=${session.user.id}`);
        if (!response.ok) {
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

    fetchOrder();
  }, [session]);

  const handleUpdateStatus = async (orderId: string) => {
    if (
      !confirm(
        "Bạn đã nhận hàng và thanh toán? Xác nhận sẽ cập nhật trạng thái thành 'Hoàn tất'."
      )
    )
      return;

    try {
      const response = await fetch("/api/orders/update-status", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ orderId, status: "SUCCESS" }),
      });

      if (!response.ok) throw new Error("Cập nhật trạng thái thất bại");

      await response.json();
      setOrders((prevOrder) =>
        prevOrder.map((order) =>
          order.orderId === orderId ? { ...order, status: "SUCCESS" } : order
        )
      );
      toast.success("Trạng thái đơn hàng đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-600">
          Vui lòng đăng nhập để xem lịch sử đơn hàng.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h1>
        <p>Bạn chưa có đơn hàng nào được thanh toán hoặc đang chờ xử lý.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-sm rounded-lg p-4 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                Đơn hàng #{order.orderId}
              </h2>
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
            </div>
            <p className="text-gray-600 mb-2">
              Phương thức thanh toán: {order.paymentMethod}
            </p>
            <p className="text-gray-600 mb-2">
              Ngày đặt hàng:{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </p>
            <p className="text-gray-600 mb-2">
              Tổng tiền: {order.amount.toLocaleString("vi-VN")} đ
            </p>
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Sản phẩm:</h3>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between text-gray-700"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      {(order.amount
                        ? order.amount
                        : item.price * item.quantity
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {order.paymentMethod === "cod" &&
              order.status === "AWAITING_PAYMENT" && (
                <button
                  onClick={() => handleUpdateStatus(order.orderId)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Xác nhận đã nhận hàng và thanh toán
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
