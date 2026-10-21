'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Ticket, User, TicketPriority, TicketStatusValue, ActivityItem } from '@/types';
import { SEED_USERS } from '@/features/users/mock-data';
import { SEED_TICKETS } from '@/features/tickets/mock-data';
import { STATUS_CONFIG } from '@/features/tickets/constants';

interface MockDbState {
  users: User[];
  tickets: Ticket[];
  activities: ActivityItem[];

  // Database Management
  resetDemoData: () => void;

  // Tickets Actions
  createTicket: (data: { subject: string; description: string; priority: TicketPriority; customer: { id: number; name: string } }) => Ticket;
  claimTicket: (ticketId: number, agent: { id: number; name: string }) => { success: boolean; message?: string };
  assignTicket: (ticketId: number, targetAgent: { id: number; name: string }, admin: { id: number; name: string }) => { success: boolean; message?: string };
  replyTicket: (ticketId: number, author: { id: number; name: string; role: 'admin' | 'agent' | 'customer' }, body: string) => { success: boolean; message?: string };
  changeStatus: (ticketId: number, newStatus: TicketStatusValue, changedBy: { id: number; name: string }) => { success: boolean; message?: string };

  // Users Actions
  createUser: (data: Omit<User, 'id' | 'created_at'>) => User;
  updateUser: (userId: number, data: Partial<Omit<User, 'id' | 'created_at'>>, currentAdminId: number) => { success: boolean; message?: string };
}

function generateInitialActivities(): ActivityItem[] {
  return [
    {
      id: 'act-1',
      type: 'created',
      summary: 'Emily Davis created a new ticket',
      preview: 'Webhook delivery failing with 504 timeout',
      actor: { id: 12, name: 'Emily Davis' },
      ticket: { id: 3, subject: 'Webhook delivery failing with 504 timeout' },
      occurred_at: '2026-10-21T06:30:00Z',
    },
    {
      id: 'act-2',
      type: 'reply',
      summary: 'Alex Rivera replied to ticket #1',
      preview: 'Our authentication team has rolled out a hotfix to staging...',
      actor: { id: 2, name: 'Alex Rivera (Agent)' },
      ticket: { id: 1, subject: 'Cannot log into customer portal on Safari' },
      occurred_at: '2026-10-20T14:30:00Z',
    },
    {
      id: 'act-3',
      type: 'status_change',
      summary: 'Bob Smith changed status to Waiting for Customer',
      actor: { id: 3, name: 'Bob Smith (Agent)' },
      ticket: { id: 2, subject: 'Billing discrepancy on invoice #INV-4921' },
      occurred_at: '2026-10-20T16:00:00Z',
    },
    {
      id: 'act-4',
      type: 'assigned',
      summary: 'Sarah Jenkins assigned ticket #10 to Bob Smith',
      actor: { id: 1, name: 'Sarah Jenkins (Admin)' },
      ticket: { id: 10, subject: 'Email notification template localization in Spanish' },
      occurred_at: '2026-10-17T09:00:00Z',
    },
  ];
}

export const useMockDbStore = create<MockDbState>()(
  persist(
    (set, get) => ({
      users: SEED_USERS,
      tickets: SEED_TICKETS,
      activities: generateInitialActivities(),

      resetDemoData: () => {
        set({
          users: SEED_USERS,
          tickets: SEED_TICKETS,
          activities: generateInitialActivities(),
        });
      },

      createTicket: ({ subject, description, priority, customer }) => {
        const now = new Date().toISOString();
        const tickets = get().tickets;
        const newId = tickets.length > 0 ? Math.max(...tickets.map((t) => t.id)) + 1 : 1;

        const newTicket: Ticket = {
          id: newId,
          subject,
          description,
          priority,
          status: { value: 'open', label: 'Open' },
          customer,
          agent: null,
          created_at: now,
          updated_at: now,
          last_activity_at: now,
          replies: [],
          status_history: [
            {
              id: Date.now(),
              from: null,
              to: { value: 'open', label: 'Open' },
              changed_by: customer,
              created_at: now,
            },
          ],
          assignments: [],
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          type: 'created',
          summary: `${customer.name} created ticket #${newId}`,
          preview: subject,
          actor: customer,
          ticket: { id: newId, subject },
          occurred_at: now,
        };

        set({
          tickets: [newTicket, ...tickets],
          activities: [newActivity, ...get().activities.slice(0, 20)],
        });

        return newTicket;
      },

      claimTicket: (ticketId, agent) => {
        const ticket = get().tickets.find((t) => t.id === ticketId);
        if (!ticket) return { success: false, message: 'Ticket not found' };

        // Conflict check: simulated "someone else already claimed it"
        if (ticket.agent !== null) {
          return {
            success: false,
            message: `Someone else already claimed this ticket (${ticket.agent.name}).`,
          };
        }

        if (ticket.status.value === 'resolved') {
          return { success: false, message: 'Resolved tickets cannot be claimed.' };
        }

        const now = new Date().toISOString();
        const updatedTicket: Ticket = {
          ...ticket,
          agent,
          status: { value: 'in_progress', label: 'In Progress' },
          updated_at: now,
          last_activity_at: now,
          status_history: [
            ...(ticket.status_history || []),
            {
              id: Date.now(),
              from: ticket.status,
              to: { value: 'in_progress', label: 'In Progress' },
              changed_by: agent,
              created_at: now,
            },
          ],
          assignments: [
            ...(ticket.assignments || []),
            {
              agent,
              assigned_by: agent.id,
              assigned_at: now,
              unassigned_at: null,
            },
          ],
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          type: 'assigned',
          summary: `${agent.name} claimed ticket #${ticketId}`,
          preview: ticket.subject,
          actor: agent,
          ticket: { id: ticketId, subject: ticket.subject },
          occurred_at: now,
        };

        set({
          tickets: get().tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
          activities: [newActivity, ...get().activities.slice(0, 20)],
        });

        return { success: true };
      },

      assignTicket: (ticketId, targetAgent, admin) => {
        const ticket = get().tickets.find((t) => t.id === ticketId);
        if (!ticket) return { success: false, message: 'Ticket not found' };

        if (ticket.status.value === 'resolved') {
          return { success: false, message: 'Resolved tickets cannot be assigned.' };
        }

        const now = new Date().toISOString();

        // Close out previous assignment if any
        const updatedAssignments = (ticket.assignments || []).map((a) =>
          a.unassigned_at === null ? { ...a, unassigned_at: now } : a
        );

        updatedAssignments.push({
          agent: targetAgent,
          assigned_by: admin.id,
          assigned_at: now,
          unassigned_at: null,
        });

        const newStatus = ticket.status.value === 'open'
          ? { value: 'in_progress' as TicketStatusValue, label: 'In Progress' }
          : ticket.status;

        const updatedStatusHistory = [...(ticket.status_history || [])];
        if (ticket.status.value === 'open') {
          updatedStatusHistory.push({
            id: Date.now(),
            from: ticket.status,
            to: newStatus,
            changed_by: admin,
            created_at: now,
          });
        }

        const updatedTicket: Ticket = {
          ...ticket,
          agent: targetAgent,
          status: newStatus,
          updated_at: now,
          last_activity_at: now,
          assignments: updatedAssignments,
          status_history: updatedStatusHistory,
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          type: 'assigned',
          summary: `${admin.name} assigned ticket #${ticketId} to ${targetAgent.name}`,
          preview: ticket.subject,
          actor: admin,
          ticket: { id: ticketId, subject: ticket.subject },
          occurred_at: now,
        };

        set({
          tickets: get().tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
          activities: [newActivity, ...get().activities.slice(0, 20)],
        });

        return { success: true };
      },

      replyTicket: (ticketId, author, body) => {
        const ticket = get().tickets.find((t) => t.id === ticketId);
        if (!ticket) return { success: false, message: 'Ticket not found' };

        if (ticket.status.value === 'resolved') {
          return { success: false, message: 'Cannot reply to a resolved ticket.' };
        }

        const now = new Date().toISOString();
        const newReply = {
          id: Date.now(),
          body,
          author,
          created_at: now,
        };

        // Status flow: If status is 'waiting_for_customer' and customer replies, automatically transition to 'in_progress'
        let nextStatus = ticket.status;
        const nextStatusHistory = [...(ticket.status_history || [])];

        if (ticket.status.value === 'waiting_for_customer' && author.role === 'customer') {
          nextStatus = { value: 'in_progress', label: 'In Progress' };
          nextStatusHistory.push({
            id: Date.now() + 1,
            from: ticket.status,
            to: nextStatus,
            changed_by: author,
            created_at: now,
          });
        }

        const updatedTicket: Ticket = {
          ...ticket,
          status: nextStatus,
          updated_at: now,
          last_activity_at: now,
          replies: [...(ticket.replies || []), newReply],
          status_history: nextStatusHistory,
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          type: 'reply',
          summary: `${author.name} replied to ticket #${ticketId}`,
          preview: body.length > 80 ? `${body.substring(0, 80)}...` : body,
          actor: author,
          ticket: { id: ticketId, subject: ticket.subject },
          occurred_at: now,
        };

        set({
          tickets: get().tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
          activities: [newActivity, ...get().activities.slice(0, 20)],
        });

        return { success: true };
      },

      changeStatus: (ticketId, newStatusValue, changedBy) => {
        const ticket = get().tickets.find((t) => t.id === ticketId);
        if (!ticket) return { success: false, message: 'Ticket not found' };

        if (ticket.status.value === 'resolved') {
          return { success: false, message: 'Resolved tickets cannot change status.' };
        }

        const now = new Date().toISOString();
        const targetConfig = STATUS_CONFIG[newStatusValue];
        const newStatus = { value: newStatusValue, label: targetConfig.label };

        const updatedTicket: Ticket = {
          ...ticket,
          status: newStatus,
          updated_at: now,
          last_activity_at: now,
          status_history: [
            ...(ticket.status_history || []),
            {
              id: Date.now(),
              from: ticket.status,
              to: newStatus,
              changed_by: changedBy,
              created_at: now,
            },
          ],
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          type: 'status_change',
          summary: `${changedBy.name} changed status of #${ticketId} to ${newStatus.label}`,
          preview: ticket.subject,
          actor: changedBy,
          ticket: { id: ticketId, subject: ticket.subject },
          occurred_at: now,
        };

        set({
          tickets: get().tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
          activities: [newActivity, ...get().activities.slice(0, 20)],
        });

        return { success: true };
      },

      createUser: (userData) => {
        const users = get().users;
        const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
        const newUser: User = {
          ...userData,
          id: newId,
          created_at: new Date().toISOString(),
        };

        set({ users: [...users, newUser] });
        return newUser;
      },

      updateUser: (userId, updates, currentAdminId) => {
        const user = get().users.find((u) => u.id === userId);
        if (!user) return { success: false, message: 'User not found' };

        // Protection: admin cannot deactivate or change role of their own account
        if (userId === currentAdminId) {
          if (updates.is_active === false) {
            return { success: false, message: 'You cannot deactivate your own account.' };
          }
          if (updates.role && updates.role !== 'admin') {
            return { success: false, message: 'You cannot remove your own admin privileges.' };
          }
        }

        const updatedUser: User = { ...user, ...updates };

        set({
          users: get().users.map((u) => (u.id === userId ? updatedUser : u)),
        });

        return { success: true };
      },
    }),
    {
      name: 'helpdesk_mock_db_storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
);
