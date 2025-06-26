import mongoose, { Schema, Document, Model } from "mongoose";

interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

interface IOrder extends Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "PROCESSING";
  paymentMethod: string;
  items: IOrderItem[];
  zalopayTransId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema = new Schema<IOrder>({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED", "PROCESSING"],
    default: "PENDING",
  },
  paymentMethod: {
    type: String,
    default: "ZaloPay",
  },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  zalopayTransId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
