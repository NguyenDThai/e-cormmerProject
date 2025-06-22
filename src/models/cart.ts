/* eslint-disable @typescript-eslint/no-empty-object-type */
import mongoose, { Schema, Document, Model } from "mongoose";

export interface CartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  originalPrice: number;
  isFlashSale: boolean;
  flashSale?: mongoose.Types.ObjectId;
  maxQuantityPerUser?: number;
  addedAt: Date;
}

interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa các phương thức instance
interface ICartMethods {
  addItem(
    productId: mongoose.Types.ObjectId,
    quantity: number,
    price: number,
    originalPrice: number,
    isFlashSale: boolean,
    flashSaleId?: mongoose.Types.ObjectId,
    maxQuantityPerUser?: number
  ): Promise<ICart>;

  removeItem(productId: mongoose.Types.ObjectId): Promise<ICart>;
  updateQuantity(
    productId: mongoose.Types.ObjectId,
    quantity: number
  ): Promise<ICart>;
  calculateTotal(): number;
}

// Định nghĩa các phương thức static
interface CartModel extends Model<ICart, {}, ICartMethods> {
  findOrCreate(userId: mongoose.Types.ObjectId): Promise<ICart>;
}

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true, min: 0 },
  isFlashSale: { type: Boolean, default: false },
  flashSale: { type: Schema.Types.ObjectId, ref: "FlashSale" },
  maxQuantityPerUser: { type: Number },
  addedAt: { type: Date, default: Date.now },
});

const CartSchema = new Schema<ICart, CartModel, ICartMethods>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      unique: true,
      index: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes
// CartSchema.index({ user: 1 });
CartSchema.index({ "items.product": 1 });
CartSchema.index({ "items.flashSale": 1 });
CartSchema.index({ createdAt: -1 });

// Instance methods
CartSchema.methods.addItem = async function (
  productId: mongoose.Types.ObjectId,
  quantity: number,
  price: number,
  originalPrice: number,
  isFlashSale: boolean,
  flashSaleId?: mongoose.Types.ObjectId,
  maxQuantityPerUser?: number
) {
  const existingItem = this.items.find(
    (item) =>
      item.product.equals(productId) &&
      item.isFlashSale === isFlashSale &&
      (!item.flashSale || (flashSaleId && item.flashSale.equals(flashSaleId)))
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    existingItem.quantity =
      isFlashSale && maxQuantityPerUser
        ? Math.min(newQuantity, maxQuantityPerUser)
        : newQuantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price,
      originalPrice,
      isFlashSale,
      flashSale: flashSaleId,
      maxQuantityPerUser,
      addedAt: new Date(),
    });
  }

  return this.save();
};

CartSchema.methods.removeItem = function (productId: mongoose.Types.ObjectId) {
  this.items = this.items.filter((item) => !item.product.equals(productId));
  return this.save();
};

CartSchema.methods.updateQuantity = function (
  productId: mongoose.Types.ObjectId,
  newQuantity: number
) {
  const item = this.items.find((item) => item.product.equals(productId));
  if (item) {
    if (item.isFlashSale && item.maxQuantityPerUser) {
      item.quantity = Math.min(newQuantity, item.maxQuantityPerUser);
    } else {
      item.quantity = newQuantity;
    }
  }
  return this.save();
};

CartSchema.methods.calculateTotal = function () {
  return this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

// Static methods
CartSchema.statics.findOrCreate = async function (
  userId: mongoose.Types.ObjectId
) {
  let cart = await this.findOne({ user: userId }).populate({
    path: "items.product",
    model: "Product",
    select: "name brand category images price salePrice",
  });

  if (!cart) {
    cart = await this.create({ user: userId, items: [] });
  }

  return cart;
};

delete mongoose.models.Cart;
const Cart =
  mongoose.models.Cart || mongoose.model<ICart, CartModel>("Cart", CartSchema);

export default Cart;
