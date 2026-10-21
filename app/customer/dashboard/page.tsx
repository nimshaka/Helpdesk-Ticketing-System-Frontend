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
import { Plus, Ticket as TicketIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const tickets = useMockDbStore((state) => state.tickets);
  const activities = useMockDbStore((state) => state.activities);

  const ownTickets = useMemo(() => {
    if (!user) return [];
    return tickets.filter((t) => t.customer.id === user.id);
  }, [tickets, user]);

  const ownActivities = useMemo(() => {
    if (!user) return [];
    return activities.filter((a) => ownTickets.some((t) => t.id === a.ticket.id));
  }, [activities, ownTickets]);

  const openCount = ownTickets.filter((t) => t.status.value === 'open').length;
  const inProgressCount = ownTickets.filter((t) => t.status.value === 'in_progress').length;
  const waitingCount = ownTickets.filter((t) => t.status.value === 'waiting_for_customer').length;
  const resolvedCount = ownTickets.filter((t) => t.status.value === 'resolved').length;

  const columns: TableColumn<Ticket>[] = [
    {
      key: 'subject',
      label: 'Ticket',
      render: (_, row) => (
        <div>
          <span className="font-semibold text-foreground text-sm line-clamp-1">{row.subject}</span>
          <span className="text-xs text-foreground-muted">#{row.id}</span>
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
        <span className="text-xs text-foreground-secondary">
          {row.agent ? row.agent.name : <em className="text-foreground-muted">Pending Assignment</em>}
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Customer Support Portal</h1>
            <p className="mt-1 text-sm text-foreground-secondary">
              Track the status of your reported requests, view agent replies, or open a new ticket.
            </p>
          </div>
          <Link href="/customer/tickets/new">
            <Button variant="primary" size="free-sm" className="h-[44px] min-w-0 w-auto px-5 rounded-xl">
              <Plus className="size-4" />
              New Support Request
            </Button>
          </Link>
        </div>

        {/* Status metric counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Open Requests"
            value={openCount}
            icon={AlertCircle}
            colorClass="text-info"
            bgClass="bg-info-light"
            description="Submitted & awaiting agent pickup"
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            icon={Clock}
            colorClass="text-warning"
            bgClass="bg-warning-light"
            description="Under active investigation"
          />
          <StatCard
            label="Waiting on You"
            value={waitingCount}
            icon={Clock}
            colorClass="text-[#8E24AA]"
            bgClass="bg-[#F3E5F5]"
            description="Agent requested your response"
          />
          <StatCard
            label="Resolved"
            value={resolvedCount}
            icon={CheckCircle2}
            colorClass="text-success"
            bgClass="bg-success-light"
            description="Completed issues"
          />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Recent Support Tickets</h2>
                <p className="text-xs text-foreground-muted">Click any ticket to view the conversation</p>
              </div>
              <Link
                href="/customer/tickets"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all ({ownTickets.length})
              </Link>
            </div>

            <DataCard<Ticket>
              data={ownTickets.slice(0, 5)}
              columns={columns}
              rowKey={(row) => row.id}
              onCardClick={(row) => router.push(`/customer/tickets/${row.id}`)}
              emptyTitle="No tickets submitted yet"
              emptyDescription="Need help? Click New Support Request above to contact our team."
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
              <p className="text-xs text-foreground-muted">Updates on your tickets</p>
            </div>
            <div className="rounded-xl border border-border bg-card-bg">
              <ActivityFeed items={ownActivities.slice(0, 8) as any} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
