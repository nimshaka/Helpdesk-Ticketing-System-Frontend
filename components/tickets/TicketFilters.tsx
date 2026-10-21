"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchInput from "@/components/shared/SearchInput";
import Dropdown from "@/components/shared/Dropdown";
import type { DropdownItem } from "@/components/shared/Dropdown";
import type { TicketPriority, TicketStatusValue } from "@/types";
import { TICKET_STATUSES, TICKET_PRIORITIES } from "@/features/tickets/constants";
import { getStatusConfig, getPriorityConfig } from "@/features/tickets/utils";

const STATUS_ITEMS: DropdownItem[] = [
  { label: "All Statuses", value: "" },
  ...TICKET_STATUSES.map((s) => ({ label: getStatusConfig(s).label, value: s })),
];

const PRIORITY_ITEMS: DropdownItem[] = [
  { label: "All Priorities", value: "" },
  ...TICKET_PRIORITIES.map((p) => ({ label: getPriorityConfig(p).label, value: p })),
];

const ASSIGNMENT_ITEMS: DropdownItem[] = [
  { label: "All Tickets", value: "" },
  { label: "Unassigned", value: "unassigned" },
  { label: "Assigned to Me", value: "mine" },
];

interface TicketFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: TicketStatusValue | "";
  onStatusChange: (v: TicketStatusValue | "") => void;
  priority: TicketPriority | "";
  onPriorityChange: (v: TicketPriority | "") => void;
  assignment: "unassigned" | "mine" | "";
  onAssignmentChange: (v: "unassigned" | "mine" | "") => void;
}

export default function TicketFilters({
  search, onSearchChange,
  status, onStatusChange,
  priority, onPriorityChange,
  assignment, onAssignmentChange,
}: TicketFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const activeCount = [status, priority, assignment].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search tickets..."
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-lg border px-4 h-[44px] text-sm font-medium transition-all",
            showFilters || activeCount > 0
              ? "border-primary bg-primary-light text-primary"
              : "border-border bg-card-bg text-foreground-secondary hover:border-border-hover hover:text-foreground"
          )}
        >
          <Filter className="size-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="rounded-xl border border-border bg-card-bg p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground-secondary">Status</label>
              <Dropdown
                items={STATUS_ITEMS}
                value={status}
                onChange={(v) => onStatusChange(v as TicketStatusValue | "")}
                placeholder="All Statuses"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground-secondary">Priority</label>
              <Dropdown
                items={PRIORITY_ITEMS}
                value={priority}
                onChange={(v) => onPriorityChange(v as TicketPriority | "")}
                placeholder="All Priorities"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground-secondary">Assignment</label>
              <Dropdown
                items={ASSIGNMENT_ITEMS}
                value={assignment}
                onChange={(v) => onAssignmentChange(v as "unassigned" | "mine" | "")}
                placeholder="All Tickets"
              />
            </div>
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => { onStatusChange(""); onPriorityChange(""); onAssignmentChange(""); }}
              className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}