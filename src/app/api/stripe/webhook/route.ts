/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-05-28.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") || "";

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ message: "Webhook error" }, { status: 400 });
    }

    await connectToDatabase();
    console.log("Webhook event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { orderId, userId } = session.metadata || {};

      if (!orderId || !userId) {
        console.error("Missing orderId or userId in metadata");
        return NextResponse.json(
          { message: "Missing metadata" },
          { status: 400 }
        );
      }

      const order = await Order.findOneAndUpdate(
        { orderId },
        {
          status: "SUCCESS",
          stripeSessionId: session.id,
          paymentIntentId: session.payment_intent,
        },
        { new: true }
      );

      if (!order) {
        console.error("Order not found:", orderId);
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      console.log("Order updated:", order);
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { orderId } = session.metadata || {};

      if (!orderId) {
        console.error("Missing orderId in metadata");
        return NextResponse.json(
          { message: "Missing metadata" },
          { status: 400 }
        );
      }

      await Order.findOneAndUpdate(
        { orderId },
        { status: "CANCELLED" },
        { new: true }
      );
      console.log("Order cancelled:", orderId);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing webhook:", error.message, error.stack);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
