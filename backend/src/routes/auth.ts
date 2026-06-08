import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already in use
 */
// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
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
      data: { name, email, password: hashed, address, role: 'NORMAL_USER' },
    });

    const { password: _, ...result } = user;
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const { password: _, ...result } = user;
    res.json({ token, user: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.patch('/password', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { newPassword } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      res.status(400).json({ message: 'Password must be 8-16 chars with uppercase and special character' });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashed },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;