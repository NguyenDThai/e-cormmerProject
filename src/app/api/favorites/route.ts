import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    // Get the server-side session
    const session = await getServerSession();

    // Check if user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();

    // Fetch user by email and populate favorites
    const user = await User.findOne({ email: session.user.email })
      .populate("favorite")
      .exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ favorite: user.favorite }, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Updated POST handler to use email
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { userEmail, productId } = await request.json();

    // Validate inputs
    if (!userEmail || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid user email or product ID" },
        { status: 400 }
      );
    }

    // Fetch user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle favorite: add if not present, remove if present
    const index = user.favorite.indexOf(productId);
    if (index === -1) {
      user.favorite.push(productId);
    } else {
      user.favorite.splice(index, 1);
    }

    await user.save();
    return NextResponse.json(
      { message: "Favorite updated", favorite: user.favorite },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
