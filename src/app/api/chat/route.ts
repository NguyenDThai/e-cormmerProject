/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";
import connectToDatabase from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import User, { IUser } from "@/models/user";
import { authOptions } from "@/lib/auth";
import Product from "@/models/product";
import Order from "@/models/order";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Danh sach cac chu de duoc ho tro
const ALLOWED_TOPICS = [
  "sản phẩm",
  "xin chào",
  "đơn hàng",
  "thanh toán",
  "thông tin tài khoản",
  "tôi là ai",
  "bạn biết gì về tôi",
  "giá",
];

// Hàm kiểm tra xem tin nhắn có liên quan đến chủ đề được phép hay không
const isRelatedToAllowedTopics = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return ALLOWED_TOPICS.some((topic) => lowerMessage.includes(topic));
};

// Hàm kiểm tra câu hỏi "Bạn biết gì về tôi?"
const isAboutMeQuestion = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.match(
      /\b(bạn biết gì về tôi|thông tin của tôi|tôi là ai|thông tin cá nhân|tài khoản của tôi|hồ sơ của tôi)\b/
    ) !== null && !lowerMessage.includes("hỗ trợ gì về")
  );
};

// Ham kiem tra cau hoi san pham
const isProductListQuestion = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();

  return (
    lowerMessage.match(
      /\b(liệt kê sản phẩm|danh sách sản phẩm|sản phẩm có sẵn|các sản phẩm|sản phẩm)\b/
    ) !== null && !isAboutMeQuestion(message)
  );
};

// Ham kiem tra cau hoi don hang
const isOrderListQuestion = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.match(
      /\b(liệt kê đơn hàng|danh sách đơn hàng|đơn hàng của tôi|các đơn hàng|đơn hàng đã hoàn tất|đơn hàng thành công)\b/
    ) !== null && !isAboutMeQuestion(message)
  );
};

// Ham hoi ve gia san pham
const isProductPriceQuestion = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.match(
      /\b(giá của|giá sản phẩm|hỏi giá|bao nhiêu|tôi muốn biết giá)\b/
    ) !== null &&
    !isAboutMeQuestion(message) &&
    !isProductListQuestion(message) &&
    !isOrderListQuestion(message)
  );
};

// Ham lay danh sach san pham tu csdl
const fetchProduct = async (): Promise<string> => {
  try {
    await connectToDatabase();
    const products = await Product.find()
      .select("name price salePrice")
      .lean()
      .limit(10);

    if (!products || products.length === 0) {
      return "Hiện tại không có sản phẩm nào.";
    }

    const productList = products
      .map(
        (product) =>
          `- Tên: ${
            product.name
          }, Giá: ${product.price.toLocaleString()}đ, Giảm giá: ${
            product.salePrice ? product.salePrice.toLocaleString() + "đ" : ""
          }`
      )
      .join("\n");

    return `Danh sách sản phẩm :\n${productList}`;
  } catch (error) {
    console.error("Error fetching products:", error);
    return "Đã xảy ra lỗi khi lấy danh sách sản phẩm. Vui lòng thử lại sau.";
  }
};

// Hàm lấy giá sản phẩm từ MongoDB
const fetchProductPrice = async (productName: string): Promise<string> => {
  try {
    await connectToDatabase();
    console.log("Searching for product with name:", productName);
    const products = await Product.find({
      name: { $regex: productName, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
    })
      .select("name price salePrice")
      .lean()
      .limit(1);

    console.log("Fetched products:", JSON.stringify(products, null, 2));
    if (!products || products.length === 0) {
      return `Không tìm thấy sản phẩm "${productName}". Vui lòng kiểm tra lại tên sản phẩm.`;
    }

    const product = products[0];
    const priceInfo = `Giá của ${
      product.name
    }: ${product.price.toLocaleString()}đ${
      product.salePrice
        ? `, Giảm giá: ${product.salePrice.toLocaleString()}đ`
        : ""
    }`;
    return priceInfo;
  } catch (error) {
    console.error("Error fetching product price:", error);
    return "Đã xảy ra lỗi khi lấy giá sản phẩm. Vui lòng thử lại sau.";
  }
};

// Hàm lấy danh sách đơn hàng từ MongoDB
const fetchOrders = async (
  userEmail: string,
  status?: string
): Promise<string> => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: userEmail }).select("_id").lean();
    if (!user) {
      return "Không tìm thấy thông tin người dùng.";
    }

    const query: any = { userId: user._id };
    if (status) query.status = status;
    const orders = await Order.find(query)
      .populate("items.productId")
      .select("orderId amount status paymentMethod createdAt items")
      .lean()
      .limit(10)
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return `Bạn hiện không có đơn hàng${
        status ? ` ${status.toLowerCase()}` : ""
      } nào.`;
    }

    const orderList = orders
      .map(
        (order) =>
          `- Mã đơn hàng: ${
            order.orderId
          }, Tổng tiền: ${order.amount.toLocaleString()}đ, Trạng thái: ${
            order.status
          }, Phương thức: ${order.paymentMethod}, Ngày đặt: ${new Date(
            order.createdAt
          ).toLocaleDateString("vi-VN")}\n  Sản phẩm: ${order.items
            .map((item: any) => item.name)
            .join(", ")}`
      )
      .join("\n");

    return `Danh sách đơn hàng${
      status ? ` ${status.toLowerCase()}` : ""
    } của bạn:\n${orderList}`;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return "Đã xảy ra lỗi khi lấy danh sách đơn hàng. Vui lòng thử lại sau.";
  }
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Lấy tin nhắn cuối cùng từ người dùng (role: "user")
    const userMessages = messages.filter((msg: any) => msg.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1];

    // Kiểm tra tin nhắn cuối cùng có liên quan đến chủ đề được phép hay không
    if (
      !lastUserMessage ||
      !lastUserMessage.content ||
      lastUserMessage.content.trim() === ""
    ) {
      return NextResponse.json(
        {
          reply:
            "Vui lòng nhập câu hỏi cụ thể về sản phẩm, đơn hàng, thông tin cá nhân, hoặc hỗ trợ khách hàng.",
        },
        { status: 200 }
      );
    }

    // Kiểm tra tin nhắn có liên quan đến chủ đề được phép hay không
    if (!isRelatedToAllowedTopics(lastUserMessage.content)) {
      return NextResponse.json(
        {
          reply:
            "Xin lỗi, tôi chỉ có thể trả lời các câu hỏi liên quan đến sản phẩm, đơn hàng, thông tin cá nhân, hoặc hỗ trợ khách hàng. Vui lòng đặt câu hỏi phù hợp.",
        },
        { status: 200 }
      );
    }

    await connectToDatabase();

    // Xử lý câu hỏi về thông tin cá nhân
    if (isAboutMeQuestion(lastUserMessage.content)) {
      if (!session?.user?.email) {
        return NextResponse.json(
          {
            reply:
              "Bạn cần đăng nhập để xem thông tin cá nhân. Vui lòng đăng nhập và thử lại.",
          },
          { status: 200 }
        );
      }

      const user: IUser | null = await User.findOne({
        email: session.user.email,
      })
        .select("name email phone address")
        .lean();

      if (user) {
        const userInfo = `
          Thông tin của bạn:
          Tên: ${user.name},
          Email: ${user.email},
          Số điện thoại: ${user.phone || "Chưa cập nhật"},
          Địa chỉ: ${user.address || "Chưa cập nhật"}
        `;
        return NextResponse.json({ reply: userInfo.trim() }, { status: 200 });
      } else {
        return NextResponse.json(
          { reply: "Không tìm thấy thông tin người dùng." },
          { status: 200 }
        );
      }
    }

    // Xu ly san pham
    if (isProductListQuestion(lastUserMessage.content)) {
      const productList = await fetchProduct();
      return NextResponse.json({ reply: productList }, { status: 200 });
    }

    // Xu ly don hang
    if (isOrderListQuestion(lastUserMessage.content)) {
      if (!session?.user?.email) {
        console.log("Session validation failed: user not logged in");
        return NextResponse.json(
          {
            reply:
              "Bạn cần đăng nhập để xem danh sách đơn hàng. Vui lòng đăng nhập và thử lại.",
          },
          { status: 200 }
        );
      }

      const statusMatch = lastUserMessage.content
        .toLowerCase()
        .match(/đã hoàn tất|thành công/i);
      const status = statusMatch ? "SUCCESS" : undefined;
      const orderList = await fetchOrders(session.user.email, status);
      return NextResponse.json({ reply: orderList }, { status: 200 });
    }

    // Xử lý câu hỏi về giá sản phẩm
    if (isProductPriceQuestion(lastUserMessage.content)) {
      const productNameMatch = lastUserMessage.content
        .toLowerCase()
        .match(
          /\b(giá của|giá sản phẩm|hỏi giá|bao nhiêu|tôi muốn biết giá)\s+(.+?)(?=\s*(giá|$))/
        );
      const productName = productNameMatch ? productNameMatch[2].trim() : "";
      console.log("Extracted product name:", productName);
      if (!productName) {
        return NextResponse.json(
          {
            reply: "Vui lòng cung cấp tên sản phẩm cụ thể để tôi kiểm tra giá.",
          },
          { status: 200 }
        );
      }

      const priceInfo = await fetchProductPrice(productName);
      return NextResponse.json({ reply: priceInfo }, { status: 200 });
    }

    let userInfo = "";
    // Lấy thông tin người dùng để cung cấp ngữ cảnh cho OpenAI (nếu cần)
    if (session?.user?.email) {
      const user: IUser | null = await User.findOne({
        email: session.user.email,
      })
        .select("name email phone address")
        .lean();

      if (user) {
        userInfo = `
          Thông tin người dùng:
          - Tên: ${user.name}
          - Email: ${user.email}
          - Số điện thoại: ${user.phone || "Chưa cập nhật"}
          - Địa chỉ: ${user.address || "Chưa cập nhật"}
        `;
      }
    } else {
      userInfo =
        "Người dùng chưa đăng nhập. Chỉ có thể trả lời các câu hỏi chung về sản phẩm hoặc chính sách.";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            Bạn là một trợ lý AI hỗ trợ khách hàng cho một nền tảng thương mại điện tử. Chỉ trả lời các câu hỏi liên quan đến sản phẩm, đơn hàng, thông tin cá nhân (như tên, email, số điện thoại, địa chỉ), giao hàng, thanh toán, hoặc chính sách hỗ trợ khách hàng. Từ chối trả lời các câu hỏi không liên quan và lịch sự giải thích rằng bạn chỉ hỗ trợ các chủ đề liên quan đến hệ thống. Sử dụng thông tin người dùng sau (nếu có) để trả lời chính xác:
            ${userInfo}
            Luôn trả lời bằng tiếng Việt, ngắn gọn, chính xác và thân thiện.
          `,
        },
        ...messages,
      ],
      stream: false,
    });

    return NextResponse.json(
      { reply: response.choices[0].message.content },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { error: "Failed to fetch response from OpenAI" },
      { status: 500 }
    );
  }
}
