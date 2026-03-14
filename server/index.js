import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import cartRouter from './routes/cart.js';
import reviewsRouter from './routes/reviews.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://10.229.247.254:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/reviews', reviewsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ODESHIE API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database then start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`ODESHIE Server running on http://localhost:${PORT}`);
    console.log(`Database initialized successfully`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
