'use client';

import { useState, useMemo, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataCard from '@/components/shared/DataCard';
import SearchInput from '@/components/shared/SearchInput';
import Dropdown from '@/components/shared/Dropdown';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import { StatusBadge, PriorityBadge } from '@/features/tickets/components/TicketBadges';
import { formatDateTime } from '@/features/tickets/utils';
import { useSessionStore } from '@/stores/session-store';
import { useMockDbStore } from '@/stores/mock-db-store';
import { claimTicketApi } from '@/features/tickets/api';
import { toast } from '@/lib/toast/toastService';
import type { TableColumn } from '@/components/shared/DataTable';
import type { Ticket } from '@/types';
import { cn } from '@/lib/utils';
import { Inbox, UserCheck, ListFilter } from 'lucide-react';

const STATUS_ITEMS = [
  { label: 'All Statuses', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Waiting for Customer', value: 'waiting_for_customer' },
  { label: 'Resolved', value: 'resolved' },
];

const PRIORITY_ITEMS = [
  { label: 'All Priorities', value: '' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

type AgentTab = 'all' | 'unassigned' | 'mine';

export default function AgentTicketsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as AgentTab) || 'all';

  const user = useSessionStore((state) => state.user);
  const tickets = useMockDbStore((state) => state.tickets);

  const [activeTab, setActiveTab] = useState<AgentTab>(initialTab);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Agent visible tickets: unassigned + held by this agent
  const visibleTickets = useMemo(() => {
    if (!user) return [];
    return tickets.filter((t) => t.agent === null || t.agent.id === user.id);
  }, [tickets, user]);

  const tabFiltered = useMemo(() => {
    if (activeTab === 'unassigned') {
      return visibleTickets.filter((t) => t.agent === null);
    }
    if (activeTab === 'mine') {
      return visibleTickets.filter((t) => t.agent?.id === user?.id);
    }
    return visibleTickets;
  }, [visibleTickets, activeTab, user]);

  const filtered = useMemo(() => {
    return tabFiltered.filter((t) => {
      if (search) {
        const query = search.toLowerCase();
        const matchesSubj = t.subject.toLowerCase().includes(query);
        const matchesId = String(t.id).includes(query);
        const matchesCustomer = t.customer.name.toLowerCase().includes(query);
        if (!matchesSubj && !matchesId && !matchesCustomer) return false;
      }
      if (statusFilter && t.status.value !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tabFiltered, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const handleClaim = async (e: React.MouseEvent, ticketId: number) => {
    e.stopPropagation();
    if (!user) return;

    const res = await claimTicketApi(ticketId, { id: user.id, name: user.name });
    if (!res.success) {
      toast.error(res.message || 'Someone else already claimed this ticket.');
    } else {
      toast.success(`Ticket #${ticketId} claimed successfully!`);
    }
  };

  const columns: TableColumn<Ticket>[] = [
    {
      key: 'subject',
      label: 'Ticket',
      render: (_, row) => (
        <div>
          <span className="font-semibold text-foreground text-sm line-clamp-1">{row.subject}</span>
          <span className="text-xs text-foreground-muted">#{row.id} • Customer: {row.customer.name}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (_, row) => <PriorityBadge priority={row.priority} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => <StatusBadge status={row.status.value} />,
    },
    {
      key: 'agent',
      label: 'Assignee',
      render: (_, row) => (
        <span className="text-xs">
          {row.agent ? (
            <span className="font-medium text-foreground">
              {row.agent.id === user?.id ? (
                <span className="text-primary font-semibold">Assigned to You</span>
              ) : (
                row.agent.name
              )}
            </span>
          ) : (
            <span className="text-warning font-semibold">Unassigned</span>
          )}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      alignment: 'right',
      render: (_, row) => {
        if (row.agent === null && row.status.value !== 'resolved') {
          return (
            <Button
              variant="primary"
              size="free-sm"
              className="h-[34px] min-w-0 w-auto px-3.5 rounded-lg text-xs"
              onClick={(e) => handleClaim(e, row.id)}
            >
              Claim
            </Button>
          );
        }
        return (
          <span className="text-xs text-foreground-muted">
            {formatDateTime(row.updated_at)}
          </span>
        );
      },
    },
  ];

  const unassignedCount = visibleTickets.filter((t) => t.agent === null).length;
  const myTicketsCount = visibleTickets.filter((t) => t.agent?.id === user?.id).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Support Tickets Queue</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            View tickets awaiting assignment or actively managed in your workload.
          </p>
        </div>

        {/* Queue Tabs */}
        <div className="flex border-b border-border gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('all'); setPage(1); }}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-secondary hover:text-foreground'
            )}
          >
            <ListFilter className="size-4" />
            <span>All Visible Queue</span>
            <span className="rounded-full bg-background-secondary px-2 py-0.5 text-xs text-foreground-secondary">
              {visibleTickets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('unassigned'); setPage(1); }}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
              activeTab === 'unassigned'
                ? 'border-warning text-warning'
                : 'border-transparent text-foreground-secondary hover:text-foreground'
            )}
          >
            <Inbox className="size-4" />
            <span>Unassigned Queue</span>
            <span className="rounded-full bg-warning-light text-warning px-2 py-0.5 text-xs font-bold">
              {unassignedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('mine'); setPage(1); }}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
              activeTab === 'mine'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-secondary hover:text-foreground'
            )}
          >
            <UserCheck className="size-4" />
            <span>My Tickets</span>
            <span className="rounded-full bg-primary-light text-primary px-2 py-0.5 text-xs font-bold">
              {myTicketsCount}
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder="Search tickets by subject, #id, or customer..."
            className="flex-1 min-w-[220px]"
          />
          <div className="w-44">
            <Dropdown
              items={STATUS_ITEMS}
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
              placeholder="All Statuses"
            />
          </div>
          <div className="w-40">
            <Dropdown
              items={PRIORITY_ITEMS}
              value={priorityFilter}
              onChange={(val) => { setPriorityFilter(val); setPage(1); }}
              placeholder="All Priorities"
            />
          </div>
        </div>

        {/* DataCard rendering strictly adhering to ticket rules */}
        {filtered.length === 0 ? (
          <EmptyState
            illustration="no-tickets"
            title="No tickets found in this queue"
            description="All tickets matching this criteria have been resolved or filtered out."
          />
        ) : (
          <DataCard<Ticket>
            data={paginatedData}
            columns={columns}
            rowKey={(row) => row.id}
            onCardClick={(row) => router.push(`/agent/tickets/${row.id}`)}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showPagination={totalPages > 1}
            count={filtered.length}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
