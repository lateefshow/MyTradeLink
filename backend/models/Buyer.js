// models/Buyer.js
import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    buyerImage: {
      type: String,
      default: "buyer_avatar.jpeg", // default image if none uploaded
    },
    role: {
      type: String,
      enum: ["buyer"], // restricts to only "buyer"
      default: "buyer", // automatically assigns role = "buyer"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Buyer", buyerSchema);
