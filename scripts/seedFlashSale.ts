/**
 * Script để tạo test data cho Flash Sale
 * Chạy bằng cách: npm run seed-flash-sale
 */

import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb";
import FlashSale from "../src/models/flashSale";
import Product from "../src/models/product";
import User from "../src/models/user";

async function seedFlashSaleData() {
  try {
    await connectToDatabase();
    console.log("🔗 Connected to database");

    // 1. Tìm admin user
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      // Tạo admin user nếu chưa có
      adminUser = await User.create({
        name: "Flash Sale Admin",
        email: "admin@flashsale.com",
        role: "admin"
      });
      console.log("👤 Created admin user");
    }

    // 2. Tạo sample products nếu chưa có đủ
    const existingProductCount = await Product.countDocuments();
    if (existingProductCount < 10) {
      const sampleProducts = [
        {
          name: "iPhone 15 Pro Max",
          brand: "Apple",
          category: "phone",
          price: 29990000,
          quantity: 50,
          description: "Latest iPhone with advanced features",
          images: ["https://example.com/iphone15.jpg"]
        },
        {
          name: "Samsung Galaxy S24 Ultra",
          brand: "Samsung", 
          category: "phone",
          price: 26990000,
          quantity: 30,
          description: "Premium Android flagship",
          images: ["https://example.com/galaxy-s24.jpg"]
        },
        {
          name: "MacBook Pro M3",
          brand: "Apple",
          category: "laptop", 
          price: 52990000,
          quantity: 20,
          description: "Professional laptop with M3 chip",
          images: ["https://example.com/macbook-m3.jpg"]
        },
        {
          name: "Dell XPS 13",
          brand: "Dell",
          category: "laptop",
          price: 32990000, 
          quantity: 25,
          description: "Ultrabook for professionals",
          images: ["https://example.com/dell-xps13.jpg"]
        },
        {
          name: "Sony A7R V",
          brand: "Sony",
          category: "camera",
          price: 89990000,
          quantity: 10,
          description: "Professional mirrorless camera",
          images: ["https://example.com/sony-a7rv.jpg"]
        },
        {
          name: "Canon EOS R5",
          brand: "Canon", 
          category: "camera",
          price: 79990000,
          quantity: 15,
          description: "High-resolution mirrorless camera",
          images: ["https://example.com/canon-r5.jpg"]
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log("📱 Created sample products");
    }

    // 3. Lấy products để sử dụng cho flash sales
    const allProducts = await Product.find({}).limit(10);
    const productIds = allProducts.map((p: any) => p._id);

    // 4. Xóa flash sales cũ (nếu có)
    await FlashSale.deleteMany({});
    console.log("🗑️ Cleaned up old flash sales");

    // 5. Tạo Flash Sale scenarios

    // Scenario 1: Flash Sale đang active (started 1 hour ago, ends in 47 hours)
    const now = new Date();
    const activeFlashSale = new FlashSale({
      name: "Flash Sale Cuối Tuần",
      description: "Giảm giá sốc các sản phẩm công nghệ hot nhất!",
      startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      endTime: new Date(now.getTime() + 47 * 60 * 60 * 1000), // 47 hours from now  
      discountPercent: 25,
      products: productIds.slice(0, 4), // First 4 products
      maxQuantityPerUser: 3,
      isActive: true,
      createdBy: adminUser._id,
      totalSold: 15
    });

    await activeFlashSale.save();
    console.log("✅ Created active flash sale");

    // Scenario 2: Flash Sale sắp bắt đầu (starts in 2 hours)
    const upcomingFlashSale = new FlashSale({
      name: "Flash Sale Thứ 7",
      description: "Sale đặc biệt cho ngày cuối tuần!",
      startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(now.getTime() + 26 * 60 * 60 * 1000), // 26 hours from now
      discountPercent: 30,
      products: productIds.slice(2, 6), // Products 2-5
      maxQuantityPerUser: 2,
      isActive: true,
      createdBy: adminUser._id,
      totalSold: 0
    });

    await upcomingFlashSale.save();
    console.log("⏰ Created upcoming flash sale");

    // Scenario 3: Flash Sale đã hết hạn
    const expiredFlashSale = new FlashSale({
      name: "Flash Sale Tuần Trước", 
      description: "Flash sale đã kết thúc",
      startTime: new Date(now.getTime() - 72 * 60 * 60 * 1000), // 72 hours ago
      endTime: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
      discountPercent: 20,
      products: productIds.slice(4, 8), // Products 4-7
      maxQuantityPerUser: 5,
      isActive: false,
      createdBy: adminUser._id,
      totalSold: 45
    });

    await expiredFlashSale.save();
    console.log("⏹️ Created expired flash sale");

    // 6. Update sale prices cho active flash sale
    const activeProducts = await Product.find({
      _id: { $in: activeFlashSale.products }
    });

    await Promise.all(
      activeProducts.map(async (product: any) => {
        const salePrice = activeFlashSale.calculateSalePrice(product.price);
        await Product.findByIdAndUpdate(product._id, {
          salePrice: salePrice
        });
      })
    );

    console.log("💰 Updated sale prices for active flash sale products");

    // 7. Display summary
    console.log("\n🎉 Flash Sale Data Seeded Successfully!");
    console.log("=".repeat(50));
    console.log(`📊 Summary:`);
    console.log(`- Products created: ${allProducts.length}`);
    console.log(`- Active Flash Sale: "${activeFlashSale.name}" (${activeFlashSale.discountPercent}% off)`);
    console.log(`- Upcoming Flash Sale: "${upcomingFlashSale.name}" (${upcomingFlashSale.discountPercent}% off)`);
    console.log(`- Expired Flash Sale: "${expiredFlashSale.name}" (${expiredFlashSale.discountPercent}% off)`);
    console.log(`\n🌐 Test URLs:`);
    console.log(`- Active Flash Sale: GET /api/flash-sale/active`);
    console.log(`- Flash Sale Products: GET /api/flash-sale/products`);
    console.log(`- All Flash Sales: GET /api/flash-sale`);
    console.log(`- Flash Sale Stats: GET /api/flash-sale/stats`);

  } catch (error) {
    console.error("❌ Error seeding flash sale data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Chạy script trực tiếp
seedFlashSaleData();

export default seedFlashSaleData;
