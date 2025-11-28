// server/src/routes/stats.routes.js
import express from "express";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const router = express.Router();

/**
 
 *    GET /api/stats/users-by-month
 */
router.get("/users-by-month", async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(result);
  } catch (err) {
    console.error("Error in /api/stats/users-by-month:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * 
 *    GET /api/stats/products-summary
 */
router.get("/products-summary", async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

  res.json(result[0] || {
      totalProducts: 0,
      totalStock: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
    });
  } catch (err) {
    console.error("Error in /api/stats/products-summary:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
// SORT users by registration date (newest first)
router.get("/sort/registration", async (req, res) => {
  try {
    const result = await User.find().sort({ createdAt: -1 });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
