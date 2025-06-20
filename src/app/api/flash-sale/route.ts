import connectToDatabase from "@/lib/mongodb";
import FlashSale from "@/models/flashSale";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Lấy tất cả flash sales
export async function GET() {
  try {
    await connectToDatabase();
    
    const flashSales = await FlashSale.find({})
      .populate({
        path: 'products',
        select: 'name brand category images price salePrice quantity'
      })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      flashSales,
      total: flashSales.length
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching flash sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch flash sales" },
      { status: 500 }
    );
  }
}

// POST - Tạo flash sale mới
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const body = await request.json();
    const {
      name,
      description,
      startTime,
      endTime,
      discountPercent,
      products,
      maxQuantityPerUser
    } = body;

    // Validation
    if (!name || !startTime || !endTime || !discountPercent || !products || products.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start >= end) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }

    if (end <= now) {
      return NextResponse.json(
        { error: "End time must be in the future" },
        { status: 400 }
      );
    }

    // Validate discount percent
    if (discountPercent < 0 || discountPercent > 100) {
      return NextResponse.json(
        { error: "Discount percent must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Validate products exist
    const existingProducts = await Product.find({
      _id: { $in: products }
    });

    if (existingProducts.length !== products.length) {
      return NextResponse.json(
        { error: "Some products do not exist" },
        { status: 400 }
      );
    }

    // Create flash sale
    const flashSale = new FlashSale({
      name,
      description,
      startTime: start,
      endTime: end,
      discountPercent,
      products,
      maxQuantityPerUser: maxQuantityPerUser || 5,
      createdBy: session.user.id,
      isActive: true
    });

    await flashSale.save();

    // Update products with sale prices
    await Promise.all(
      existingProducts.map(async (product) => {
        const salePrice = Math.round(product.price * (1 - discountPercent / 100));
        await Product.findByIdAndUpdate(product._id, {
          salePrice: salePrice
        });
      })
    );

    // Populate the created flash sale
    const populatedFlashSale = await FlashSale.findById(flashSale._id)
      .populate('products', 'name brand category images price salePrice quantity')
      .populate('createdBy', 'name email');

    return NextResponse.json({
      message: "Flash sale created successfully",
      flashSale: populatedFlashSale
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating flash sale:", error);
    return NextResponse.json(
      { error: "Failed to create flash sale" },
      { status: 500 }
    );
  }
}
