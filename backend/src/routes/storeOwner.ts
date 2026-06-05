import { Router, Response } from 'express';
import prisma from '../prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
router.use(authenticate, authorize('STORE_OWNER'));

router.get('/dashboard', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.user!.id },
      include: {
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!store) {
      res.status(404).json({ message: 'No store found' });
      return;
    }

    const avg = store.ratings.length
      ? store.ratings.reduce((a, b) => a + b.value, 0) / store.ratings.length
      : 0;

    res.json({
      storeId: store.id,
      storeName: store.name,
      averageRating: avg,
      totalRatings: store.ratings.length,
      raters: store.ratings.map((r) => ({
        user: r.user,
        rating: r.value,
        submittedAt: r.createdAt,
      })),
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
