import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFlashSale extends Document {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  discountPercent: number;
  products: mongoose.Types.ObjectId[];
  maxQuantityPerUser?: number;
  totalSold: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  calculateSalePrice(originalPrice: number): number;
}

const FlashSaleSchema: Schema<IFlashSale> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(this: IFlashSale, endTime: Date) {
        return endTime > this.startTime;
      },
      message: "End time must be after start time"
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  discountPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }],
  maxQuantityPerUser: {
    type: Number,
    default: 5,
    min: 1,
  },
  totalSold: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

// Index for performance
FlashSaleSchema.index({ startTime: 1, endTime: 1 });
FlashSaleSchema.index({ isActive: 1 });
FlashSaleSchema.index({ products: 1 });

// Virtual để check xem flash sale có đang active không
FlashSaleSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && 
         this.startTime <= now && 
         this.endTime >= now;
});

// Method để tính sale price
FlashSaleSchema.methods.calculateSalePrice = function(originalPrice: number): number {
  return Math.round(originalPrice * (1 - this.discountPercent / 100));
};

// Static method để tìm flash sale đang active
FlashSaleSchema.statics.findActiveSales = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    startTime: { $lte: now },
    endTime: { $gte: now }
  }).populate('products').populate('createdBy', 'name email');
};

delete mongoose.models.FlashSale;
const FlashSale: Model<IFlashSale> = 
  mongoose.models.FlashSale || mongoose.model<IFlashSale>("FlashSale", FlashSaleSchema);

export default FlashSale;
