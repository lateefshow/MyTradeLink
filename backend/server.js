// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ----------------------
// Middleware
// ----------------------
/* app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
*/

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000", // Local dev
  "https://mytradelink-frontend.onrender.com",      // Render frontend
  //"https://mytradelink.vercel.app"                  // Vercel frontend (if you deploy there)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// ----------------------
// Serve static uploads folder
// ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Example: http://localhost:8000/uploads/filename.png

// (Optional: buyers-specific uploads folder if needed)
app.use(
  "/uploads/buyers",
  express.static(path.join(__dirname, "uploads/buyers"))
);

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/products", productRoutes);

// ----------------------
// Health check
// ----------------------
app.get("/", (req, res) => {
  res.send("✅ TradeLink Backend is running!");
});

// ----------------------
// Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ----------------------
// Server
// ----------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

