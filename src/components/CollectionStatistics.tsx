"use client";
import { useAppContext } from "@/context/AppProvider";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  items: { productId: string; name: string; price: number; quantity: number }[];
  zalopayTransId?: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  codConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RevenueData {
  time: string;
  revenue: number;
}

const CollectionStatistics = () => {
  const { orders, fetchAllAdminOrders } = useAppContext();
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState<"day" | "month" | "year">("month");

  // Kiểm tra quyền admin
  const isAdmin = session?.user?.role === "admin";

  // Gọi fetchAllAdminOrders khi component được mount
  useEffect(() => {
    if (isAdmin) {
      fetchAllAdminOrders();
    }
  }, [fetchAllAdminOrders, isAdmin]);

  // Tính toán dữ liệu doanh thu theo khoảng thời gian
  const revenueData: RevenueData[] = useMemo(() => {
    if (!isAdmin) return [];

    console.log("Orders for revenue calculation:", orders.length, orders); // Log để kiểm tra

    const groupedRevenue: { [key: string]: number } = {};
    orders.forEach((order: Order) => {
      const date = new Date(order.createdAt);
      let key: string;
      if (timeRange === "day") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      } else if (timeRange === "month") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      } else {
        key = `${date.getFullYear()}`;
      }
      groupedRevenue[key] = (groupedRevenue[key] || 0) + order.amount;
    });

    const result = Object.entries(groupedRevenue)
      .map(([time, revenue]) => ({ time, revenue }))
      .sort((a, b) => a.time.localeCompare(b.time));
    console.log("Revenue data:", result); // Log để kiểm tra
    return result;
  }, [orders, isAdmin, timeRange]);

  // Tính tổng doanh thu
  // Tính tổng doanh thu
  const totalRevenue = useMemo(
    () =>
      isAdmin
        ? revenueData
            .reduce((sum, data) => sum + data.revenue, 0)
            .toLocaleString("vi-VN")
        : "0",
    [revenueData, isAdmin]
  );

  // Tính số đơn hàng
  const totalOrders = useMemo(() => {
    const count = isAdmin ? orders.length : 0;
    console.log("Total orders:", count); // Log để kiểm tra
    return count;
  }, [orders, isAdmin]);

  //    Dữ liệu cho biểu đồ
  const chartData = {
    labels: revenueData.map((data) => data.time),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: revenueData.map((data) => data.revenue),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Cấu hình biểu đồ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Doanh thu theo ${
          timeRange === "day" ? "ngày" : timeRange === "month" ? "tháng" : "năm"
        }`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Doanh thu (VND)",
        },
      },
      x: {
        title: {
          display: true,
          text:
            timeRange === "day"
              ? "Ngày"
              : timeRange === "month"
              ? "Tháng"
              : "Năm",
        },
      },
    },
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Thống kê doanh thu
        </h2>
        <select
          value={timeRange}
          onChange={(e) =>
            setTimeRange(e.target.value as "day" | "month" | "year")
          }
          className="p-2 border rounded-md bg-white text-gray-700"
        >
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>
      </div>

      {/* Tổng quan doanh thu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Tổng doanh thu</h3>
          <p className="text-2xl font-bold text-blue-600">{totalRevenue} đ</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">
            Số đơn hàng thành công
          </h3>
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      {revenueData.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p className="text-gray-500 text-sm sm:text-base">
          Chưa có dữ liệu doanh thu.
        </p>
      )}
    </div>
  );
};

export default CollectionStatistics;
