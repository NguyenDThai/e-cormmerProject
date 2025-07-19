import { NextResponse } from "next/server";
import OpenAI from "openai";
import connectToDatabase from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import User, { IUser } from "@/models/user";
import { authOptions } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Danh sach cac chu de duoc ho tro
const ALLOWED_TOPICS = [
  "sản phẩm",
  "đơn hàng",
  "thanh toán",
  "thông tin tài khoản",
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
    lowerMessage.includes("bạn biết gì về tôi") ||
    lowerMessage.includes("thông tin của tôi") ||
    lowerMessage.includes("tôi là ai") ||
    lowerMessage.includes("thông tin cá nhân") ||
    lowerMessage.includes("tài khoản của tôi") ||
    lowerMessage.includes("hồ sơ của tôi")
  );
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Kiểm tra tin nhắn cuối cùng có liên quan đến chủ đề được phép hay không
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !isRelatedToAllowedTopics(lastMessage.content)) {
      return NextResponse.json(
        {
          reply:
            "Xin lỗi, tôi chỉ có thể trả lời các câu hỏi liên quan đến sản phẩm, đơn hàng, thông tin cá nhân, hoặc hỗ trợ khách hàng. Vui lòng đặt câu hỏi phù hợp.",
        },
        { status: 200 }
      );
    }

    await connectToDatabase();
    let userInfo = "";
    let isAboutMe = false;

    if (session?.user?.email) {
      // Truy vấn thông tin người dùng từ MongoDB, chỉ lấy các trường cần thiết
      const user: IUser | null = await User.findOne({
        email: session.user.email,
      })
        .select("name email phone address")
        .lean();

      if (user) {
        // Kiểm tra nếu là câu hỏi "Bạn biết gì về tôi?"
        isAboutMe = isAboutMeQuestion(lastMessage.content);
        if (isAboutMe) {
          userInfo = `
            Thông tin của bạn:
            Tên: ${user.name},
            Email: ${user.email},
            Số điện thoại: ${user.phone || "Chưa cập nhật"},
            Địa chỉ: ${user.address || "Chưa cập nhật"}
          `;

          return NextResponse.json({ reply: userInfo.trim() }, { status: 200 });
        }
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
