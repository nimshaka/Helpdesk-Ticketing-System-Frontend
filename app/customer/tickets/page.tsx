'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import type { TableColumn } from '@/components/shared/DataTable';
import type { Ticket, TicketStatusValue, TicketPriority } from '@/types';
import { Plus } from 'lucide-react';

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

export default function CustomerTicketsPage() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const tickets = useMockDbStore((state) => state.tickets);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const ownTickets = useMemo(() => {
    if (!user) return [];
    return tickets.filter((t) => t.customer.id === user.id);
  }, [tickets, user]);

  const filtered = useMemo(() => {
    return ownTickets.filter((t) => {
      if (search) {
        const query = search.toLowerCase();
        const matchesSubj = t.subject.toLowerCase().includes(query);
        const matchesId = String(t.id).includes(query);
        if (!matchesSubj && !matchesId) return false;
      }
      if (statusFilter && t.status.value !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [ownTickets, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const columns: TableColumn<Ticket>[] = [
    {
      key: 'subject',
      label: 'Subject',
      render: (_, row) => (
        <div>
          <span className="font-semibold text-foreground text-sm line-clamp-1">{row.subject}</span>
          <span className="text-xs text-foreground-muted">Ticket #{row.id}</span>
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
      label: 'Assigned Agent',
      render: (_, row) => (
        <span className="text-xs text-foreground-secondary">
          {row.agent ? row.agent.name : <em className="text-foreground-muted">Pending Assignment</em>}
        </span>
      ),
    },
    {
      key: 'last_activity_at',
      label: 'Last Activity',
      render: (_, row) => (
        <span className="text-xs text-foreground-muted">
          {row.last_activity_at ? formatDateTime(row.last_activity_at) : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">My Support Tickets</h1>
            <p className="mt-1 text-sm text-foreground-secondary">
              Review and manage all tickets submitted under your customer account.
            </p>
          </div>
          <Link href="/customer/tickets/new">
            <Button variant="primary" size="free-sm" className="h-[44px] min-w-0 w-auto px-5 rounded-xl">
              <Plus className="size-4" />
              New Ticket
            </Button>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder="Search tickets by subject or #id..."
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

        {/* Tickets always rendered via DataCard */}
        {filtered.length === 0 ? (
          <EmptyState
            illustration={ownTickets.length === 0 ? 'no-tickets' : 'no-results'}
            title={ownTickets.length === 0 ? 'No tickets created yet' : 'No matching tickets'}
            description={
              ownTickets.length === 0
                ? 'Submit your first ticket to get support from our technical team.'
                : 'Try adjusting your search criteria or clearing filters.'
            }
            action={
              ownTickets.length === 0
                ? { label: 'Create First Ticket', onClick: () => router.push('/customer/tickets/new') }
                : undefined
            }
          />
        ) : (
          <DataCard<Ticket>
            data={paginatedData}
            columns={columns}
            rowKey={(row) => row.id}
            onCardClick={(row) => router.push(`/customer/tickets/${row.id}`)}
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
