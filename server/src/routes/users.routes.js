import { Router } from "express";
import { User } from "../models/User.js";

const router = Router();

/**
Making a user an admin
 */
router.patch("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
    return res.status(400).json({ error: "Missing email please" });
    }

    // Search for the user and update role to admin
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      msg: "User successfully became admin",
      user: {
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (err) {
    console.error("Make-admin error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
