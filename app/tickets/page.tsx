"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TicketList from "@/components/tickets/TicketList";
import CreateTicketModal from "@/components/tickets/CreateTicketModal";
import { mockTickets } from "@/mock/tickets";
import type { UserRole } from "@/types";

export default function TicketsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [role] = useState<UserRole>("admin");

  return (
    <DashboardLayout currentRole={role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tickets</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Manage, filter, and track all customer support requests across departments.
          </p>
        </div>

        <TicketList
          tickets={mockTickets}
          total={mockTickets.length}
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>

      <CreateTicketModal
        isOpen={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
      />
    </DashboardLayout>
  );
}
