"use client";

import { use } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TicketDetail from "@/components/tickets/TicketDetail";
import { mockTickets } from "@/mock/tickets";
import { ArrowLeft } from "lucide-react";
import NotFound from "@/components/shared/NotFound";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TicketDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const ticketId = parseInt(resolvedParams.id, 10);
  const ticket = mockTickets.find((t) => t.id === ticketId) || mockTickets[0];

  if (!ticket) {
    return (
      <DashboardLayout currentRole="admin">
        <div className="p-8">
          <NotFound />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentRole="admin">
      <div className="space-y-4">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to all tickets
        </Link>
        <TicketDetail ticket={ticket} />
      </div>
    </DashboardLayout>
  );
}
