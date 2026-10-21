import { useMockDbStore } from '@/stores/mock-db-store';
import type { Ticket, TicketPriority, TicketStatusValue } from '@/types';
import type { CreateTicketFormData } from './schemas';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTicketsApi(): Promise<Ticket[]> {
  await delay();
  return useMockDbStore.getState().tickets;
}

export async function getTicketByIdApi(id: number): Promise<Ticket | null> {
  await delay();
  return useMockDbStore.getState().tickets.find((t) => t.id === id) || null;
}

export async function createTicketApi(
  data: CreateTicketFormData,
  customer: { id: number; name: string }
): Promise<Ticket> {
  await delay();
  return useMockDbStore.getState().createTicket({
    subject: data.subject,
    description: data.description,
    priority: data.priority,
    customer,
  });
}

export async function claimTicketApi(
  ticketId: number,
  agent: { id: number; name: string }
): Promise<{ success: boolean; message?: string }> {
  await delay();
  return useMockDbStore.getState().claimTicket(ticketId, agent);
}

export async function assignTicketApi(
  ticketId: number,
  targetAgent: { id: number; name: string },
  admin: { id: number; name: string }
): Promise<{ success: boolean; message?: string }> {
  await delay();
  return useMockDbStore.getState().assignTicket(ticketId, targetAgent, admin);
}

export async function replyTicketApi(
  ticketId: number,
  author: { id: number; name: string; role: 'admin' | 'agent' | 'customer' },
  body: string
): Promise<{ success: boolean; message?: string }> {
  await delay();
  return useMockDbStore.getState().replyTicket(ticketId, author, body);
}

export async function changeStatusApi(
  ticketId: number,
  newStatus: TicketStatusValue,
  changedBy: { id: number; name: string }
): Promise<{ success: boolean; message?: string }> {
  await delay();
  return useMockDbStore.getState().changeStatus(ticketId, newStatus, changedBy);
}
