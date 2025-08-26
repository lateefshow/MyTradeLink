// routes/sellerRoutes.js
import express from "express";
import {
  registerSeller,
  getSellerProfile,
  updateSellerProfile,
  deactivateSeller,
  deleteSeller,
} from "../controllers/sellerController.js";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";
import { sellerOnlyUpload } from "../middleware/UploadMiddleware_Seller.js";

const router = express.Router();

// @route   POST /api/sellers/register
// @desc    Register a new seller with image upload
// @access  Public
router.post("/register", sellerOnlyUpload("sellerImage"), registerSeller);

// @route   GET /api/sellers/me
// @desc    Get seller profile
// @access  Private (seller only)
router.get("/me", protect, sellerOnly, getSellerProfile);

// @route   PUT /api/sellers/me
// @desc    Update seller profile (info, image, and optionally change password)
// @access  Private (seller only)
router.put(
  "/me",
  protect,
  sellerOnly,
  sellerOnlyUpload("sellerImage"),
  updateSellerProfile
);

// @route   PATCH /api/sellers/deactivate
// @desc    Deactivate seller account (keeps data, sets active=false)
// @access  Private (seller only)
router.patch("/deactivate", protect, sellerOnly, deactivateSeller);

// @route   DELETE /api/sellers/delete
// @desc    Permanently delete seller account
// @access  Private (seller only)
router.delete("/delete", protect, sellerOnly, deleteSeller);

export default router;
