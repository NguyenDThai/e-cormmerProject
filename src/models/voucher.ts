import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Vouchers =
  mongoose.models.Voucher || mongoose.model("Voucher", VoucherSchema);

export default Vouchers;
