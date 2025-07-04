/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Order from "@/models/order";
import connectToDatabase from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = {};
    if (status && status !== "") {
      query.status = status; // Lọc theo trạng thái nếu có
    }
    const orders = await Order.find(query).lean();
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
