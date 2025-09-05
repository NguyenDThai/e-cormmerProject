import Product from "@/models/product";
import FlashSale from "@/models/flashSale";
import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/cart";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession();

    // Kiểm tra đăng nhập
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    // Kiem tra san pham
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    } else if (product.quantity === 0) {
      return NextResponse.json(
        { message: "Product out of stock" },
        { status: 400 }
      );
    }
    // Lấy user từ email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Kiem tra flash sale
    const activeFlashSales = await FlashSale.find({
      isActive: true,
      startTime: { $lte: new Date() },
      endTime: { $gte: new Date() },
      products: productId,
    });

    let price = product.price;
    let isFlashSale = false;
    let flashSaleId = null;
    let maxQuantityPerUser = null;

    if (activeFlashSales.length > 0) {
      const flashSale = activeFlashSales[0];
      price = flashSale.calculateSalePrice(product.price);
      isFlashSale = true;
      flashSaleId = flashSale._id;
      maxQuantityPerUser = flashSale.maxQuantityPerUser;
    } else if (product.salePrice) {
      price = product.salePrice;
    }

    // Them san pham vao gio hang
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }
    await cart.addItem(
      product._id,
      quantity,
      price,
      product.price,
      isFlashSale,
      flashSaleId,
      maxQuantityPerUser
    );
    await cart.save();

    return NextResponse.json({
      success: true,
      cart: {
        items: cart.items,
        total: cart.calculateTotal(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
