import { Router } from "express";
import { User } from "../models/User.js";

const router = Router();

/**
 * הופך משתמש ל-admin לפי אימייל
 * PATCH /api/users/make-admin
 */
router.patch("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "חסר אימייל בבקשה" });
    }

    // מחפשים את המשתמש ומעדכנים role ל-admin
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "משתמש לא נמצא" });
    }

    res.json({
      msg: "המשתמש הפך לאדמין בהצלחה",
      user: {
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (err) {
    console.error("Make-admin error:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

export default router;
