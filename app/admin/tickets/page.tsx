'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataCard from '@/components/shared/DataCard';
import SearchInput from '@/components/shared/SearchInput';
import Dropdown from '@/components/shared/Dropdown';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import AssignDialog from '@/features/tickets/components/AssignDialog';
import { StatusBadge, PriorityBadge } from '@/features/tickets/components/TicketBadges';
import { formatDateTime } from '@/features/tickets/utils';
import { useSessionStore } from '@/stores/session-store';
import { useMockDbStore } from '@/stores/mock-db-store';
import { assignTicketApi } from '@/features/tickets/api';
import { toast } from '@/lib/toast/toastService';
import type { TableColumn } from '@/components/shared/DataTable';
import type { Ticket, User } from '@/types';
import { UserPlus } from 'lucide-react';

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

export default function AdminTicketsPage() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const tickets = useMockDbStore((state) => state.tickets);
  const users = useMockDbStore((state) => state.users);

  const activeAgents = useMemo(
    () => users.filter((u) => u.role === 'agent' && u.is_active),
    [users]
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [assignTicketTarget, setAssignTicketTarget] = useState<Ticket | null>(null);

  const agentDropdownItems = useMemo(() => [
    { label: 'All Assignments', value: '' },
    { label: 'Unassigned Only', value: 'unassigned' },
    ...activeAgents.map((a) => ({ label: a.name, value: String(a.id) })),
  ], [activeAgents]);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (search) {
        const query = search.toLowerCase();
        const matchesSubj = t.subject.toLowerCase().includes(query);
        const matchesId = String(t.id).includes(query);
        const matchesCustomer = t.customer.name.toLowerCase().includes(query);
        if (!matchesSubj && !matchesId && !matchesCustomer) return false;
      }
      if (statusFilter && t.status.value !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (agentFilter === 'unassigned' && t.agent !== null) return false;
      if (agentFilter && agentFilter !== 'unassigned' && String(t.agent?.id) !== agentFilter) return false;
      return true;
    });
  }, [tickets, search, statusFilter, priorityFilter, agentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const handleOpenAssign = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation();
    setAssignTicketTarget(ticket);
  };

  const handleConfirmAssign = async (agent: { id: number; name: string }) => {
    if (!assignTicketTarget || !user) return;
    await assignTicketApi(assignTicketTarget.id, agent, { id: user.id, name: user.name });
    toast.success(`Ticket #${assignTicketTarget.id} assigned to ${agent.name}`);
    setAssignTicketTarget(null);
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
      label: 'Assigned Agent',
      render: (_, row) => (
        <span className="text-xs">
          {row.agent ? (
            <span className="font-medium text-foreground">{row.agent.name}</span>
          ) : (
            <span className="text-warning font-semibold">Unassigned</span>
          )}
        </span>
      ),
    },
    {
      key: 'assign_action',
      label: 'Assignment Action',
      alignment: 'right',
      render: (_, row) => {
        const isResolved = row.status.value === 'resolved';
        return (
          <Button
            variant="secondary"
            size="free-sm"
            className="h-[34px] min-w-0 w-auto px-3 rounded-lg text-xs"
            disabled={isResolved}
            onClick={(e) => handleOpenAssign(e, row)}
            title={isResolved ? 'Resolved tickets cannot be assigned' : 'Assign to active agent'}
          >
            <UserPlus className="size-3.5" />
            {row.agent ? 'Reassign' : 'Assign'}
          </Button>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Tickets Directory</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Manage, triage, and route all helpdesk tickets to active support staff.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder="Search tickets by subject, #id, or customer..."
            className="flex-1 min-w-[220px]"
          />
          <div className="w-40">
            <Dropdown
              items={STATUS_ITEMS}
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
              placeholder="All Statuses"
            />
          </div>
          <div className="w-36">
            <Dropdown
              items={PRIORITY_ITEMS}
              value={priorityFilter}
              onChange={(val) => { setPriorityFilter(val); setPage(1); }}
              placeholder="All Priorities"
            />
          </div>
          <div className="w-44">
            <Dropdown
              items={agentDropdownItems}
              value={agentFilter}
              onChange={(val) => { setAgentFilter(val); setPage(1); }}
              placeholder="All Assignments"
            />
          </div>
        </div>

        {/* DataCard rendering strictly adhering to tickets rule */}
        {filtered.length === 0 ? (
          <EmptyState
            illustration="no-results"
            title="No matching tickets"
            description="No tickets match your active filter criteria."
          />
        ) : (
          <DataCard<Ticket>
            data={paginatedData}
            columns={columns}
            rowKey={(row) => row.id}
            onCardClick={(row) => router.push(`/admin/tickets/${row.id}`)}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showPagination={totalPages > 1}
            count={filtered.length}
          />
        )}
      </div>

      {assignTicketTarget && (
        <AssignDialog
          isOpen={Boolean(assignTicketTarget)}
          onClose={() => setAssignTicketTarget(null)}
          ticket={assignTicketTarget}
          activeAgents={activeAgents}
          onAssign={handleConfirmAssign}
        />
      )}
    </DashboardLayout>
  );
}
