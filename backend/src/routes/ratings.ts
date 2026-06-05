import { Router, Response } from 'express';
import prisma from '../prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
router.use(authenticate, authorize('NORMAL_USER'));

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { storeId, value } = req.body;
    const userId = req.user!.id;

    if (!storeId || !value || value < 1 || value > 5) {
      res.status(400).json({ message: 'storeId and value (1-5) are required' });
      return;
    }

    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId, storeId: +storeId } },
    });
    if (existing) {
      res.status(409).json({ message: 'You have already rated this store' });
      return;
    }

    const rating = await prisma.rating.create({
      data: { userId, storeId: +storeId, value: +value },
    });

    res.status(201).json(rating);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { value } = req.body;
    const userId = req.user!.id;
    const ratingId = +req.params.id;

    if (!value || value < 1 || value > 5) {
      res.status(400).json({ message: 'Value must be between 1 and 5' });
      return;
    }

    const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
    if (!rating || rating.userId !== userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const updated = await prisma.rating.update({
      where: { id: ratingId },
      data: { value: +value },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
