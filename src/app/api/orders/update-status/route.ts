/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Missing orderId or status" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Chỉ cho phép cập nhật từ AWAITING_PAYMENT sang SUCCESS cho COD
    if (
      order.paymentMethod !== "cod" ||
      order.status !== "AWAITING_PAYMENT" ||
      status !== "SUCCESS"
    ) {
      return NextResponse.json(
        { message: "Cập nhật trạng thái không hợp lệ" },
        { status: 400 }
      );
    }

    order.status = status;
    await order.save();
    return NextResponse.json(
      { message: "Status updated", order },
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
