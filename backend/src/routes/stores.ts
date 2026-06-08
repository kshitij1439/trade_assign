import { Router, Response } from 'express';
import prisma from '../prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
router.use(authenticate, authorize('NORMAL_USER'));

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Get all stores with user ratings
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stores
 */
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'asc' } = req.query as any;
    const userId = req.user!.id;

    const stores = await prisma.store.findMany({
      where: {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(address && { address: { contains: address, mode: 'insensitive' } }),
      },
      orderBy: { [sortBy]: sortOrder },
      include: { ratings: { select: { value: true, userId: true, id: true } } },
    });

    const result = stores.map((store) => {
      const avg = store.ratings.length
        ? store.ratings.reduce((a, b) => a + b.value, 0) / store.ratings.length
        : 0;
      const userRating = store.ratings.find((r) => r.userId === userId);
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avg,
        userRating: userRating ? { id: userRating.id, value: userRating.value } : null,
      };
    });

    res.json(result);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
