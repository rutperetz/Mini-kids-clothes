const express = require("express");
const router = express.Router();
const User = require("../models/User");

// הוספת מוצר לעגלה
router.post("/add", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // בדיקה אם זה כבר בעגלה
        const existingItem = user.cart.find(item => item.productId == productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ productId });
        }

        await user.save();
        res.json({ message: "Added to cart", cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// טעינת עגלה
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate("cart.productId");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;