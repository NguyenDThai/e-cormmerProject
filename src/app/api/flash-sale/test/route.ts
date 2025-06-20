import connectToDatabase from "@/lib/mongodb";
import { FlashSaleService } from "@/lib/flashSaleService";
import FlashSale from "@/models/flashSale";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Test 1: Check if flash sale service is working
    const hasActiveFlashSale = await FlashSaleService.hasActiveFlashSale();
    
    // Test 2: Get active flash sale
    const activeFlashSale = await FlashSaleService.getActiveFlashSale();
    
    // Test 3: Get flash sale stats
    const stats = await FlashSaleService.getFlashSaleStats();
    
    // Test 4: Count products with sale prices
    const productsWithSalePrice = await Product.countDocuments({
      salePrice: { $exists: true, $ne: null, $gt: 0 }
    });
    
    // Test 5: Get sample products in flash sale
    const sampleFlashSaleProducts = await Product.find({
      salePrice: { $exists: true, $ne: null, $gt: 0 }
    })
    .select('name price salePrice')
    .limit(5);

    // Test 6: Database connectivity
    const totalProducts = await Product.countDocuments();
    const totalFlashSales = await FlashSale.countDocuments();

    const testResults = {
      timestamp: new Date(),
      tests: {
        databaseConnection: {
          status: "✅ Connected",
          totalProducts,
          totalFlashSales
        },
        flashSaleService: {
          hasActiveFlashSale,
          activeFlashSaleExists: !!activeFlashSale,
          activeFlashSaleName: activeFlashSale?.name || "None",
          stats
        },
        productPricing: {
          productsWithSalePrice,
          sampleProducts: sampleFlashSaleProducts.map(p => ({
            name: p.name,
            originalPrice: p.price,
            salePrice: p.salePrice,
            discount: p.price && p.salePrice ? 
              Math.round(((p.price - p.salePrice) / p.price) * 100) : 0
          }))
        }
      },
      apiEndpoints: {
        available: [
          "GET /api/flash-sale/test - This endpoint",
          "GET /api/flash-sale/active - Get active flash sales",
          "GET /api/flash-sale/products - Get flash sale products",
          "GET /api/flash-sale - Get all flash sales (admin)",
          "POST /api/flash-sale - Create flash sale (admin)",
          "GET /api/flash-sale/[id] - Get flash sale by ID",
          "PUT /api/flash-sale/[id] - Update flash sale (admin)",
          "DELETE /api/flash-sale/[id] - Delete flash sale (admin)",
          "GET /api/flash-sale/stats - Get flash sale statistics (admin)",
          "POST /api/flash-sale/stats - Trigger maintenance (admin)"
        ]
      },
      recommendations: [] as string[]
    };

    // Add recommendations based on test results
    if (!hasActiveFlashSale) {
      testResults.recommendations.push("🚀 Create an active flash sale to test functionality");
    }
    
    if (productsWithSalePrice === 0) {
      testResults.recommendations.push("💰 No products have sale prices - flash sale may not be active");
    }
    
    if (totalProducts < 5) {
      testResults.recommendations.push("📱 Consider adding more products for better testing");
    }

    if (stats.totalFlashSales === 0) {
      testResults.recommendations.push("⚡ Run seed script: npm run seed-flash-sale");
    }

    return NextResponse.json(testResults, { status: 200 });

  } catch (error) {
    console.error("Flash sale test error:", error);
    return NextResponse.json({
      timestamp: new Date(),
      status: "❌ Error",
      error: error instanceof Error ? error.message : "Unknown error",
      tests: {
        databaseConnection: {
          status: "❌ Failed",
          error: "Could not connect to database or models"
        }
      },
      recommendations: [
        "🔧 Check database connection",
        "🗃️ Ensure models are properly imported",
        "⚡ Run seed script: npm run seed-flash-sale"
      ]
    }, { status: 500 });
  }
}
