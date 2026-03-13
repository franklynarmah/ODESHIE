import { Router } from 'express';
import { authenticate } from './auth.js';
import db from '../db.js';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

// GET /api/cart
router.get('/', (req, res) => {
  try {
    const items = db.prepare(`
      SELECT
        ci.id,
        ci.quantity,
        ci.color,
        ci.size,
        ci.created_at,
        p.id as product_id,
        p.name,
        p.price,
        p.original_price,
        p.discount_percent,
        p.image_url,
        p.category,
        p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `).all(req.user.id);

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart
router.post('/', (req, res) => {
  try {
    const { product_id, quantity = 1, color, size } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart (same product, color, size)
    const existing = db.prepare(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND (color IS NULL OR color = ?) AND (size IS NULL OR size = ?)'
    ).get(req.user.id, product_id, color || null, size || null);

    if (existing) {
      const newQty = existing.quantity + quantity;
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
      const updated = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(existing.id);
      return res.json(updated);
    }

    const result = db.prepare(
      'INSERT INTO cart_items (user_id, product_id, quantity, color, size) VALUES (?, ?, ?, ?, ?)'
    ).run(req.user.id, product_id, quantity, color || null, size || null);

    const item = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT /api/cart/:id
router.put('/:id', (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const item = db.prepare('SELECT * FROM cart_items WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
    const updated = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(req.params.id);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM cart_items WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

export default router;
