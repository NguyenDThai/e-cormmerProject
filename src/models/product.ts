import mongoose, { Schema } from "mongoose";

const configurationSchema = new Schema({
  // Common fields across categories
  ram: { type: Number, min: 0 }, // GB
  storage: { type: Number, min: 0 }, // bo nho luu tru
  screenSize: { type: Number, min: 0 }, // Kich thuoc man hinh

  // Phone-specific
  battery: { type: Number, min: 0 }, //Dung lượng Pin
  processor: { type: String }, // Bộ xử lý

  // Laptop-specific
  cpu: { type: String },
  gpu: { type: String }, //Card đồ họa

  // Camera-specific
  sensorResolution: { type: Number, min: 0 }, // megapixels Độ phân giải cảm biến
  lensType: { type: String }, //Loại ống kính
  videoResolution: { type: String }, //Độ phân giải video

  // Gaming-specific
  type: { type: String }, // e.g., VD: "Console", "Keyboard" loai thiet bị
  features: [{ type: String }], // e.g., ["RGB Lighting"] Tính năng

  // Other (flexible key-value pairs)
  custom: { type: Map, of: String },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: {
    type: String,
    enum: ["phone", "laptop", "airport", "gaming", "mouse", "camera", "other"],
    required: true,
  },
  image: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, required: false, min: 0 },
  configuration: { type: configurationSchema, required: false },
  createdAt: { type: Date, default: Date.now },
});

productSchema.index({ "configuration.ram": 1 });
productSchema.index({ "configuration.storage": 1 });
productSchema.index({ "configuration.screenSize": 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
