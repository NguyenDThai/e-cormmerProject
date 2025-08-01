/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "Infinity");
    const ram =
      searchParams
        .get("ram")
        ?.split(",")
        .map(Number)
        .filter((v) => !isNaN(v)) || [];
    const storage =
      searchParams
        .get("storage")
        ?.split(",")
        .map(Number)
        .filter((v) => !isNaN(v)) || [];
    const screenSize =
      searchParams
        .get("screenSize")
        ?.split(",")
        .map(Number)
        .filter((v) => !isNaN(v)) || [];

    const query: any = {};
    if (category) query.category = category;

    // Chỉ thêm query.price nếu có ít nhất một điều kiện giá hợp lệ
    const priceQuery: any = {};
    if (!isNaN(minPrice) && minPrice > 0) priceQuery.$gte = minPrice;
    if (!isNaN(maxPrice) && maxPrice !== Infinity) priceQuery.$lte = maxPrice;
    if (Object.keys(priceQuery).length > 0) query.price = priceQuery;

    if (ram.length > 0) query["configuration.ram"] = { $in: ram };
    if (storage.length > 0) query["configuration.storage"] = { $in: storage };
    if (screenSize.length > 0)
      query["configuration.screenSize"] = { $in: screenSize };

    const products = await Product.find(query);
    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm phù hợp" },
        { status: 404 }
      );
    }
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching filtered products:", error);
    return NextResponse.json(
      { message: "Lỗi khi lấy sản phẩm từ cơ sở dữ liệu" },
      { status: 500 }
    );
  }
}
