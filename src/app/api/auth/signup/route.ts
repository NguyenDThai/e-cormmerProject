import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
  const { name, email, password, confirmPassword } = await request.json();

  const isValidEmail = (email: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { message: "All filed are required" },
      { status: 400 }
    );
  }
  if (!isValidEmail) {
    return NextResponse.json(
      { message: "Định dạng email không hợp lệ" },
      { status: 400 }
    );
  }
  if (confirmPassword !== password) {
    return NextResponse.json(
      { message: "Vui lòng nhập đúng mật khẩu trên" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      {
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Tài khoản đã tồn tại" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });
    await newUser.save();
    return NextResponse.json(
      { message: "Đã đăng ký tài khoản thành công" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
