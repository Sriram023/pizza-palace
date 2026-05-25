const express = require('express');

const cors = require('cors');

const helmet = require('helmet');

const morgan = require('morgan');

const rateLimit = require('express-rate-limit');

// ROUTES
const authRoutes = require('./routes/auth.routes');

const pizzaRoutes = require('./routes/pizza.routes');

const orderRoutes = require('./routes/order.routes');

const paymentRoutes = require('./routes/payment.routes');

// ERROR HANDLER
const errorHandler = require('./middleware/error');

const app = express();

// ======================================
// SECURITY + MIDDLEWARE
// ======================================

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL,

    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

app.use(morgan('dev'));

// ======================================
// RATE LIMITER
// ======================================

const authLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 50,

  standardHeaders: true,

  legacyHeaders: false,
});

// ======================================
// HEALTH CHECK
// ======================================

app.get('/api/health', (_req, res) =>
  res.json({ ok: true })
);

// ======================================
// ROUTES
// ======================================

app.use(
  '/api/auth',
  authLimiter,
  authRoutes
);

app.use('/api/pizzas', pizzaRoutes);

app.use('/api/orders', orderRoutes);

// PAYMENT ROUTES
app.use('/api/payments', paymentRoutes);

// ======================================
// 404
// ======================================

app.use((req, res) =>
  res.status(404).json({
    message: 'Route not found',
  })
);

// ======================================
// ERROR HANDLER
// ======================================

app.use(errorHandler);

module.exports = app;
