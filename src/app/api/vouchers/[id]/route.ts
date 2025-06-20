import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Vouchers from "@/models/voucher";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const voucher = await Vouchers.findByIdAndDelete(id);
    if (!voucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Đã xóa voucher thành công" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting voucher" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { code, value, expiresAt } = await request.json();

    const existingVoucher = await Vouchers.findOne({ code, _id: { $ne: id } });
    if (existingVoucher) {
      return NextResponse.json(
        { errro: "Voucher đã tồn tại" },
        { status: 400 }
      );
    }

    const voucher = await Vouchers.findByIdAndUpdate(
      id,
      {
        code,
        value,
        expiresAt: new Date(expiresAt),
      },
      { new: true, runValidators: true }
    );

    if (!voucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    return NextResponse.json(voucher);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating voucher" },
      { status: 500 }
    );
  }
}
