import connectToDatabase from "@/lib/mongodb";
import { FlashSaleService } from "@/lib/flashSaleService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
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
    
    // Get flash sale statistics
    const stats = await FlashSaleService.getFlashSaleStats();
    
    // Auto cleanup expired flash sales
    const deactivatedCount = await FlashSaleService.deactivateExpiredFlashSales();
    
    // Auto activate upcoming flash sales
    const activatedCount = await FlashSaleService.activateUpcomingFlashSales();

    return NextResponse.json({
      stats,
      maintenance: {
        deactivatedExpiredSales: deactivatedCount,
        activatedUpcomingSales: activatedCount,
        lastCleanup: new Date()
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching flash sale stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch flash sale statistics" },
      { status: 500 }
    );
  }
}

// POST - Trigger manual cleanup
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

    const body = await request.json();
    const { action } = body;

    await connectToDatabase();

    const result: Record<string, unknown> = {};

    switch (action) {
      case 'cleanup_expired':
        result.deactivatedCount = await FlashSaleService.deactivateExpiredFlashSales();
        result.message = `Deactivated ${result.deactivatedCount} expired flash sales`;
        break;
        
      case 'activate_upcoming':
        result.activatedCount = await FlashSaleService.activateUpcomingFlashSales();
        result.message = `Activated ${result.activatedCount} upcoming flash sales`;
        break;
        
      case 'full_cleanup':
        result.deactivatedCount = await FlashSaleService.deactivateExpiredFlashSales();
        result.activatedCount = await FlashSaleService.activateUpcomingFlashSales();
        result.message = `Cleanup completed: ${result.deactivatedCount} deactivated, ${result.activatedCount} activated`;
        break;
        
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: cleanup_expired, activate_upcoming, or full_cleanup" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date()
    }, { status: 200 });

  } catch (error) {
    console.error("Error performing flash sale maintenance:", error);
    return NextResponse.json(
      { error: "Failed to perform maintenance action" },
      { status: 500 }
    );
  }
}
