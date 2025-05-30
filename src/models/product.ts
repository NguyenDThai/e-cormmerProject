import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: {
    type: String,
    enum: ["phone", "laptop", "airport", "gaming", "mouse"],
    required: true,
  },
  image: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, required: false, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
