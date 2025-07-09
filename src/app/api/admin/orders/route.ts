/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import Order from "@/models/order";
import connectToDatabase from "@/lib/mongodb";

// Định nghĩa interface cho Order
interface Order {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: "SUCCESS" | "AWAITING_PAYMENT" | "PENDING";
  paymentMethod: "stripe" | "cod";
  createdAt: Date;
}

// Định nghĩa interface cho response
interface OrdersResponse {
  orders: Order[];
  totalCount: number;
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Xây dựng query với kiểu
    const query: { [key: string]: any } = {};
    if (status) {
      query.status = status as "SUCCESS" | "AWAITING_PAYMENT" | "PENDING";
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = {
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    // Lấy danh sách đơn hàng
    const rawOrders = await Order.find(query)
      .select("orderId userId amount status paymentMethod createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const orders: Order[] = rawOrders.map((order: any) => ({
      ...order,
      _id: order._id.toString(),
    }));

    // Đếm tổng số đơn hàng
    const totalCount = await Order.countDocuments(query);

    return NextResponse.json<OrdersResponse>(
      { orders, totalCount },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
