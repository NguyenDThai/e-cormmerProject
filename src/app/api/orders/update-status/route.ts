/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ConfirmRequest {
  orderId: string;
  status: "SUCCESS";
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
  items: { productId: string; name: string; price: number; quantity: number }[];
  zalopayTransId?: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  codConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: Request) {
  try {
    // Kiểm tra session
    const session = await getServerSession(authOptions);
    console.log(
      "Session:",
      session?.user?.id ? { userId: session.user.id } : "No session"
    );
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Kết nối database
    await connectToDatabase();

    // Lấy dữ liệu
    let body: ConfirmRequest;
    try {
      body = await request.json();
      console.log("Request body:", body);
    } catch (error) {
      console.error("Invalid JSON body:", error);
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { orderId, status } = body;
    if (!orderId || !status) {
      console.log("Missing fields:", { orderId, status });
      return NextResponse.json(
        { message: "Missing orderId or status" },
        { status: 400 }
      );
    }

    // Tìm đơn hàng
    const order = await Order.findOne({ orderId, userId: session.user.id });
    console.log("Order query:", {
      orderId,
      userId: session.user.id,
      found: !!order,
    });
    if (!order) {
      return NextResponse.json(
        { message: "Order not found or not authorized" },
        { status: 404 }
      );
    }

    // Kiểm tra quá hạn (7 ngày)
    const overdueThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (
      order.paymentMethod === "cod" &&
      order.status === "AWAITING_PAYMENT" &&
      order.createdAt <= overdueThreshold &&
      !order.codConfirmed
    ) {
      order.status = "OVERDUE";
      await order.save();
      return NextResponse.json(
        { message: "Đơn đặc hàng của bạn đã quá hạn" },
        { status: 400 }
      );
    }

    // Kiểm tra trạng thái hợp lệ
    if (
      order.paymentMethod !== "cod" ||
      order.status !== "AWAITING_PAYMENT" ||
      status !== "SUCCESS"
    ) {
      console.log("Invalid update:", {
        paymentMethod: order.paymentMethod,
        status: order.status,
        requestedStatus: status,
      });
      return NextResponse.json(
        { message: "Cập nhật trạng thái không hợp lệ" },
        { status: 400 }
      );
    }

    // Cập nhật đơn hàng
    order.status = status;
    order.codConfirmed = true;
    order.updatedAt = new Date();
    await order.save();
    console.log("Order updated:", order.orderId);

    return NextResponse.json(
      { message: "Status updated", order: order.toObject() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating order status:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
