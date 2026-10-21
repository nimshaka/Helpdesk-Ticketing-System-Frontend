"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumn } from "@/components/shared/DataTable";
import DataCard from "@/components/shared/DataCard";
import EmptyState from "@/components/shared/EmptyState";
import type { Ticket, TicketPriority, TicketStatusValue } from "@/types";
import { PriorityBadge, StatusBadge } from "@/components/tickets/TicketBadges";
import { formatRelative } from "@/features/tickets/utils";
import { Hash, UserCircle } from "lucide-react";
import TicketFilters from "@/components/tickets/TicketFilters";
import Pagination from "@/components/shared/Pagination";

interface TicketListProps {
  tickets: Ticket[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFilters?: boolean;
}

const columns: TableColumn<Ticket>[] = [
  {
    key: "subject",
    label: "Subject",
    render: (_, row) => (
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <Hash className="size-3 text-foreground-muted" />
          <span className="text-xs text-foreground-muted">{row.id}</span>
        </div>
        <p className="text-sm font-semibold text-foreground line-clamp-2">{row.subject}</p>
      </div>
    ),
  },
  {
    key: "priority",
    label: "Priority",
    render: (_, row) => <PriorityBadge priority={row.priority} />,
  },
  {
    key: "status",
    label: "Status",
    render: (_, row) => <StatusBadge status={row.status.value} />,
  },
  {
    key: "customer",
    label: "Customer",
    render: (_, row) => (
      <div className="flex items-center gap-1.5">
        <UserCircle className="size-3.5 text-foreground-muted" />
        <span>{row.customer.name}</span>
      </div>
    ),
  },
  {
    key: "agent",
    label: "Agent",
    render: (_, row) => row.agent ? row.agent.name : <span className="text-foreground-muted">Unassigned</span>,
  },
  {
    key: "last_activity_at",
    label: "Last Activity",
    render: (_, row) => (
      <span className="text-xs text-foreground-muted">
        {row.last_activity_at ? formatRelative(row.last_activity_at) : "—"}
      </span>
    ),
  },
];

export default function TicketList({ tickets, total, currentPage, totalPages, onPageChange, showFilters = true }: TicketListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TicketStatusValue | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [assignment, setAssignment] = useState<"unassigned" | "mine" | "">("");

  const isFiltered = Boolean(search || status || priority || assignment);

  const filtered = tickets.filter((t) => {
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (status && t.status.value !== status) return false;
    if (priority && t.priority !== priority) return false;
    if (assignment === "unassigned" && t.agent !== null) return false;
    if (assignment === "mine" && t.agent?.id !== 1) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {showFilters && (
        <TicketFilters
          search={search} onSearchChange={setSearch}
          status={status} onStatusChange={setStatus}
          priority={priority} onPriorityChange={setPriority}
          assignment={assignment} onAssignmentChange={setAssignment}
        />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          illustration={isFiltered ? "no-results" : "no-tickets"}
          title={isFiltered ? "No tickets match your filters" : "No tickets yet"}
          description={isFiltered ? "Try adjusting your search or filters." : "Tickets will appear here once created."}
        />
      ) : (
        <DataCard<Ticket>
          data={filtered}
          columns={columns}
          rowKey={(row) => row.id}
          onCardClick={(row) => router.push(`/tickets/${row.id}`)}
          count={filtered.length}
          isFiltered={isFiltered}
          showPagination={totalPages > 1}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}