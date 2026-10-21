'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import DataCard from '@/components/shared/DataCard';
import Button from '@/components/shared/Button';
import { useSessionStore } from '@/stores/session-store';
import { useMockDbStore } from '@/stores/mock-db-store';
import { StatusBadge, PriorityBadge } from '@/features/tickets/components/TicketBadges';
import { formatDateTime } from '@/features/tickets/utils';
import type { TableColumn } from '@/components/shared/DataTable';
import type { Ticket } from '@/types';
import {
  Inbox,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function AgentDashboardPage() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const tickets = useMockDbStore((state) => state.tickets);
  const activities = useMockDbStore((state) => state.activities);

  // Agent visible tickets: unassigned + held by this agent
  const visibleTickets = useMemo(() => {
    if (!user) return [];
    return tickets.filter((t) => t.agent === null || t.agent.id === user.id);
  }, [tickets, user]);

  const visibleActivities = useMemo(() => {
    return activities.filter((a) => visibleTickets.some((t) => t.id === a.ticket.id));
  }, [activities, visibleTickets]);

  const unassignedTickets = useMemo(() => {
    return tickets.filter((t) => t.agent === null && t.status.value !== 'resolved');
  }, [tickets]);

  const myTickets = useMemo(() => {
    if (!user) return [];
    return tickets.filter((t) => t.agent?.id === user.id);
  }, [tickets, user]);

  const openCount = visibleTickets.filter((t) => t.status.value === 'open').length;
  const inProgressCount = visibleTickets.filter((t) => t.status.value === 'in_progress').length;
  const waitingCount = visibleTickets.filter((t) => t.status.value === 'waiting_for_customer').length;
  const resolvedCount = visibleTickets.filter((t) => t.status.value === 'resolved').length;

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
      label: 'Assignment',
      render: (_, row) => (
        <span className="text-xs">
          {row.agent ? (
            <span className="font-medium text-foreground">
              {row.agent.id === user?.id ? 'Assigned to Me' : row.agent.name}
            </span>
          ) : (
            <span className="font-semibold text-warning">Unassigned Queue</span>
          )}
        </span>
      ),
    },
    {
      key: 'updated_at',
      label: 'Last Update',
      render: (_, row) => (
        <span className="text-xs text-foreground-muted">
          {formatDateTime(row.updated_at)}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Agent Helpdesk Workspace</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Manage your assigned workload and claim incoming unassigned support requests.
          </p>
        </div>

        {/* Highlighted Agent Queues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-warning/40 bg-warning-light/30 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-warning/20 text-warning">
                <Inbox className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">Unassigned Queue</p>
                <p className="text-2xl font-bold text-foreground">{unassignedTickets.length} tickets</p>
                <p className="text-xs text-foreground-muted">Available to be claimed immediately</p>
              </div>
            </div>
            <Link href="/agent/tickets?tab=unassigned">
              <Button variant="secondary" size="free-sm" className="h-[38px] min-w-0 w-auto px-4 rounded-lg text-xs">
                View Queue
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <UserCheck className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">My Active Tickets</p>
                <p className="text-2xl font-bold text-foreground">{myTickets.length} tickets</p>
                <p className="text-xs text-foreground-muted">Currently held by your account</p>
              </div>
            </div>
            <Link href="/agent/tickets?tab=mine">
              <Button variant="primary" size="free-sm" className="h-[38px] min-w-0 w-auto px-4 rounded-lg text-xs">
                Open My Tickets
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Open Queue"
            value={openCount}
            icon={AlertCircle}
            colorClass="text-info"
            bgClass="bg-info-light"
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            icon={Clock}
            colorClass="text-warning"
            bgClass="bg-warning-light"
          />
          <StatCard
            label="Waiting for Customer"
            value={waitingCount}
            icon={HelpCircle}
            colorClass="text-[#8E24AA]"
            bgClass="bg-[#F3E5F5]"
          />
          <StatCard
            label="Resolved"
            value={resolvedCount}
            icon={CheckCircle2}
            colorClass="text-success"
            bgClass="bg-success-light"
          />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Recent Visible Tickets</h2>
                <p className="text-xs text-foreground-muted">Unassigned queue + your assigned cases</p>
              </div>
              <Link
                href="/agent/tickets"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all queue ({visibleTickets.length})
              </Link>
            </div>

            <DataCard<Ticket>
              data={visibleTickets.slice(0, 5)}
              columns={columns}
              rowKey={(row) => row.id}
              onCardClick={(row) => router.push(`/agent/tickets/${row.id}`)}
              emptyTitle="No tickets in queue"
              emptyDescription="There are currently no tickets assigned to you or waiting in the unassigned queue."
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
              <p className="text-xs text-foreground-muted">Updates across your queue</p>
            </div>
            <div className="rounded-xl border border-border bg-card-bg">
              <ActivityFeed items={visibleActivities.slice(0, 8) as any} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
