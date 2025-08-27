// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Buyer from "../models/Buyer.js";
import Seller from "../models/Seller.js";

// ✅ Middleware to protect routes (must be logged in)
export const protect = async (req, res, next) => {
  let token;

  console.log("🔎 Incoming Authorization Header:", req.headers.authorization);

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Extracted token:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("✅ Decoded token:", decoded);

      // Try Buyer first
      let user = await Buyer.findById(decoded.id).select("-password");
      if (user) console.log("👤 Found Buyer:", user.email);

      // If not Buyer, check Seller
      if (!user) {
        user = await Seller.findById(decoded.id).select("-password");
        if (user) console.log("👤 Found Seller:", user.email);
      }

      if (!user) {
        console.log("⚠️ User not found in DB for decoded.id:", decoded.id);
        return res.status(401).json({ message: "❌ User not found" });
      }

      req.user = user; // attach user to request
      next();
    } catch (error) {
      console.error("❌ Auth error during token verify:", error.message);
      return res
        .status(401)
        .json({ message: "❌ Not authorized, invalid token" });
    }
  } else {
    console.log("⚠️ No Authorization header sent");
    return res.status(401).json({ message: "❌ Not authorized, no token" });
  }
};

// ✅ Middleware to check if user is an Admin
export const admin = (req, res, next) => {
  console.log("🔎 Checking admin role:", req.user?.role);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "❌ Admin access only" });
  }
};

// ✅ Middleware to check if user is a Seller
export const sellerOnly = (req, res, next) => {
  console.log("🔎 Checking seller role:", req.user?.role);
  if (req.user && req.user.role === "seller") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "❌ Access denied: Seller Image is not Uploading" });
  }
};
