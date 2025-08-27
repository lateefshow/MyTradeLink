// controllers/sellerController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

// ===============================
// REGISTER SELLER
// ===============================
export const registerSeller = async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      phone,
      businessLevel,
      category,
      address,
      description,
      password,
    } = req.body;

    // Check if seller already exists
    let seller = await Seller.findOne({ email });
    if (seller) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create seller
    seller = await Seller.create({
      businessName,
      ownerName,
      email,
      phone,
      businessLevel,
      category,
      address,
      description,
      sellerImage: req.file ? req.file.filename : null,
      password: hashedPassword,
    });

    // Return seller info with JWT token
    res.status(201).json({
      _id: seller._id,
      email: seller.email,
      role: "seller",
      sellerImage: seller.sellerImage,
      token: generateToken(seller._id, "seller"),
      message: "Seller registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// ===============================
// GET SELLER PROFILE
// ===============================
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user._id).select("-password");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// ===============================
// UPDATE SELLER PROFILE (with optional password change)
// ===============================
export const updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user._id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Update basic fields
    seller.businessName = req.body.businessName || seller.businessName;
    seller.ownerName = req.body.ownerName || seller.ownerName;
    seller.email = req.body.email || seller.email;
    seller.phone = req.body.phone || seller.phone;
    seller.address = req.body.address || seller.address;
    seller.description = req.body.description || seller.description;
    seller.category = req.body.category || seller.category;
    seller.businessLevel = req.body.businessLevel || seller.businessLevel;

    // Handle seller image upload (if new file uploaded)
    if (req.file) {
      seller.sellerImage = req.file.filename; // stored by multer
    }

    // =============================
    // Password Change Logic
    // =============================
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message: "All password fields are required to change password",
        });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, seller.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Confirm new password match
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      seller.password = await bcrypt.hash(newPassword, salt);
    }

    // Save updated seller
    const updatedSeller = await seller.save();

    res.json({
      _id: updatedSeller._id,
      businessName: updatedSeller.businessName,
      ownerName: updatedSeller.ownerName,
      email: updatedSeller.email,
      phone: updatedSeller.phone,
      address: updatedSeller.address,
      description: updatedSeller.description,
      category: updatedSeller.category,
      businessLevel: updatedSeller.businessLevel,
      sellerImage: updatedSeller.sellerImage,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating seller profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// DEACTIVATE SELLER ACCOUNT
// ===============================
export const deactivateSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user._id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.active = false; // ✅ add `active: { type: Boolean, default: true }` in Seller schema
    await seller.save();

    res.json({ message: "Seller account deactivated" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// ===============================
// DELETE SELLER ACCOUNT
// ===============================
export const deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user._id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    await seller.deleteOne();
    res.json({ message: "Seller account deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
