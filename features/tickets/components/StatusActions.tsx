'use client';

import Button from '@/components/shared/Button';
import { Clock, CheckCircle2 } from 'lucide-react';
import type { Ticket, User, TicketStatusValue } from '@/types';
import { canChangeStatus } from '@/features/auth/permissions';

interface StatusActionsProps {
  ticket: Ticket;
  currentUser: User | null;
  onChangeStatus: (status: TicketStatusValue) => Promise<void>;
}

export default function StatusActions({ ticket, currentUser, onChangeStatus }: StatusActionsProps) {
  if (!canChangeStatus(currentUser, ticket)) {
    return null;
  }

  const isCurrentWaiting = ticket.status.value === 'waiting_for_customer';

  return (
    <div className="rounded-xl border border-border bg-card-bg p-4 space-y-3">
      <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
        Change Status
      </h3>
      <div className="flex flex-col gap-2">
        {!isCurrentWaiting && (
          <Button
            variant="secondary"
            size="free-sm"
            className="h-[38px] justify-start rounded-lg text-xs"
            onClick={() => onChangeStatus('waiting_for_customer')}
          >
            <Clock className="size-3.5 text-[#8E24AA]" />
            Set Waiting for Customer
          </Button>
        )}
        <Button
          variant="secondary"
          size="free-sm"
          className="h-[38px] justify-start rounded-lg text-xs hover:border-success hover:text-success"
          onClick={() => onChangeStatus('resolved')}
        >
          <CheckCircle2 className="size-3.5 text-success" />
          Mark as Resolved
        </Button>
      </div>
    </div>
  );
}
