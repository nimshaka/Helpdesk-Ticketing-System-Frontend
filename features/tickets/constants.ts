import type { TicketPriority, TicketStatusValue } from "@/types";

export const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; bg: string }> = {
  low: { label: "Low", color: "text-success", bg: "bg-success-light" },
  medium: { label: "Medium", color: "text-warning", bg: "bg-warning-light" },
  high: { label: "High", color: "text-error", bg: "bg-error-light" },
};

export const STATUS_CONFIG: Record<TicketStatusValue, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "text-info", bg: "bg-info-light" },
  in_progress: { label: "In Progress", color: "text-warning", bg: "bg-warning-light" },
  resolved: { label: "Resolved", color: "text-success", bg: "bg-success-light" },
  waiting_for_customer: { label: "Waiting for Customer", color: "text-purple", bg: "bg-purple-light" },
};

export const TICKET_STATUSES: TicketStatusValue[] = ["open", "in_progress", "resolved", "waiting_for_customer"];
export const TICKET_PRIORITIES: TicketPriority[] = ["low", "medium", "high"];