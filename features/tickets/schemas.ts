import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(150, 'Subject is too long'),
  description: z.string().trim().min(10, 'Please provide more details (at least 10 characters)'),
  priority: z.enum(['low', 'medium', 'high']),
});

export const replyTicketSchema = z.object({
  body: z.string().trim().min(1, 'Reply message cannot be empty'),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
export type ReplyTicketFormData = z.infer<typeof replyTicketSchema>;
