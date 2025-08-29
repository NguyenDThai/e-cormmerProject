import { authOptions } from "./../../../lib/auth";
/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Authorization" }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const users = await User.findOne({ email: session.user.email }).select(
      "name email image address phone role"
    );
    if (!users) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, phone, currentPassword, newPassword } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // const user = await User.findOneAndUpdate(
    //   { email: session.user.email },
    //   { $set: { name, address, phone } },
    //   { new: true, runValidators: true }
    // );

    // if (!user) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    // // Verify the update in the database
    // const updatedUser = await User.findOne({ email: session.user.email });
    // console.log("Database user after update:", updatedUser);

    // return NextResponse.json({ users: user });

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // handle password if provided
    const updateData: any = { name, address, phone };
    if (currentPassword && newPassword) {
      if (!user.password) {
        return NextResponse.json(
          { message: "No password set for this account" },
          { status: 400 }
        );
      }
      // verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Mật khẩu hiện tại không đúng" },
          { status: 400 }
        );
      }

      const hashNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashNewPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("name email image address phone role");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify the update in the database
    // const verifiedUser = await User.findOne({ email: session.user.email });

    return NextResponse.json({ users: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
