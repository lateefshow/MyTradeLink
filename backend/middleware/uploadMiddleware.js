// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// ----------------------
// Ensure uploads folder exists
// ----------------------
const uploadDir = "uploads/products";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ----------------------
// Multer Storage Config
// ----------------------
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ----------------------
// File Filter (only images allowed)
// ----------------------
function fileFilter(req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only image files are allowed (jpeg, jpg, png, gif)"));
  }
}

// ----------------------
// Multer instance
// ----------------------
const upload = multer({ storage, fileFilter });

// ----------------------
// Role-based wrapper: only sellers can upload
// ----------------------
export const sellerOnlyUpload = (fieldName) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "❌ Access denied: Only sellers can upload products",
      });
    }

    // Apply Multer upload
    const uploader = upload.single(fieldName);

    uploader(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors (like file too large)
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        // Custom error from fileFilter
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
};

export default upload;
