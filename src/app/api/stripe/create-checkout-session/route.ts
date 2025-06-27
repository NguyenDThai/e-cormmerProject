/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-05-28.basil",
});

interface StripeCheckoutRequest {
  userId: string;
  amount: number;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  email: string;
  name: string;
  voucherCode?: string | null; // Mã voucher có thể là null
  paymentMethod: "stripe" | "cod";
}

export async function POST(req: NextRequest) {
  try {
    console.log("Received request to /api/stripe/create-checkout-session");
    await connectToDatabase();
    console.log("MongoDB connected");

    const body = (await req.json()) as StripeCheckoutRequest;
    console.log("Request body:", body);
    const { userId, amount, items, email, name, voucherCode, paymentMethod } =
      body;

    if (!userId || !amount || !items || !email || !name) {
      console.log("Missing required fields:", {
        userId,
        amount,
        items,
        email,
        name,
      });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate order ID
    const date = new Date();
    const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, "");
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `${yymmdd}_${randomNum}`;
    console.log("Generated orderId:", orderId);

    // Save order to MongoDB
    console.log("Creating order in MongoDB...");
    const order = new Order({
      orderId,
      userId,
      amount: Math.floor(amount),
      items,
      paymentMethod,
      status: paymentMethod === "stripe" ? "PENDING" : "AWAITING_PAYMENT",
      voucherCode: voucherCode || null, // Lưu mã voucher để theo dõi
    });
    await order.save();
    console.log("Order saved:", order._id);

    if (paymentMethod === "stripe") {
      // Tính lại price_data dựa trên finalTotal
      const totalItemsPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const lineItems = items.map((item) => {
        const originalSubtotal = item.price;
        const adjustedPrice = Math.floor(
          (originalSubtotal / totalItemsPrice) * amount
        ); // Phân bổ giảm giá theo tỷ lệ
        return {
          price_data: {
            currency: "vnd",
            product_data: {
              name: item.name,
            },
            unit_amount: adjustedPrice > 0 ? adjustedPrice : 1, // Đảm bảo giá không âm
          },
          quantity: item.quantity,
        };
      });

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        line_items: lineItems,
        mode: "payment",
        success_url: `${
          process.env.NEXT_PUBLIC_API_NGROK || "http://localhost:3000"
        }/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${
          process.env.NEXT_PUBLIC_API_NGROK || "http://localhost:3000"
        }/payment-cancel`,
        metadata: {
          orderId,
          userId,
        },
      });

      console.log("Stripe session created:", session.id);
      return NextResponse.json({ sessionId: session.id }, { status: 200 });
    } else if (paymentMethod === "cod") {
      return NextResponse.json({ orderId }, { status: 200 });
    }
    return NextResponse.json(
      { message: "Phương thức thanh toán không hợp lệ" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error creating Stripe session:", error.message, error.stack);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
