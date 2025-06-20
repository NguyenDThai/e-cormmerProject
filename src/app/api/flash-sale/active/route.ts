import connectToDatabase from "@/lib/mongodb";
import FlashSaleModel from "@/models/flashSale";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();

    const activeFlashSales = await FlashSaleModel.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
      .populate({
        path: "products",
        select:
          "name brand category images price salePrice quantity description",
      })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!activeFlashSales || activeFlashSales.length === 0) {
      return NextResponse.json(
        {
          message: "No active flash sales found",
          hasActiveFlashSale: false,
          flashSales: [],
        },
        { status: 200 }
      );
    }

    const flashSalesWithUpdatedProducts = await Promise.all(
      activeFlashSales.map(async (sale) => {
        const saleObj = sale.toObject ? sale.toObject() : sale;
        const updatedProducts = (saleObj.products as unknown[]).map((product) => {
          // Nếu product là ObjectId, bỏ qua
          if (!product || typeof product !== "object" || !("price" in product)) return product;
          if (!("salePrice" in product) || product.salePrice === 0) {
            const price = (product as { price: number }).price;
            const calculatedSalePrice = (saleObj as { calculateSalePrice?: (price: number) => number }).calculateSalePrice ? (saleObj as { calculateSalePrice: (price: number) => number }).calculateSalePrice(price) : 0;
            return {
              ...product,
              salePrice: calculatedSalePrice,
              originalPrice: price,
              discountPercent: saleObj.discountPercent,
            };
          }
          return {
            ...product,
            salePrice: product.salePrice,
            originalPrice: product.price,
            discountPercent: saleObj.discountPercent,
          };
        });

        return {
          ...saleObj,
          products: updatedProducts,
        };
      })
    );

    return NextResponse.json(
      {
        message: "Active flash sales found",
        hasActiveFlashSale: true,
        flashSales: flashSalesWithUpdatedProducts,
        currentTime: now,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching active flash sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch active flash sales" },
      { status: 500 }
    );
  }
}
