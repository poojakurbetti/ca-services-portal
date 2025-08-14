import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

dotenv.config();

// --- App Init ---
const app = express();
const PORT = process.env.PORT || 4000;

// --- Core Middleware ---
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// --- DB Connect ---
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('Missing MONGO_URI in .env');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('✅ MongoDB connected');
}

// --- Auth Helpers (JWT) ---
function auth(required = true) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      const cookieToken = req.cookies?.token;
      const raw = token || cookieToken;

      if (!raw) {
        if (required) return res.status(401).json({ message: 'Unauthorized' });
        return next();
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('Missing JWT_SECRET in .env');

      const payload = jwt.verify(raw, secret);
      req.user = payload; // { id, role }
      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

// --- Health ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- Routes (will be added in next files) ---
// import authRoutes from './routes/auth.routes.js';
// import serviceRoutes from './routes/service.routes.js';
// import blogRoutes from './routes/blog.routes.js';
// import alertRoutes from './routes/alert.routes.js';
// import enquiryRoutes from './routes/enquiry.routes.js';
// app.use('/api/auth', authRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/alerts', alertRoutes);
// app.use('/api/enquiries', enquiryRoutes);

// --- 404 & Error Handler ---
app.use((req, res, next) => {
  return res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

// --- Start ---
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/enquiries', enquiryRoutes);


export { auth, requireRole };
