/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Lấy tham số phân trang (nếu có)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Aggregation để nhóm sản phẩm yêu thích
    const favorites = await User.aggregate([
      // Lọc người dùng có favorite không rỗng
      { $match: { favorite: { $ne: [] } } },
      // Mở rộng mảng favorite
      { $unwind: "$favorite" },
      // Populate thông tin sản phẩm
      {
        $lookup: {
          from: "products", // Tên collection của Product
          localField: "favorite",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      // Nhóm theo sản phẩm
      {
        $group: {
          _id: "$product._id",
          productName: { $first: "$product.name" },
          productDescription: { $first: "$product.description" },
          productPrice: { $first: "$product.price" },
          productSalePrice: { $first: "$product.salePrice" },
          favoriteCount: { $sum: 1 },
          userEmails: { $push: "$email" },
        },
      },
      // Định dạng đầu ra
      {
        $project: {
          productId: "$_id",
          productName: 1,
          productDescription: 1,
          productPrice: 1,
          productSalePrice: 1,
          favoriteCount: 1,
          userEmails: 1,
          _id: 0,
        },
      },
      // Phân trang
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    // Đếm tổng số sản phẩm yêu thích (cho phân trang)
    const totalCount =
      (
        await User.aggregate([
          { $match: { favorite: { $ne: [] } } },
          { $unwind: "$favorite" },
          { $group: { _id: "$favorite" } },
          { $count: "total" },
        ])
      )[0]?.total || 0;

    return NextResponse.json({ favorites, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
