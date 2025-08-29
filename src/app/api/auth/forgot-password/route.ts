import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import connectToDatabase from "@/lib/mongodb";
import User, { IUser } from "@/models/user";
import PasswordResetToken from "@/models/passwordResetToken";
import { NextResponse } from "next/server";
import IUser from "@/models/user";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email } = await request.json();

    // validate email
    const isValidEmail = (email: string) => {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(email);
    };

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { message: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Email không tồn tại" },
        { status: 400 }
      );
    }

    // Xoa token cu
    await PasswordResetToken.deleteMany({ email });

    // Tao token moi
    const token = jwt.sign(
      { userId: (user._id as IUser).toString() },
      process.env.RESET_TOKEN_SECRET!,
      { expiresIn: "1h" }
    );
    const expires = new Date(Date.now() + 3600000); // 1 giờ

    await PasswordResetToken.create({ email, token, expires });

    // Gửi email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Reset mật khẩu",
      html: `<p>Click <a href="${resetUrl}">đây</a> để reset mật khẩu. Link hết hạn sau 1 giờ.</p>`,
    });

    return NextResponse.json(
      { message: "Email reset đã gửi thành công." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
