'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import DataCard from '@/components/shared/DataCard';
import Button from '@/components/shared/Button';
import { useMockDbStore } from '@/stores/mock-db-store';
import { StatusBadge, PriorityBadge } from '@/features/tickets/components/TicketBadges';
import { formatDateTime } from '@/features/tickets/utils';
import type { TableColumn } from '@/components/shared/DataTable';
import type { Ticket } from '@/types';
import {
  Ticket as TicketIcon,
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Shield,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const tickets = useMockDbStore((state) => state.tickets);
  const users = useMockDbStore((state) => state.users);
  const activities = useMockDbStore((state) => state.activities);

  const totalTickets = tickets.length;
  const unassignedTickets = useMemo(
    () => tickets.filter((t) => t.agent === null && t.status.value !== 'resolved'),
    [tickets]
  );
  const openCount = tickets.filter((t) => t.status.value === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status.value === 'in_progress').length;
  const waitingCount = tickets.filter((t) => t.status.value === 'waiting_for_customer').length;
  const resolvedCount = tickets.filter((t) => t.status.value === 'resolved').length;

  const totalStaff = users.filter((u) => u.role === 'agent' || u.role === 'admin').length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;

  const columns: TableColumn<Ticket>[] = [
    {
      key: 'subject',
      label: 'Ticket',
      render: (_, row) => (
        <div>
          <span className="font-semibold text-foreground text-sm line-clamp-1">{row.subject}</span>
          <span className="text-xs text-foreground-muted">#{row.id} • {row.customer.name}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => <StatusBadge status={row.status.value} />,
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (_, row) => <PriorityBadge priority={row.priority} />,
    },
    {
      key: 'agent',
      label: 'Assigned Agent',
      render: (_, row) => (
        <span className="text-xs font-medium text-foreground">
          {row.agent ? row.agent.name : <span className="text-warning font-semibold">Unassigned</span>}
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">System Administration</h1>
            <p className="mt-1 text-sm text-foreground-secondary">
              Global overview of all customer tickets, agent workloads, and system activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/users">
              <Button variant="secondary" size="free-sm" className="h-[42px] min-w-0 w-auto px-4 rounded-xl text-xs">
                <Users className="size-4" />
                Manage Staff ({totalStaff})
              </Button>
            </Link>
            <Link href="/admin/tickets">
              <Button variant="primary" size="free-sm" className="h-[42px] min-w-0 w-auto px-4 rounded-xl text-xs">
                <TicketIcon className="size-4" />
                All Tickets ({totalTickets})
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Tickets"
            value={totalTickets}
            icon={TicketIcon}
            colorClass="text-primary"
            bgClass="bg-primary/10"
            description={`${totalCustomers} customers registered`}
          />
          <StatCard
            label="Unassigned"
            value={unassignedTickets.length}
            icon={Inbox}
            colorClass="text-warning"
            bgClass="bg-warning-light"
            description="Awaiting agent triage"
          />
          <StatCard
            label="Open Issues"
            value={openCount}
            icon={AlertCircle}
            colorClass="text-info"
            bgClass="bg-info-light"
            description="Needs response"
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            icon={Clock}
            colorClass="text-warning"
            bgClass="bg-warning-light"
            description="Under active resolution"
          />
          <StatCard
            label="Resolved"
            value={resolvedCount}
            icon={CheckCircle2}
            colorClass="text-success"
            bgClass="bg-success-light"
            description="Successfully completed"
          />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Global Ticket Activity</h2>
                <p className="text-xs text-foreground-muted">Live across all departments & agents</p>
              </div>
              <Link
                href="/admin/tickets"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View full directory ({tickets.length})
              </Link>
            </div>

            <DataCard<Ticket>
              data={tickets.slice(0, 6)}
              columns={columns}
              rowKey={(row) => row.id}
              onCardClick={(row) => router.push(`/admin/tickets/${row.id}`)}
              emptyTitle="No tickets found"
              emptyDescription="No tickets in the system yet."
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Audit Log & System Feed</h2>
              <p className="text-xs text-foreground-muted">Real-time actions across all users</p>
            </div>
            <div className="rounded-xl border border-border bg-card-bg">
              <ActivityFeed items={activities.slice(0, 10) as any} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
