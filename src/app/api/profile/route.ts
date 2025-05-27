import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
export async function GET() {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Authorization" }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const users = await User.findOne({ email: session.user.email }).select(
      "name email image role"
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
