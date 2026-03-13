import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/products
router.get('/', (req, res) => {
  try {
    const { category, is_new_arrival, is_on_sale, search, limit } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (is_new_arrival !== undefined) {
      query += ' AND is_new_arrival = ?';
      params.push(is_new_arrival === 'true' || is_new_arrival === '1' ? 1 : 0);
    }

    if (is_on_sale !== undefined) {
      query += ' AND is_on_sale = ?';
      params.push(is_on_sale === 'true' || is_on_sale === '1' ? 1 : 0);
    }

    if (search) {
      query += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY id DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const products = db.prepare(query).all(...params);

    const parsed = products.map(p => ({
      ...p,
      colors: JSON.parse(p.colors || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      is_new_arrival: Boolean(p.is_new_arrival),
      is_on_sale: Boolean(p.is_on_sale)
    }));

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const parsed = {
      ...product,
      colors: JSON.parse(product.colors || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      is_new_arrival: Boolean(product.is_new_arrival),
      is_on_sale: Boolean(product.is_on_sale)
    };

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
