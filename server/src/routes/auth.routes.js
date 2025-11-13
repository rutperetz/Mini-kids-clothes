import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = Router();

/**
 * הרשמה
 * POST /api/auth/register
 * body: { name, email, password }
 */
router.post(
  '/register',
  [
    body('name')
      .isString()
      .isLength({ min: 2 })
      .withMessage('השם חייב להיות לפחות 2 תווים'),
    body('email')
      .isEmail()
      .withMessage('אימייל לא תקין'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('סיסמה חייבת להיות לפחות 6 תווים'),
  ],
  async (req, res) => {
    try {
      // בדיקת ולידציות
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // לבדוק אם המייל כבר רשום
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: 'האימייל הזה כבר רשום במערכת' });
      }

      // הצפנת סיסמה
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // יצירת משתמש חדש
      const user = await User.create({
        name,
        email,
        passwordHash,
        role: 'user', // בעתיד נוכל לשנות ל-admin דרך Compass
      });

      // יצירת טוקן JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      // החזרת פרטי משתמש בלי הסיסמה
      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'שגיאה בשרת בזמן הרשמה' });
    }
  }
);

/**
 * התחברות
 * POST /api/auth/login
 * body: { email, password }
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('אימייל לא תקין'),
    body('password').isLength({ min: 6 }).withMessage('חובה סיסמה'),
  ],
  async (req, res) => {
    try {
      // בדיקת ולידציות
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // חיפוש משתמש לפי אימייל
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
      }

      // בדיקת סיסמה
      const passwordOk = await bcrypt.compare(password, user.passwordHash);
      if (!passwordOk) {
        return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
      }

      // יצירת טוקן חדש
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'שגיאה בשרת בזמן התחברות' });
    }
  }
);

export default router;
