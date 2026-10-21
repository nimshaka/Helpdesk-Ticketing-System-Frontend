"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import TicketList from "@/components/tickets/TicketList";
import CreateTicketModal from "@/components/tickets/CreateTicketModal";
import Button from "@/components/shared/Button";
import Dropdown from "@/components/shared/Dropdown";
import type { DropdownItem } from "@/components/shared/Dropdown";
import { mockDashboard } from "@/mock/dashboard";
import { mockTickets } from "@/mock/tickets";
import type { UserRole, DashboardStatusCount } from "@/types";
import { Plus, Ticket, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const ROLE_OPTIONS: DropdownItem[] = [
  { label: "View as Admin", value: "admin" },
  { label: "View as Agent", value: "agent" },
  { label: "View as Customer", value: "customer" },
];

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole>("admin");
  const [createTicketOpen, setCreateTicketOpen] = useState(false);

  const dashboardData = mockDashboard;
  const totalTickets = dashboardData.total;
  const openCount = dashboardData.counts.find((c: DashboardStatusCount) => c.status === "open")?.count || 0;
  const inProgressCount = dashboardData.counts.find((c: DashboardStatusCount) => c.status === "in_progress")?.count || 0;
  const resolvedCount = dashboardData.counts.find((c: DashboardStatusCount) => c.status === "resolved")?.count || 0;

  return (
    <DashboardLayout currentRole={role}>
      <div className="space-y-6">
        {/* Header with Title, Role switcher, and Create action */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-foreground-secondary">
              Overview of your helpdesk metrics, recent tickets, and team activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-44">
              <Dropdown
                items={ROLE_OPTIONS}
                value={role}
                onChange={(v) => setRole(v as UserRole)}
                placeholder="Switch role"
              />
            </div>
            <Button
              variant="primary"
              size="free-sm"
              className="h-[44px] min-w-0 w-auto px-4 rounded-lg"
              onClick={() => setCreateTicketOpen(true)}
            >
              <Plus className="size-4" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Tickets"
            value={totalTickets}
            icon={Ticket}
            colorClass="text-primary"
            bgClass="bg-primary/10"
            description="All tickets across departments"
          />
          <StatCard
            label="Open Issues"
            value={openCount}
            icon={AlertCircle}
            colorClass="text-info"
            bgClass="bg-info-light"
            description="Requires agent triage"
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            icon={Clock}
            colorClass="text-warning"
            bgClass="bg-warning-light"
            description="Currently being worked on"
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

        {/* Content Section: Recent Tickets & Activity Feed */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Recent Tickets</h2>
                <p className="text-xs text-foreground-muted">Always displayed via responsive DataCard</p>
              </div>
            </div>
            <TicketList
              tickets={mockTickets.slice(0, 4)}
              total={mockTickets.length}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              <p className="text-xs text-foreground-muted">Live system events & updates</p>
            </div>
            <div className="rounded-xl border border-border bg-card-bg">
              <ActivityFeed items={dashboardData.recent_activity} />
            </div>
          </div>
        </div>
      </div>

      <CreateTicketModal
        isOpen={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
      />
    </DashboardLayout>
  );
}
