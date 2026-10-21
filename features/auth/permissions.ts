import type { Ticket, User } from '@/types';

/**
 * CUSTOMER: can reply on their own ticket until resolved.
 * AGENT: can reply ONLY on tickets they hold until resolved.
 * ADMIN: can reply on ANY non-resolved ticket.
 */
export function canReply(user: User | null | undefined, ticket: Ticket): boolean {
  if (!user || !user.is_active) return false;
  if (ticket.status.value === 'resolved') return false;

  if (user.role === 'customer') {
    return ticket.customer.id === user.id;
  }
  if (user.role === 'agent') {
    return ticket.agent?.id === user.id;
  }
  if (user.role === 'admin') {
    return true;
  }
  return false;
}

/**
 * AGENT: can claim an unassigned ticket (status != resolved).
 */
export function canClaim(user: User | null | undefined, ticket: Ticket): boolean {
  if (!user || !user.is_active) return false;
  if (ticket.status.value === 'resolved') return false;
  return user.role === 'agent' && ticket.agent === null;
}

/**
 * ADMIN: can assign or reassign any non-resolved ticket to an active agent.
 */
export function canAssign(user: User | null | undefined, ticket: Ticket): boolean {
  if (!user || !user.is_active) return false;
  if (ticket.status.value === 'resolved') return false;
  return user.role === 'admin';
}

/**
 * AGENT: can set status to 'waiting_for_customer' or 'resolved' ONLY on tickets they hold.
 * ADMIN: can set status to any non-closed target or resolved on any ticket.
 * CUSTOMER: cannot manually change status.
 */
export function canChangeStatus(user: User | null | undefined, ticket: Ticket): boolean {
  if (!user || !user.is_active) return false;
  if (ticket.status.value === 'resolved') return false;

  if (user.role === 'agent') {
    return ticket.agent?.id === user.id;
  }
  if (user.role === 'admin') {
    return true;
  }
  return false;
}

/**
 * ADMIN: manages users.
 */
export function canManageUsers(user: User | null | undefined): boolean {
  return Boolean(user && user.is_active && user.role === 'admin');
}

/**
 * ADMIN: can view assignment history.
 */
export function canViewAssignmentHistory(user: User | null | undefined): boolean {
  return Boolean(user && user.is_active && user.role === 'admin');
}

/**
 * CUSTOMER: creates tickets.
 */
export function canCreateTicket(user: User | null | undefined): boolean {
  return Boolean(user && user.is_active && user.role === 'customer');
}

/**
 * Checks if a ticket should be visible in the user's list/detail.
 */
export function canViewTicket(user: User | null | undefined, ticket: Ticket): boolean {
  if (!user || !user.is_active) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'customer') return ticket.customer.id === user.id;
  if (user.role === 'agent') {
    // Unassigned queue OR currently held
    return ticket.agent === null || ticket.agent.id === user.id;
  }
  return false;
}
