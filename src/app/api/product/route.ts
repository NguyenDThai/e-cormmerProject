import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const product = await Product.find();
    if (!product) {
      return NextResponse.json(
        { message: "Cannot find product to Databese" },
        { status: 500 }
      );
    }
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
