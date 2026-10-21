import type { UserRole } from '@/types';

export const USER_ROLES: UserRole[] = ['admin', 'agent', 'customer'];

export const ROLE_CONFIG: Record<UserRole, {
  label: string;
  colorClass: string;
  bgClass: string;
  color: string;
  bg: string;
}> = {
  admin: {
    label: 'Admin',
    colorClass: 'text-primary font-semibold',
    bgClass: 'bg-primary-light border-primary/20',
    color: 'text-primary font-semibold',
    bg: 'bg-primary-light border-primary/20',
  },
  agent: {
    label: 'Agent',
    colorClass: 'text-info font-medium',
    bgClass: 'bg-info-light border-info/20',
    color: 'text-info font-medium',
    bg: 'bg-info-light border-info/20',
  },
  customer: {
    label: 'Customer',
    colorClass: 'text-foreground-secondary',
    bgClass: 'bg-background-secondary border-border',
    color: 'text-foreground-secondary',
    bg: 'bg-background-secondary border-border',
  },
};
