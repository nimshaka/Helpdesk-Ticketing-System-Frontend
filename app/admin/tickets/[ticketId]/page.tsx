'use client';

import { use, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SharedTicketDetail from '@/features/tickets/components/SharedTicketDetail';
import NotFound from '@/components/shared/NotFound';
import { useSessionStore } from '@/stores/session-store';
import { useMockDbStore } from '@/stores/mock-db-store';
import { replyTicketApi, assignTicketApi, changeStatusApi } from '@/features/tickets/api';
import type { TicketStatusValue } from '@/types';

interface PageProps {
  params: Promise<{ ticketId: string }>;
}

export default function AdminTicketDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const ticketId = parseInt(resolvedParams.ticketId, 10);

  const user = useSessionStore((state) => state.user);
  const ticket = useMockDbStore((state) => state.tickets.find((t) => t.id === ticketId));
  const users = useMockDbStore((state) => state.users);

  const activeAgents = useMemo(
    () => users.filter((u) => u.role === 'agent' && u.is_active),
    [users]
  );

  if (!ticket) {
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

  const handleAssign = async (agent: { id: number; name: string }) => {
    if (!user) return;
    await assignTicketApi(ticket.id, agent, { id: user.id, name: user.name });
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
        activeAgents={activeAgents}
        onReply={handleReply}
        onAssign={handleAssign}
        onChangeStatus={handleChangeStatus}
        backHref="/admin/tickets"
      />
    </DashboardLayout>
  );
}
