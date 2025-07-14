"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import { useSession } from "next-auth/react";
import ReactPaginate from "react-paginate";

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

const OrderAdminPage = () => {
  const { status } = useSession();
  const { fetchAdminOrders, orders, totalOrders, cancelOrder } =
    useAppContext();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (status === "loading") return;
    fetchAdminOrders({
      status: selectedStatus,
      startDate,
      endDate,
      page: currentPage + 1,
      limit: itemsPerPage,
    });
  }, [
    status,
    selectedStatus,
    startDate,
    endDate,
    currentPage,
    fetchAdminOrders,
  ]);

  const generateInvoice = (order: Order) => {
    // Logic in hóa đơn (giữ nguyên hoặc tùy chỉnh)
    // Tạo nội dung HTML cho hóa đơn
    const invoiceContent = `
    <html>
  <head>
    <title>Hóa đơn ${order.orderId}</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f5f5f5;
        padding: 0;
        margin: 0;
      }
      .invoice-container {
        max-width: 800px;
        margin: 30px auto;
        background: white;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }
      .invoice-header {
        background: #4f46e5;
        color: white;
        padding: 30px;
        text-align: center;
      }
      .invoice-header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
      }
      .invoice-body {
        padding: 30px;
      }
      .invoice-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
      }
      .invoice-info-item {
        margin-bottom: 15px;
      }
      .invoice-info-item .label {
        font-weight: 600;
        color: #555;
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
      }
      .invoice-info-item .value {
        font-size: 16px;
        color: #333;
      }
      .status {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
      }
      .status-success {
        background-color: #d1fae5;
        color: #065f46;
      }
      .status-pending {
        background-color: #fef3c7;
        color: #92400e;
      }
      .print-btn {
        display: block;
        width: 200px;
        margin: 30px auto 0;
        padding: 12px;
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
      }
      .print-btn:hover {
        background: #4338ca;
        transform: translateY(-2px);
      }
      .invoice-footer {
        padding: 20px;
        text-align: center;
        color: #777;
        font-size: 14px;
        border-top: 1px solid #eee;
      }
      @media print {
        body {
          background: none;
        }
        .invoice-container {
          box-shadow: none;
          margin: 0;
          max-width: 100%;
        }
        .print-btn {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="invoice-header">
        <h1>HÓA ĐƠN THANH TOÁN</h1>
      </div>
      
      <div class="invoice-body">
        <div class="invoice-info">
          <div>
            <div class="invoice-info-item">
              <span class="label">Mã đơn hàng</span>
              <span class="value">${order.orderId}</span>
            </div>
            <div class="invoice-info-item">
              <span class="label">Ngày đặt hàng</span>
              <span class="value">${new Date(
                order.createdAt
              ).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
          
          <div>
            <div class="invoice-info-item">
              <span class="label">User ID</span>
              <span class="value">${order.userId}</span>
            </div>
            <div class="invoice-info-item">
              <span class="label">Phương thức thanh toán</span>
              <span class="value">${
                order.paymentMethod === "stripe"
                  ? "Thẻ ATM"
                  : "Thanh toán khi nhận hàng"
              }</span>
            </div>
          </div>
        </div>
        
        <div class="invoice-info-item">
          <span class="label">Trạng thái đơn hàng</span>
          <span class="value">
            <span class="status ${
              order.status === "SUCCESS" ? "status-success" : "status-pending"
            }">
              ${
                order.status === "SUCCESS"
                  ? "Hoàn tất"
                  : order.status === "AWAITING_PAYMENT"
                  ? "Chờ thanh toán"
                  : order.status
              }
            </span>
          </span>
        </div>
        
        <div class="invoice-info-item" style="margin-top: 30px;">
          <span class="label" style="font-size: 18px;">Tổng thanh toán</span>
          <span class="value" style="font-size: 24px; font-weight: 700; color: #4f46e5;">
            ${order.amount.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>
      
      <button class="print-btn" onclick="window.print()">In hóa đơn</button>
      
      <div class="invoice-footer">
        Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi
      </div>
    </div>
  </body>
</html>
  `;

    // Mở cửa sổ mới và ghi nội dung HTML
    const invoiceWindow = window.open("", "_blank");
    if (invoiceWindow) {
      invoiceWindow.document.write(invoiceContent);
      invoiceWindow.document.close();
    } else {
      alert("Vui lòng cho phép popup để xem hóa đơn!");
    }
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  if (status === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        <div className="flex items-end space-x-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Hoàn tất</option>
            <option value="AWAITING_PAYMENT">Chờ thanh toán</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="OVERDUE">Quá hạn</option>
          </select>
        </div>
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
              <th className="py-3 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
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
                <td className="py-3 px-4">
                  {order.paymentMethod === "ZaloPay"
                    ? "ZaloPay"
                    : order.paymentMethod === "stripe"
                    ? "Atm"
                    : "Cod"}
                </td>
                <td className="py-3 px-4">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-4 flex space-x-2 ">
                  <button
                    onClick={() => generateInvoice(order)}
                    className={
                      order.status === "CANCELLED"
                        ? "px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition hidden"
                        : "px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    }
                  >
                    In hóa đơn
                  </button>
                  {order.paymentMethod === "cod" &&
                    order.status === "OVERDUE" && (
                      <>
                        <button
                          onClick={() => cancelOrder(order.orderId)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Hủy đơn
                        </button>
                      </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalOrders > itemsPerPage && (
        <ReactPaginate
          pageCount={Math.ceil(totalOrders / itemsPerPage)}
          onPageChange={handlePageChange}
          containerClassName="flex justify-center items-center space-x-2 mt-4 "
          pageClassName="px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer"
          activeClassName="bg-blue-500 text-white"
          previousLabel="Trước"
          nextLabel="Sau"
        />
      )}
    </div>
  );
};

export default OrderAdminPage;
