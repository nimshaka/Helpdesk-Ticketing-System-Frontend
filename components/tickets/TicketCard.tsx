import { cn } from "@/lib/utils";
import type { Ticket } from "@/types";
import { PriorityBadge, StatusBadge } from "@/components/tickets/TicketBadges";
import { formatRelative } from "@/features/tickets/utils";
import { UserCircle, Clock, Hash } from "lucide-react";

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-border bg-card-bg p-4 transition-all duration-200",
        onClick && "cursor-pointer hover:border-primary/40 hover:shadow-sm card-hover"
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-border pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="size-3.5 shrink-0 text-foreground-muted" />
            <span className="text-xs text-foreground-muted">{ticket.id}</span>
          </div>
          <p className="text-sm font-semibold text-foreground line-clamp-2">{ticket.subject}</p>
        </div>
        <PriorityBadge priority={ticket.priority} />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-2">
          <span className="text-xs font-medium text-foreground-secondary shrink-0">Status</span>
          <StatusBadge status={ticket.status.value} />
        </div>

        <div className="flex items-start justify-between gap-4 border-b border-border pb-2">
          <span className="text-xs font-medium text-foreground-secondary shrink-0">Customer</span>
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <UserCircle className="size-3.5 text-foreground-muted" />
            <span>{ticket.customer.name}</span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 border-b border-border pb-2">
          <span className="text-xs font-medium text-foreground-secondary shrink-0">Agent</span>
          <span className="text-sm text-foreground text-right">
            {ticket.agent ? ticket.agent.name : <span className="text-foreground-muted">Unassigned</span>}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <span className="text-xs font-medium text-foreground-secondary shrink-0">Last Activity</span>
          <div className="flex items-center gap-1 text-xs text-foreground-muted">
            <Clock className="size-3" />
            <span>{ticket.last_activity_at ? formatRelative(ticket.last_activity_at) : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}