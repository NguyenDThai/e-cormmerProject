import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const allUser = await User.find({}).select("name email role address phone");
    return NextResponse.json({ allUser }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
