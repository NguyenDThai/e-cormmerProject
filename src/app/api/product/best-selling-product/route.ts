import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/models/order";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const sellingProduct = await Order.aggregate([
      // Lọc các đơn hàng có trạng thái SUCCESS
      { $match: { status: "SUCCESS" } },
      // Mở rộng mảng items để xử lý từng sản phẩm
      { $unwind: "$items" },
      // Nhóm theo product

      // Id và tính tổng số lượng
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      // Sắp xếp theo tổng số lượng giảm dần
      { $sort: { totalQuantity: -1 } },
      // Lấy những sản phẩm (bán chạy nhất)
      { $limit: 5 },
      // Lấy thông tin chi tiết sản phẩm từ collection products
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      // Mở rộng mảng productInfo
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      // Định dạng kết quả trả về
      {
        $project: {
          productId: "$_id",
          totalQuantity: 1,
          name: "$productInfo.name",
          brand: "$productInfo.brand",
          category: "$productInfo.category",
          price: "$productInfo.price",
          salePrice: "$productInfo.salePrice",
          images: "$productInfo.images",
          description: "$productInfo.description",
          quantity: "$productInfo.quantity",
          configuration: "$productInfo.configuration",
        },
      },
    ]);

    // Kiểm tra nếu không có sản phẩm nào
    if (!sellingProduct.length) {
      return NextResponse.json(
        { message: "No successful orders found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ sellingProduct });
  } catch (error) {
    console.error("Error fetching best selling product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
