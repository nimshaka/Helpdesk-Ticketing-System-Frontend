import { cn } from '@/lib/utils';
import type { TicketPriority, TicketStatusValue } from '@/types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/features/tickets/constants';

export function StatusBadge({ status, className }: { status: TicketStatusValue; className?: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors',
        cfg.colorClass,
        cfg.bgClass,
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full', cfg.colorClass.replace('text-', 'bg-'))} />
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: TicketPriority; className?: string }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize',
        cfg.colorClass,
        cfg.bgClass,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
