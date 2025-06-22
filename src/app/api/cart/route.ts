/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await Cart.findOne({ user: session.user.id })
      .populate({
        path: "items.product",
        select: "name brand category images price salePrice",
      })
      .populate({
        path: "items.flashSale",
        select: "name discountPercent",
      });

    if (!cart) {
      return NextResponse.json({ cart: { items: [], total: 0 } });
    }

    return NextResponse.json({
      cart: {
        items: cart.items,
        total: cart.calculateTotal(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
