/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE() {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: session.user.id },
      { $set: { items: [] } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      cart: {
        items: cart?.items || [],
        total: 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
