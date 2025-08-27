// routes/authRoutes.js
import express from "express";
import {
  registerBuyer,
  registerSeller,
  loginUser,
} from "../controllers/authController.js";
import { uploadBuyerImage } from "../middleware/buyerUpload.js";
import { uploadSellerImage } from "../middleware/sellerUpload.js";

const router = express.Router();

// Buyer routes
router.post(
  "/buyer-register",
  uploadBuyerImage.single("buyerImage"),
  registerBuyer
);

// Seller routes (with image)
/*router.post(
  "/seller-register",
  uploadSellerImage.single("sellerImage"),
  registerSeller
);
*/

// Shared login (buyer or seller)
router.post("/login", loginUser);

export default router;
