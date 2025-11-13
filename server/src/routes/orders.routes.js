import { Router } from 'express';
import { Order } from '../models/Order.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const router = Router();

/**
 * יצירת הזמנה חדשה
 * POST /api/orders
 * גוף הבקשה:
 * {
 *   "items": [
 *     { "productId": "...", "title": "Coat", "price": 199.9, "quantity": 2 },
 *     { "productId": "...", "title": "Hat",  "price": 49.9,  "quantity": 1 }
 *   ]
 * }
 */
router.post('/', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;        // מתוך הטוקן
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'חייבים לשלוח לפחות פריט אחד בהזמנה' });
    }

    // מחשבים סכום כולל
    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0);

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'שגיאה בשרת בזמן יצירת הזמנה' });
  }
});

/**
 * החזרת כל ההזמנות של המשתמש המחובר
 * GET /api/orders/my-orders
 */
router.get('/my-orders', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Get my orders error:', err);
    res.status(500).json({ error: 'שגיאה בשרת בזמן קריאת הזמנות' });
  }
});

/**
 * כל ההזמנות במערכת – למנהל בלבד
 * GET /api/orders
 */
router.get('/', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // יציג שם ואימייל של המשתמש
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Get all orders error:', err);
    res.status(500).json({ error: 'שגיאה בשרת בזמן קריאת כל ההזמנות' });
  }
});

export default router;
