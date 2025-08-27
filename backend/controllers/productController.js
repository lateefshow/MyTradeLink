// controllers/productController.js
import Product from "../models/product.js";
import fs from "fs";
import path from "path";

/**
 * @desc    Upload a new product or service
 * @route   POST /api/products/upload
 * @access  Private (seller only)
 */
export const uploadProduct = async (req, res) => {
  try {
    const { name, categoryType, category, price, stock, description } =
      req.body;

    // Validation
    if (!name || !categoryType || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, categoryType, category, and price are required",
      });
    }

    if (categoryType === "product" && (stock === undefined || stock === null)) {
      return res.status(400).json({
        success: false,
        message: "Stock is required for products",
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const product = await Product.create({
      seller: req.user._id,
      name,
      categoryType,
      category,
      price,
      stock: categoryType === "product" ? stock : null,
      description,
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Product uploaded successfully",
      product,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while uploading product",
    });
  }
};

/**
 * @desc    Get all products of the logged-in seller
 * @route   GET /api/products/my-products
 * @access  Private (seller only)
 */
export const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const products = await Product.find({ seller: sellerId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("Fetch seller products error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching seller products",
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Private (seller only)
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Ensure the logged-in seller owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this product",
      });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get product by ID error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};

/**
 * @desc    Update a product by ID
 * @route   PUT /api/products/:id
 * @access  Private (seller only)
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    const { name, categoryType, category, price, stock, description } =
      req.body;

    // Optional image update
    if (req.file) {
      // Delete old image if exists
      if (product.image) {
        const oldImagePath = path.join("uploads", product.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      product.image = req.file.filename;
    }

    product.name = name || product.name;
    product.categoryType = categoryType || product.categoryType;
    product.category = category || product.category;
    product.price = price || product.price;
    product.stock =
      product.categoryType === "product"
        ? stock !== undefined
          ? stock
          : product.stock
        : null;
    product.description = description || product.description;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/products/:id
 * @access  Private (seller only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // Delete image from server
    if (product.image) {
      const imagePath = path.join("uploads", product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};
