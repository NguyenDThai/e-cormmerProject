import connectToDatabase from "@/lib/mongodb";
import FlashSale from "@/models/flashSale";
import Product from "@/models/product";

export interface FlashSaleStats {
  totalFlashSales: number;
  activeFlashSales: number;
  upcomingFlashSales: number;
  expiredFlashSales: number;
  totalProductsInSale: number;
  totalRevenue: number;
}

export class FlashSaleService {
  static async hasActiveFlashSale(): Promise<boolean> {
    await connectToDatabase();
    const now = new Date();

    const activeCount = await FlashSale.countDocuments({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    });

    return activeCount > 0;
  }

  static async getActiveFlashSale() {
    await connectToDatabase();
    const now = new Date();

    return await FlashSale.findOne({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
      .populate(
        "products",
        "name brand category images price salePrice quantity"
      )
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
  }

  static async deactivateExpiredFlashSales(): Promise<number> {
    await connectToDatabase();
    const now = new Date();

    const expiredFlashSales = await FlashSale.find({
      isActive: true,
      endTime: { $lt: now },
    });

    if (expiredFlashSales.length === 0) {
      return 0;
    }

    await FlashSale.updateMany(
      {
        isActive: true,
        endTime: { $lt: now },
      },
      {
        isActive: false,
      }
    );

    for (const sale of expiredFlashSales) {
      await Product.updateMany(
        { _id: { $in: sale.products } },
        { $unset: { salePrice: 1 } }
      );
    }

    console.log(`Deactivated ${expiredFlashSales.length} expired flash sales`);
    return expiredFlashSales.length;
  }

  static async activateUpcomingFlashSales(): Promise<number> {
    await connectToDatabase();
    const now = new Date();

    const upcomingFlashSales = await FlashSale.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gt: now },
    }).populate("products");

    if (upcomingFlashSales.length === 0) {
      return 0;
    }

    for (const sale of upcomingFlashSales) {
      await Promise.all(
        sale.products.map(async (product) => {
          if (!product || typeof product !== "object" || !("price" in product)) return;
          const price = typeof product.price === "number" ? product.price : 0;
          const salePrice = sale.calculateSalePrice(price);
          await Product.findByIdAndUpdate(product._id, {
            salePrice: salePrice,
          });
        })
      );
    }

    console.log(`Activated ${upcomingFlashSales.length} upcoming flash sales`);
    return upcomingFlashSales.length;
  }

  static async getFlashSaleStats(): Promise<FlashSaleStats> {
    await connectToDatabase();
    const now = new Date();

    const [
      totalFlashSales,
      activeFlashSales,
      upcomingFlashSales,
      expiredFlashSales,
    ] = await Promise.all([
      FlashSale.countDocuments({}),
      FlashSale.countDocuments({
        isActive: true,
        startTime: { $lte: now },
        endTime: { $gte: now },
      }),
      FlashSale.countDocuments({
        isActive: true,
        startTime: { $gt: now },
      }),
      FlashSale.countDocuments({
        endTime: { $lt: now },
      }),
    ]);

    const activeFlashSalesData = await FlashSale.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    });

    const totalProductsInSale = activeFlashSalesData.reduce((total, sale) => {
      return total + sale.products.length;
    }, 0);

    const totalRevenue = activeFlashSalesData.reduce((total, sale) => {
      return total + sale.totalSold * 1000;
    }, 0);

    return {
      totalFlashSales,
      activeFlashSales,
      upcomingFlashSales,
      expiredFlashSales,
      totalProductsInSale,
      totalRevenue,
    };
  }

  static async validateFlashSaleConflicts(
    startTime: Date,
    endTime: Date,
    products: string[],
    excludeId?: string
  ): Promise<boolean> {
    await connectToDatabase();

    const query: Record<string, unknown> = {
      isActive: true,
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gte: startTime },
        },
        {
          startTime: { $lte: endTime },
          endTime: { $gte: endTime },
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime },
        },
      ],
      products: { $in: products },
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const conflictingFlashSales = await FlashSale.countDocuments(query);
    return conflictingFlashSales === 0;
  }

  static async bulkUpdateSalePrices(flashSaleId: string): Promise<void> {
    await connectToDatabase();

    const flashSale = await FlashSale.findById(flashSaleId).populate(
      "products"
    );
    if (!flashSale) {
      throw new Error("Flash sale not found");
    }

    await Promise.all(
      flashSale.products.map(async (product) => {
        if (!product || typeof product !== "object" || !("price" in product)) return;
        const price = typeof product.price === "number" ? product.price : 0;
        const salePrice = flashSale.calculateSalePrice(price);
        await Product.findByIdAndUpdate(product._id, {
          salePrice: salePrice,
        });
      })
    );
  }

  static async removeSalePrices(productIds: string[]): Promise<void> {
    await connectToDatabase();

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $unset: { salePrice: 1 } }
    );
  }
}
