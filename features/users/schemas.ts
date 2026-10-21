import { z } from 'zod';

export const userFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  role: z.enum(['admin', 'agent', 'customer']),
  is_active: z.boolean(),
  password: z.string().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;
