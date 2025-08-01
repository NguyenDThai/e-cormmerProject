/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const ram = await Product.distinct("configuration.ram");
    const storage = await Product.distinct("configuration.storage");
    const screenSize = await Product.distinct("configuration.screenSize");
    return NextResponse.json(
      {
        ram: ram.filter((v: number) => v).sort((a: number, b: number) => a - b),
        storage: storage
          .filter((v: number) => v)
          .sort((a: number, b: number) => a - b),
        screenSize: screenSize
          .filter((v: number) => v)
          .sort((a: number, b: number) => a - b),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { message: "Lỗi khi lấy tùy chọn bộ lọc" },
      { status: 500 }
    );
  }
}
