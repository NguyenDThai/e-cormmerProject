import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import FlashSale from "@/models/flashSale";
import Product from "@/models/product";
import User from "@/models/user";

export async function POST() {
  try {
    await connectToDatabase();

    // 1. Tìm hoặc tạo admin user
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Flash Sale Admin",
        email: "admin@flashsale.com",
        role: "admin"
      });
    }

    // 2. Xóa dữ liệu cũ
    await FlashSale.deleteMany({});
    await Product.deleteMany({});

    // 3. Tạo 10 sản phẩm mẫu
    const sampleProducts = [
      {
        name: "iPhone 15 Pro Max 256GB",
        brand: "Apple",
        category: "phone",
        price: 29990000,
        quantity: 50,
        description: "Điện thoại iPhone mới nhất với chip A17 Pro, camera 48MP và màn hình Super Retina XDR",
        images: ["https://cdn.viettelstore.vn/Images/Product/ProductImage/1918148414.jpeg"]
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        brand: "Samsung",
        category: "phone", 
        price: 26990000,
        quantity: 30,
        description: "Flagship Android với S Pen, camera 200MP và AI tích hợp",
        images: ["https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573073"]
      },
      {
        name: "MacBook Air M3 13 inch",
        brand: "Apple",
        category: "laptop",
        price: 27990000,
        quantity: 25,
        description: "Laptop mỏng nhẹ với chip M3 mạnh mẽ, thời lượng pin lên đến 18 giờ",
        images: ["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mba13-midnight-select-202402"]
      },
      {
        name: "Sony WH-1000XM5 Headphones",
        brand: "Sony",
        category: "other",
        price: 8990000,
        quantity: 100,
        description: "Tai nghe chống ồn hàng đầu với chất lượng âm thanh Hi-Res",
        images: ["https://www.sony.com.vn/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330"]
      },
      {
        name: "iPad Pro 12.9 inch M2",
        brand: "Apple",
        category: "other",
        price: 25990000,
        quantity: 40,
        description: "Máy tính bảng Pro với chip M2, hỗ trợ Apple Pencil 2",
        images: ["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202210"]
      },
      {
        name: "Asus ROG Strix G15",
        brand: "Asus",
        category: "laptop",
        price: 22990000,
        quantity: 20,
        description: "Laptop gaming với RTX 4060, AMD Ryzen 7 và màn hình 165Hz",
        images: ["https://dlcdnwebimgs.asus.com/gain/E0BB0F1C-5F8E-4DFF-B8E5-3F43FA90C6E6/w717/h525"]
      },
      {
        name: "Gaming Mouse Logitech G Pro",
        brand: "Logitech",
        category: "mouse",
        price: 2990000,
        quantity: 80,
        description: "Chuột gaming chuyên nghiệp với sensor Hero 25K và thiết kế ergonomic",
        images: ["https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g-pro-wireless/g-pro-wireless-hero-desktop.png"]
      },
      {
        name: "Xiaomi 13 Ultra",
        brand: "Xiaomi",
        category: "phone",
        price: 18990000,
        quantity: 60,
        description: "Camera phone hàng đầu với ống kính Leica và zoom 120x",
        images: ["https://cdn.tgdd.vn/Products/Images/42/301608/xiaomi-13-ultra-green-1.jpg"]
      },
      {
        name: "Dell XPS 13 Plus",
        brand: "Dell",
        category: "laptop",
        price: 24990000,
        quantity: 15,
        description: "Ultrabook cao cấp với màn hình OLED 4K và thiết kế premium",
        images: ["https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/silver/notebook-xps-13-9320-nt-silver-gallery-1.psd"]
      },
      {
        name: "AirPods Pro 2nd Gen",
        brand: "Apple", 
        category: "other",
        price: 6490000,
        quantity: 120,
        description: "Tai nghe không dây với chống ồn chủ động và chip H2",
        images: ["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MQD83"]
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} products`);

    // 4. Tạo Flash Sale đang hoạt động
    const now = new Date();
    const startTime = new Date(now.getTime() - 1000 * 60 * 60); // 1 giờ trước
    const endTime = new Date(now.getTime() + 1000 * 60 * 60 * 24); // 24 giờ sau

    const flashSale = await FlashSale.create({
      name: "Flash Sale Cuối Năm 2024",
      description: "Giảm giá khủng cho tất cả sản phẩm công nghệ! Cơ hội vàng mua sắm với giá tốt nhất năm.",
      startTime,
      endTime,
      isActive: true,
      discountPercent: 35,
      products: createdProducts.map(p => p._id),
      maxQuantityPerUser: 3,
      totalSold: Math.floor(Math.random() * 50) + 10, // Random từ 10-60
      createdBy: adminUser._id
    });

    console.log(`✅ Created Flash Sale: ${flashSale.name}`);

    return NextResponse.json({
      success: true,
      message: "Đã tạo thành công 10 sản phẩm và Flash Sale!",
      data: {
        productsCount: createdProducts.length,
        flashSale: {
          id: flashSale._id,
          name: flashSale.name,
          discountPercent: flashSale.discountPercent,
          productsCount: flashSale.products.length,
          endTime: flashSale.endTime
        }
      }
    });

  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Lỗi khi tạo dữ liệu Flash Sale",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
