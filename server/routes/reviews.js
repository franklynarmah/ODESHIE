import { Router } from 'express';
import { authenticate } from './auth.js';
import db from '../db.js';

const router = Router();

// GET /api/reviews/:productId
router.get('/:productId', (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT r.id, r.product_id, r.user_id, r.rating, r.comment, r.reviewer_name, r.created_at, u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `).all(req.params.productId);

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews
router.post('/', authenticate, (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'Product ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existing = db.prepare(
      'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?'
    ).get(product_id, req.user.id);

    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this product' });
    }

    const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.user.id);

    const result = db.prepare(`
      INSERT INTO reviews (product_id, user_id, rating, comment, reviewer_name)
      VALUES (?, ?, ?, ?, ?)
    `).run(product_id, req.user.id, rating, comment || null, user.name);

    // Update product rating
    const allReviews = db.prepare('SELECT rating FROM reviews WHERE product_id = ?').all(product_id);
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    db.prepare(
      'UPDATE products SET rating = ?, review_count = ? WHERE id = ?'
    ).run(Math.round(avgRating * 10) / 10, allReviews.length, product_id);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;
