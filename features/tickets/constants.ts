import type { TicketPriority, TicketStatusValue } from '@/types';

export const TICKET_PRIORITIES: TicketPriority[] = ['low', 'medium', 'high'];
export const TICKET_STATUSES: TicketStatusValue[] = ['open', 'in_progress', 'waiting_for_customer', 'resolved'];

export const STATUS_CONFIG: Record<TicketStatusValue, {
  label: string;
  badgeVariant: 'info' | 'warning' | 'purple' | 'success';
  colorClass: string;
  bgClass: string;
  color: string;
  bg: string;
}> = {
  open: {
    label: 'Open',
    badgeVariant: 'info',
    colorClass: 'text-info',
    bgClass: 'bg-info-light border-info/30',
    color: 'text-info',
    bg: 'bg-info-light border-info/30',
  },
  in_progress: {
    label: 'In Progress',
    badgeVariant: 'warning',
    colorClass: 'text-warning',
    bgClass: 'bg-warning-light border-warning/30',
    color: 'text-warning',
    bg: 'bg-warning-light border-warning/30',
  },
  waiting_for_customer: {
    label: 'Waiting for Customer',
    badgeVariant: 'purple',
    colorClass: 'text-[#8E24AA]',
    bgClass: 'bg-[#F3E5F5] border-[#8E24AA]/30',
    color: 'text-[#8E24AA]',
    bg: 'bg-[#F3E5F5] border-[#8E24AA]/30',
  },
  resolved: {
    label: 'Resolved',
    badgeVariant: 'success',
    colorClass: 'text-success',
    bgClass: 'bg-success-light border-success/30',
    color: 'text-success',
    bg: 'bg-success-light border-success/30',
  },
};

export const PRIORITY_CONFIG: Record<TicketPriority, {
  label: string;
  colorClass: string;
  bgClass: string;
  color: string;
  bg: string;
}> = {
  low: {
    label: 'Low',
    colorClass: 'text-foreground-secondary',
    bgClass: 'bg-background-secondary border-border',
    color: 'text-foreground-secondary',
    bg: 'bg-background-secondary border-border',
  },
  medium: {
    label: 'Medium',
    colorClass: 'text-primary',
    bgClass: 'bg-primary-light border-primary/30',
    color: 'text-primary',
    bg: 'bg-primary-light border-primary/30',
  },
  high: {
    label: 'High',
    colorClass: 'text-error',
    bgClass: 'bg-error-light border-error/30',
    color: 'text-error',
    bg: 'bg-error-light border-error/30',
  },
};
