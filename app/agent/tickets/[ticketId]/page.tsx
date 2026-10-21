'use client';

import { use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SharedTicketDetail from '@/features/tickets/components/SharedTicketDetail';
import NotFound from '@/components/shared/NotFound';
import { useSessionStore } from '@/stores/session-store';
import { useMockDbStore } from '@/stores/mock-db-store';
import { replyTicketApi, claimTicketApi, changeStatusApi } from '@/features/tickets/api';
import type { TicketStatusValue } from '@/types';

interface PageProps {
  params: Promise<{ ticketId: string }>;
}

export default function AgentTicketDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const ticketId = parseInt(resolvedParams.ticketId, 10);

  const user = useSessionStore((state) => state.user);
  const ticket = useMockDbStore((state) => state.tickets.find((t) => t.id === ticketId));

  // Agent role restriction: unassigned or held by this agent
  if (!ticket || (user && ticket.agent !== null && ticket.agent.id !== user.id)) {
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

  const handleClaim = async () => {
    if (!user) return;
    const res = await claimTicketApi(ticket.id, { id: user.id, name: user.name });
    if (!res.success) throw new Error(res.message);
  };

  const handleChangeStatus = async (status: TicketStatusValue) => {
    if (!user) return;
    await changeStatusApi(ticket.id, status, { id: user.id, name: user.name });
  };

  return (
    <DashboardLayout>
      <SharedTicketDetail
        ticket={ticket}
        currentUser={user}
        activeAgents={[]}
        onReply={handleReply}
        onClaim={ticket.agent === null ? handleClaim : undefined}
        onChangeStatus={ticket.agent?.id === user?.id ? handleChangeStatus : undefined}
        backHref="/agent/tickets"
      />
    </DashboardLayout>
  );
}
