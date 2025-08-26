// routes/productRoutes.js
import express from "express";
import { sellerOnlyUpload } from "../middleware/uploadMiddleware.js";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";
import {
  uploadProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import Product from "../models/product.js";

const router = express.Router();

// ----------------------
// Upload a new product/service (seller only)
// ----------------------
router.post(
  "/upload",
  protect,
  sellerOnly,
  sellerOnlyUpload("image"), // single image upload
  uploadProduct
);

// ----------------------
// Get all products of the logged-in seller
// ----------------------
router.get("/my-products", protect, sellerOnly, getMyProducts);

// ----------------------
// Get a single product by ID (seller only)
// ----------------------
router.get("/:id", protect, sellerOnly, getProductById);

// ----------------------
// Update a product by ID (optional image replacement)
// ----------------------
router.put(
  "/:id",
  protect,
  sellerOnly,
  sellerOnlyUpload("image"), // optional file upload
  updateProduct
);

// ----------------------
// Delete a product by ID
// ----------------------
router.delete("/:id", protect, sellerOnly, deleteProduct);

// ----------------------
// Public: Get all products by categoryType
// ----------------------
router.get("/get-by-type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const products = await Product.find({ categoryType: type }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products by type:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
