import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
router.use(authenticate, authorize('ADMIN'));

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
// Stats
router.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [users, stores, ratings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);
    res.json({ users, stores, ratings });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user
router.post('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    if (name.length < 20 || name.length > 60) {
      res.status(400).json({ message: 'Name must be 20-60 characters' });
      return;
    }
    if (address.length > 400) {
      res.status(400).json({ message: 'Address max 400 characters' });
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ message: 'Password must be 8-16 chars with uppercase and special character' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, address, role },
    });

    const { password: _, ...result } = user;
    res.status(201).json(result);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
// Get all users
router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query as any;

    const users = await prisma.user.findMany({
      where: {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(email && { email: { contains: email, mode: 'insensitive' } }),
        ...(address && { address: { contains: address, mode: 'insensitive' } }),
        ...(role && { role }),
      },
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by id
router.get('/users/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: +req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: {
          select: {
            ratings: { select: { value: true } },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    let storeRating = null;
    if (user.store?.ratings?.length) {
      const avg = user.store.ratings.reduce((a, b) => a + b.value, 0) / user.store.ratings.length;
      storeRating = avg;
    }

    res.json({ ...user, storeRating });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create store
router.post('/stores', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    if (name.length < 20 || name.length > 60) {
      res.status(400).json({ message: 'Name must be 20-60 characters' });
      return;
    }

    const existing = await prisma.store.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: 'Store email already in use' });
      return;
    }

    const store = await prisma.store.create({
      data: { name, email, address, ownerId: +ownerId },
    });

    res.status(201).json(store);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /admin/stores:
 *   get:
 *     summary: Get all stores
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stores
 */
// Get all stores
router.get('/stores', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = req.query as any;

    const stores = await prisma.store.findMany({
      where: {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(email && { email: { contains: email, mode: 'insensitive' } }),
        ...(address && { address: { contains: address, mode: 'insensitive' } }),
      },
      orderBy: { [sortBy]: sortOrder },
      include: { ratings: { select: { value: true } } },
    });

    const result = stores.map((store) => {
      const avg = store.ratings.length
        ? store.ratings.reduce((a, b) => a + b.value, 0) / store.ratings.length
        : 0;
      return { ...store, averageRating: avg, ratings: undefined };
    });

    res.json(result);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;