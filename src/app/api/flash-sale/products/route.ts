import connectToDatabase from "@/lib/mongodb";
import FlashSale from "@/models/flashSale";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    
    const now = new Date();
    
    // Tìm flash sale đang active
    const activeFlashSale = await FlashSale.findOne({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).sort({ createdAt: -1 });

    if (!activeFlashSale) {
      return NextResponse.json({
        message: "No active flash sale",
        products: [],
        flashSale: null,
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      }, { status: 200 });
    }

    // Build query cho products
    const productQuery: Record<string, unknown> = {
      _id: { $in: activeFlashSale.products }
    };

    // Filter theo category nếu có
    if (category && category !== "all") {
      productQuery.category = category;
    }

    // Count total products
    const totalProducts = await Product.countDocuments(productQuery);
    const totalPages = Math.ceil(totalProducts / limit);
    const skip = (page - 1) * limit;

    // Get products với pagination
    const products = await Product.find(productQuery)
      .select('name brand category images price salePrice quantity description createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Tính sale price cho từng product dựa trên flash sale discount
    const productsWithFlashSale = products.map(product => {
      let finalSalePrice = product.salePrice;
      
      // Nếu chưa có salePrice hoặc cần recalculate
      if (!finalSalePrice || finalSalePrice === 0) {
        finalSalePrice = activeFlashSale.calculateSalePrice(product.price);
      }

      return {
        ...product,
        salePrice: finalSalePrice,
        originalPrice: product.price,
        discountPercent: activeFlashSale.discountPercent,
        discountAmount: product.price - finalSalePrice,
        flashSaleId: activeFlashSale._id,
        flashSaleName: activeFlashSale.name,
        maxQuantityPerUser: activeFlashSale.maxQuantityPerUser
      };
    });

    return NextResponse.json({
      message: "Flash sale products found",
      products: productsWithFlashSale,
      flashSale: {
        _id: activeFlashSale._id,
        name: activeFlashSale.name,
        description: activeFlashSale.description,
        startTime: activeFlashSale.startTime,
        endTime: activeFlashSale.endTime,
        discountPercent: activeFlashSale.discountPercent,
        maxQuantityPerUser: activeFlashSale.maxQuantityPerUser,
        totalSold: activeFlashSale.totalSold
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      currentTime: now
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching flash sale products:", error);
    return NextResponse.json(
      { error: "Failed to fetch flash sale products" },
      { status: 500 }
    );
  }
}
