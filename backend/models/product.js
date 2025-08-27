// models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Product/Service name is required"],
      trim: true,
    },
    categoryType: {
      type: String,
      enum: ["product", "service"],
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      default: function () {
        // Services don’t need stock, only products do
        return this.categoryType === "product" ? 0 : null;
      },
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // store file path / URL
      required: [true, "At least one image is required"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
