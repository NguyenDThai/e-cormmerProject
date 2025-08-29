import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import PasswordResetToken from "@/models/passwordResetToken";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { token, password, confirmPassword } = await request.json();

    // Validate input
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin." },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Mật khẩu không khớp." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự." },
        { status: 400 }
      );
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET!) as {
      userId: string;
    };
    const resetToken = await PasswordResetToken.findOne({
      token,
      expires: { $gt: new Date() },
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: "Token không hợp lệ hoặc hết hạn." },
        { status: 400 }
      );
    }

    // Hash password mới
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    await User.updateOne(
      { _id: decoded.userId },
      { $set: { password: hashedPassword } }
    );

    // Xóa token
    await PasswordResetToken.deleteOne({ token });

    return NextResponse.json(
      { message: "Password đã reset thành công." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
