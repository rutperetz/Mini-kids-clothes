import { Router } from 'express';
import { Product } from '../models/Product.js';
import { authRequired, requireRole } from '../middleware/auth.js';

/*CRUD - create-post, read-get, update-put, delete-delete*/ 

const router = Router();

//Creates a new product - only the administrator can do this
router.post(
  '/',
  authRequired,           
  requireRole('admin'),  //only the administrator can create products
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


// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

//Product update by ID
router.put(
  '/:id',
  authRequired,
  requireRole('admin'),//only the administrator can update products
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

      if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
      }

      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

//Delete product by ID
router.delete(
  '/:id',
  authRequired,
  requireRole('admin'),//only the administrator can delete products
  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' }); 
      }

      res.json({ msg: 'Product deleted successfully', deletedProduct });  
      } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Get product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


