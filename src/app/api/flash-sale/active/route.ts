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
        // Ensure products are populated before processing
        if (sale.products.length > 0 && typeof sale.products[0] === 'string') {
          await sale.populate({
            path: 'products',
            select: 'name brand category images price salePrice quantity description'
          });
        } else if (sale.products.length > 0 && sale.products[0].constructor.name === 'ObjectId') {
            await sale.populate({
                path: 'products',
                select: 'name brand category images price salePrice quantity description'
            });
        }

        const saleObj = sale.toObject();
        const updatedProducts = saleObj.products.map((product: any) => {
          if (!product || typeof product !== "object" || !product.price) return product;

          const calculatedSalePrice = Math.round(product.price * (1 - saleObj.discountPercent / 100));

          return {
            ...product,
            salePrice: product.salePrice || calculatedSalePrice,
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
