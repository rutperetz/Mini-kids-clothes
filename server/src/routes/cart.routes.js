import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const existing = user.cart.find((item) => item.productId == productId);

        if (existing) {
            existing.quantity += 1;
        } else {
            user.cart.push({ productId, quantity: 1 });
        }

        await user.save();

        res.json({ ok: true, cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get cart items
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate("cart.productId");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ ok: true, cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;

// Remove item from cart
router.post("/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.cart = user.cart.filter(item => item.productId != productId);
        await user.save();

        res.json({ ok: true, cart: user.cart });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/increase", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await User.findById(userId);

        const item = user.cart.find(i => i.productId == productId);
        if (item) {
            item.quantity += 1;
            await user.save();
        }

        res.json({ ok: true, cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/decrease", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await User.findById(userId);

        const item = user.cart.find(i => i.productId == productId);
        if (item) {

            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // If the quantity drops to zero — delete from cart
                user.cart = user.cart.filter(i => i.productId != productId);
            }

            await user.save();
        }

        res.json({ ok: true, cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
