import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Neu co search params ? thi lay theo loai con khong co thi render all tat ca san pham
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    await connectToDatabase();
    const query = category ? { category } : {};
    const product = await Product.find(query);
    if (!product) {
      return NextResponse.json(
        { message: "Cannot find product to Database" },
        { status: 500 }
      );
    }
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
