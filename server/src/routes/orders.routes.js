import express from "express";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";

const router = express.Router();

// Create a new order
router.post("/create", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).populate("cart.productId");
    if (!user) return res.status(404).json({ error: "User not found" });

    const orderItems = user.cart.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
    }));

    const total = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const newOrder = await Order.create({
      userId,
      items: orderItems,
      totalPrice: total
    });

    // Empty cart after purchase
    user.cart = [];
    await user.save();

    res.json({ ok: true, order: newOrder });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders from a specific user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({ ok: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
