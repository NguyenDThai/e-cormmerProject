/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { orderId, action }: { orderId: string; action: "cancel" } =
      await request.json();

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
