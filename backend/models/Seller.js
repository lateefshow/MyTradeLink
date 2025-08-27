// models/Seller.js
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    businessLevel: {
      type: String,
      enum: ["individual", "small", "enterprise"],
      required: true,
    },
    category: { type: String, enum: ["products", "services"], required: true },
    address: { type: String },
    description: { type: String },
    sellerImage: { type: String }, // File path
    password: { type: String, required: true },

    // 🔹 Role added here
    role: {
      type: String,
      enum: ["seller"],
      default: "seller",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);
