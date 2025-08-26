// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Buyer from "../models/Buyer.js";
import Seller from "../models/Seller.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

// -----------------------
// REGISTER BUYER
// -----------------------
export const registerBuyer = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const buyerImage = req.file ? req.file.filename : "buyer_avatar.jpeg"; // Use uploaded image or default

  try {
    // Check if email exists
    let buyer = await Buyer.findOne({ email });
    if (buyer) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create buyer
    buyer = await Buyer.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      buyerImage,
    });

    res.status(201).json({
      _id: buyer._id,
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      email: buyer.email,
      buyerImage: buyer.buyerImage,
      role: "buyer",
      token: generateToken(buyer._id, "buyer"),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// -----------------------
// REGISTER SELLER
// -----------------------
export const registerSeller = async (req, res) => {
  const { businessName, ownerName, email, password } = req.body;
  const sellerImage = req.file ? req.file.filename : "seller_avatar.jpeg"; // optional

  try {
    let seller = await Seller.findOne({ email });
    if (seller) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    seller = await Seller.create({
      businessName,
      ownerName,
      email,
      password: hashedPassword,
      sellerImage,
    });

    res.status(201).json({
      _id: seller._id,
      businessName: seller.businessName,
      ownerName: seller.ownerName,
      email: seller.email,
      sellerImage: seller.sellerImage,
      role: "seller",
      token: generateToken(seller._id, "seller"),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// -----------------------
// LOGIN USER (Buyer or Seller)
// -----------------------
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    if (role === "buyer") {
      user = await Buyer.findOne({ email });
    } else if (role === "seller") {
      user = await Seller.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      role,
      ...(role === "buyer"
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            buyerImage: user.buyerImage,
          }
        : {
            businessName: user.businessName,
            ownerName: user.ownerName,
            sellerImage: user.sellerImage,
          }),
      token: generateToken(user._id, role),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
