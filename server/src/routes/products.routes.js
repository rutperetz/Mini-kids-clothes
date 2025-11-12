import { Router } from 'express';
import { Product } from '../models/Product.js';

const router = Router();

// ➕ הוספת מוצר חדש
router.post('/', async (req, res) => {
  try {
    const { title, price, imageUrl, description, category, stock } = req.body;
    const newProduct = await Product.create({ title, price, imageUrl, description, category, stock });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

// ✏️ עדכון מוצר לפי ה-ID שלו
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; // מזהה המוצר מתוך ה-URL
    const updates = req.body;  // הנתונים החדשים מהלקוח

    // עדכון המוצר במסד לפי ה-ID
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'מוצר לא נמצא' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




// 🗑️ מחיקת מוצר לפי ה-ID שלו
router.delete('/:id', async (req, res) => {
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
});
