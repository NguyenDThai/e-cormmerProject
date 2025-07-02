/* eslint-disable @typescript-eslint/no-explicit-any */
import Order from "@/models/order";
import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const orders = await Order.find({ userId }).lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.log("Error fetching orders", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
