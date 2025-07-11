/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import Order from "@/models/order";
import connectToDatabase from "@/lib/mongodb";

// Định nghĩa interface cho Order
interface OrderType {
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
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa interface cho response
interface OrdersResponse {
  orders: OrderType[];
  totalCount: number;
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Kiểm tra và cập nhật trạng thái OVERDUE
    const overdueThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await Order.updateMany(
      {
        paymentMethod: "cod",
        status: "AWAITING_PAYMENT",
        codConfirmed: false,
        createdAt: { $lte: overdueThreshold },
      },
      { $set: { status: "OVERDUE", updatedAt: new Date() } }
    );

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: { [key: string]: any } = {};
    if (status) {
      query.status = status as OrderType["status"];
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

    const rawOrders = await Order.find(query)
      .select(
        "orderId userId amount status paymentMethod createdAt codConfirmed items"
      )
      .populate("items.productId", "name price")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const orders: OrderType[] = rawOrders.map((order: any) => ({
      ...order,
      _id: order._id.toString(),
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
    }));

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

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const {
      orderId,
      action,
    }: { orderId: string; action: "cancel" | "contact" } = await request.json();

    if (action === "cancel") {
      const order = await Order.findOneAndUpdate(
        { orderId },
        { $set: { status: "CANCELLED", updatedAt: new Date() } },
        { new: true }
      );
      if (!order) {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Order cancelled successfully", order },
        { status: 200 }
      );
    } else if (action === "contact") {
      // Logic liên hệ khách hàng (ví dụ: gửi email, thông báo)
      return NextResponse.json(
        { message: "Contact request sent" },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error processing order action:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
