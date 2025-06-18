/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({ favorite: { $ne: [] } })
      .populate({
        path: "favorite",
        select: "name description price salePrice",
      })
      .select("email favorite") // Chỉ lấy email và favorite
      .lean();

    // Tạo danh sách sản phẩm yêu thích với thông tin người dùng
    const favorites = users
      .flatMap((user) =>
        user.favorite
          ?.filter((product: any) => product && product._id && product.name) // Lọc sản phẩm hợp lệ
          ?.map((product: any) => ({
            productId: product._id.toString(),
            productName: product.name,
            productDescription: product.description,
            productPrice: product.price,
            productSalePrice: product.salePrice,
            userEmail: user.email,
          }))
      )
      .filter((item) => item); // Loại bỏ undefined/null

    return NextResponse.json({ favorites }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
