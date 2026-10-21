import { cn } from "@/lib/utils";
import { getPriorityConfig, getStatusConfig } from "@/features/tickets/utils";
import type { TicketPriority, TicketStatusValue } from "@/types";

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = getPriorityConfig(priority);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", config.color, config.bg)}>
      {config.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: TicketStatusValue }) {
  const config = getStatusConfig(status);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", config.color, config.bg)}>
      {config.label}
    </span>
  );
}