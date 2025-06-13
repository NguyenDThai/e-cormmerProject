import connectToDatabase from "@/lib/mongodb";
import Vouchers from "@/models/voucher";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const vouchers = await Vouchers.find().sort({ createdAt: -1 });
    return NextResponse.json(vouchers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching vouchers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { code, value, expiresAt } = await request.json();

    const existingVoucher = await Vouchers.findOne({ code });
    if (existingVoucher) {
      return NextResponse.json(
        { error: "Voucher da ton tai" },
        { status: 400 }
      );
    }

    const voucher = new Vouchers({
      code,
      value,
      expiresAt: new Date(expiresAt),
    });

    await voucher.save();
    return NextResponse.json(voucher, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating voucher" },
      { status: 500 }
    );
  }
}
