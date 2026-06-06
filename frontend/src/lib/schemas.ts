import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)');

const nameSchema = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters');

const addressSchema = z
  .string()
  .min(1, 'Address is required')
  .max(400, 'Address must be at most 400 characters');

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
  address: addressSchema,
});

export const changePasswordSchema = z.object({
  newPassword: passwordSchema,
});

export const addUserSchema = z.object({
  name: nameSchema,
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(['NORMAL_USER', 'STORE_OWNER', 'ADMIN']),
});

export const addStoreSchema = z.object({
  name: nameSchema,
  email: z.string().email('Invalid email format'),
  address: addressSchema,
  ownerId: z.string().min(1, 'Please select an owner'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AddUserInput = z.infer<typeof addUserSchema>;
export type AddStoreInput = z.infer<typeof addStoreSchema>;
