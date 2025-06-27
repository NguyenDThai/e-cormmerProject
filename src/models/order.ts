import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface cho mục sản phẩm trong đơn hàng
interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

// Interface cho đơn hàng
interface IOrder extends Document {
  orderId: string;
  userId: Types.ObjectId;
  amount: number;
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "AWAITING_PAYMENT" | "CANCELLED";
  paymentMethod: "ZaloPay" | "stripe" | "cod";
  items: IOrderItem[];
  zalopayTransId?: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa schema
const orderSchema: Schema<IOrder> = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true, // Thêm chỉ mục cho hiệu suất tìm kiếm
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
      enum: ["PENDING", "PROCESSING", "SUCCESS", "FAILED", "AWAITING_PAYMENT", "CANCELLED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["ZaloPay", "stripe", "cod"],
      default: "ZaloPay",
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    zalopayTransId: {
      type: String,
    },
    stripeSessionId: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true, // Tự động quản lý createdAt và updatedAt
  }
);

// Middleware để cập nhật updatedAt khi tài liệu thay đổi
orderSchema.pre<IOrder>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Tạo model
const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>("Order", orderSchema);

export default Order;