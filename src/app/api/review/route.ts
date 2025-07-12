/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Order from "@/models/order";
import Review from "@/models/review";
import connectToDatabase from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ReviewRequest {
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();

    const { orderId, productId, rating, comment }: ReviewRequest =
      await request.json();

    if (!orderId || !productId || !rating || !comment) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Invalid rating" }, { status: 400 });
    }

    // Kiểm tra đơn hàng
    const order = await Order.findOne({
      orderId,
      userId: session.user.id,
      status: "SUCCESS",
    });
    if (!order) {
      return NextResponse.json(
        { message: "Order not found or not completed" },
        { status: 404 }
      );
    }

    // Kiểm tra sản phẩm trong đơn hàng
    const hasProduct = order.items.some(
      (item: any) => item.productId.toString() === productId
    );
    if (!hasProduct) {
      return NextResponse.json(
        { message: "Product not in order" },
        { status: 400 }
      );
    }

    // Kiểm tra xem đã đánh giá sản phẩm này chưa
    const existingReview = await Review.findOne({
      orderId,
      productId,
      userId: session.user.id,
    });
    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    const review = new Review({
      orderId,
      userId: session.user.id,
      productId,
      rating,
      comment,
      isApproved: false,
    });

    await review.save();
    return NextResponse.json(
      { message: "Review submitted, awaiting approval" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting review:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const userId = searchParams.get("userId");
    const session = await getServerSession(authOptions);

    if (productId) {
      // Lấy đánh giá công khai theo productId
      const reviews = await Review.find({ productId, isApproved: true })
        .select("rating comment createdAt")
        .populate("userId", "name email")
        .lean();
      return NextResponse.json({ reviews }, { status: 200 });
    } else if (userId && session?.user?.id === userId) {
      // Lấy đánh giá của người dùng hiện tại
      const reviews = await Review.find({ userId })
        .select("orderId productId rating comment isApproved createdAt")
        .populate("productId", "name")
        .lean();
      return NextResponse.json({ reviews }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Missing productId or userId, or unauthorized" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching reviews:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
