/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Vouchers from "@/models/voucher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    // 1. Kiểm tra voucher có tồn tại và còn hiệu lực
    const voucher = await Vouchers.findOne({
      code,
      expiresAt: { $gt: new Date() },
    });

    if (!voucher) {
      return NextResponse.json(
        { error: "Mã voucher không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    // 2. Trả về thông tin voucher
    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        value: voucher.value,
        discountAmount: voucher.value,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
