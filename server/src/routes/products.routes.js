import { Router } from 'express';
import { Product } from '../models/Product.js';
import { authRequired, requireRole } from '../middleware/auth.js';


const router = Router();

// ➕ הוספת מוצר חדש (רק למנהל)
router.post(
  '/',
  authRequired,           // חובה להיות מחובר
  requireRole('admin'),   // חובה להיות מנהל
  async (req, res) => {
    try {
      const { title, price, imageUrl, description, category, stock } = req.body;
      const newProduct = await Product.create({ title, price, imageUrl, description, category, stock });
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);


// 📦 קבלת כל המוצרים
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

// ✏️ עדכון מוצר קיים לפי ה-ID שלו (רק למנהל)
router.put(
  '/:id',
  authRequired,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

      if (!updatedProduct) {
        return res.status(404).json({ error: 'מוצר לא נמצא' });
      }

      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);





// 🗑️ מחיקת מוצר לפי ה-ID שלו (רק למנהל)
router.delete(
  '/:id',
  authRequired,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ error: 'מוצר לא נמצא' });
      }

      res.json({ msg: 'המוצר נמחק בהצלחה', deletedProduct });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

