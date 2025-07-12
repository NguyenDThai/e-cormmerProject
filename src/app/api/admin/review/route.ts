/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/review";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isApproved =
      searchParams.get("isApproved") === "true"
        ? true
        : searchParams.get("isApproved") === "false"
        ? false
        : undefined;

    const query: { isApproved?: boolean } = {};
    if (isApproved !== undefined) query.isApproved = isApproved;

    const reviews = await Review.find(query)
      .select("orderId userId productId rating comment isApproved createdAt")
      .populate("userId", "name email")
      .populate("productId", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalCount = await Review.countDocuments(query);

    return NextResponse.json({ reviews, totalCount }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching reviews:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  try {
    if (session?.user.role !== "admin") {
      NextResponse.json(
        { message: "Chức năng được triển khai cho admin" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const {
      reviewId,
      action,
    }: { reviewId: string; action: "approve" | "delete" } =
      await request.json();

    if (!reviewId || !action) {
      return NextResponse.json(
        { message: "Missing reviewId or action" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const review = await Review.findByIdAndUpdate(
        reviewId,
        { $set: { isApproved: true } },
        { new: true }
      );
      if (!review) {
        return NextResponse.json(
          { message: "Review not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Review approved", review },
        { status: 200 }
      );
    } else if (action === "delete") {
      const review = await Review.findByIdAndDelete(reviewId);
      if (!review) {
        return NextResponse.json(
          { message: "Review not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Review deleted" }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error processing review action:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
