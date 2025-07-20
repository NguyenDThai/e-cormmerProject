import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/order";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const orders = await Order.find({
      status: { $in: ["SUCCESS", "CANCELLED"] },
    })
      .select("_id amount createdAt items status")
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
