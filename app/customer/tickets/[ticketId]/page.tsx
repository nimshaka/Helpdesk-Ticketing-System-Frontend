'use client';

import { use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SharedTicketDetail from '@/features/tickets/components/SharedTicketDetail';
import NotFound from '@/components/shared/NotFound';
import { useSessionStore } from '@/stores/session-store';
import { useMockDbStore } from '@/stores/mock-db-store';
import { replyTicketApi } from '@/features/tickets/api';

interface PageProps {
  params: Promise<{ ticketId: string }>;
}

export default function CustomerTicketDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const ticketId = parseInt(resolvedParams.ticketId, 10);

  const user = useSessionStore((state) => state.user);
  const ticket = useMockDbStore((state) => state.tickets.find((t) => t.id === ticketId));

  // Customer role restriction: only own tickets
  if (!ticket || (user && ticket.customer.id !== user.id)) {
    return (
      <DashboardLayout>
        <div className="py-12">
          <NotFound />
        </div>
      </DashboardLayout>
    );
  }

  const handleReply = async (body: string) => {
    if (!user) return;
    await replyTicketApi(ticket.id, { id: user.id, name: user.name, role: user.role }, body);
  };

  return (
    <DashboardLayout>
      <SharedTicketDetail
        ticket={ticket}
        currentUser={user}
        activeAgents={[]}
        onReply={handleReply}
        backHref="/customer/tickets"
      />
    </DashboardLayout>
  );
}
