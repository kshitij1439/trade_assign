import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import storesRoutes from './routes/stores';
import ratingsRoutes from './routes/ratings';
import storeOwnerRoutes from './routes/storeOwner';
import { setupSwagger } from './swagger';

const app = express();
setupSwagger(app);

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/stores', storesRoutes);
app.use('/api/v1/ratings', ratingsRoutes);
app.use('/api/v1/store-owner', storeOwnerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));