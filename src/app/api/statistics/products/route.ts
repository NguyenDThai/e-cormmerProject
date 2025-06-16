/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    // Đếm tổng số sản phẩm
    const totalProducts = await Product.countDocuments();

    // Thống kê số lượng sản phẩm theo danh mục
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category", // Nhóm theo trường category
          count: { $sum: 1 }, // Đếm số lượng sản phẩm trong mỗi danh mục
        },
      },
      {
        $project: {
          _id: 0, // Loại bỏ trường _id
          name: "$_id", // Đổi tên _id thành name
          count: 1, // Giữ trường count
        },
      },
      {
        $sort: { name: 1 }, // Sắp xếp theo tên danh mục
      },
    ]);

    return NextResponse.json(
      {
        totalProducts,
        categories,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching product stats:", error);
    return NextResponse.json(
      { error: "Không thể lấy thống kê sản phẩm" },
      { status: 500 }
    );
  }
}
