'use client';

import { useState } from 'react';
import { ArrowLeft, UserCircle, Calendar, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge, PriorityBadge } from './TicketBadges';
import WaitingBanner from './WaitingBanner';
import ReplyList from './ReplyList';
import ReplyForm from './ReplyForm';
import StatusHistoryList from './StatusHistoryList';
import AssignmentHistoryList from './AssignmentHistoryList';
import StatusActions from './StatusActions';
import AssignDialog from './AssignDialog';
import Button from '@/components/shared/Button';
import type { Ticket, User, TicketStatusValue } from '@/types';
import { canClaim, canAssign, canViewAssignmentHistory } from '@/features/auth/permissions';
import { formatDateTime } from '@/features/tickets/utils';
import { toast } from '@/lib/toast/toastService';

interface SharedTicketDetailProps {
  ticket: Ticket;
  currentUser: User | null;
  activeAgents: User[];
  onReply: (body: string) => Promise<void>;
  onClaim?: () => Promise<void>;
  onAssign?: (agent: { id: number; name: string }) => Promise<void>;
  onChangeStatus?: (status: TicketStatusValue) => Promise<void>;
  backHref: string;
}

export default function SharedTicketDetail({
  ticket,
  currentUser,
  activeAgents,
  onReply,
  onClaim,
  onAssign,
  onChangeStatus,
  backHref,
}: SharedTicketDetailProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const isWaiting = ticket.status.value === 'waiting_for_customer';
  const showClaim = canClaim(currentUser, ticket);
  const showAssign = canAssign(currentUser, ticket);
  const showAssignmentHistory = canViewAssignmentHistory(currentUser);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to tickets
        </Link>
      </div>

      {/* Waiting for Customer banner */}
      {isWaiting && currentUser && <WaitingBanner role={currentUser.role} />}

      {/* Main Ticket Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Subject, Description, Conversation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="rounded-xl border border-border bg-card-bg p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold text-foreground-muted">#{ticket.id}</span>
              <StatusBadge status={ticket.status.value} />
              <PriorityBadge priority={ticket.priority} />
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-foreground leading-snug">
              {ticket.subject}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-foreground-muted pt-1 border-t border-border">
              <span className="flex items-center gap-1.5">
                <UserCircle className="size-4 text-foreground-secondary" />
                <span>Requester: <strong className="text-foreground">{ticket.customer.name}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 text-foreground-secondary" />
                <span>Created {formatDateTime(ticket.created_at)}</span>
              </span>
            </div>

            <div className="rounded-lg bg-background p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap border border-border">
              {ticket.description}
            </div>
          </div>

          {/* Conversation Section */}
          <div className="rounded-xl border border-border bg-card-bg p-6 space-y-5">
            <h2 className="text-base font-semibold text-foreground">
              Conversation Thread ({(ticket.replies || []).length})
            </h2>

            <ReplyList replies={ticket.replies || []} />

            <div className="pt-4 border-t border-border">
              <ReplyForm
                ticket={ticket}
                currentUser={currentUser}
                onReply={onReply}
                onClaim={onClaim}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Details Sidebar */}
        <div className="space-y-5">
          {/* Action Card: Claim / Assign */}
          {(showClaim || showAssign) && (
            <div className="rounded-xl border border-border bg-card-bg p-5 space-y-3">
              <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Management
              </h3>
              {showClaim && onClaim && (
                <Button
                  variant="primary"
                  size="free-sm"
                  className="h-[42px] w-full rounded-lg text-sm"
                  onClick={async () => {
                    try {
                      await onClaim();
                      toast.success('You have successfully claimed this ticket!');
                    } catch (err: unknown) {
                      toast.error(err instanceof Error ? err.message : 'Failed to claim ticket');
                    }
                  }}
                >
                  Claim This Ticket
                </Button>
              )}
              {showAssign && onAssign && (
                <Button
                  variant="secondary"
                  size="free-sm"
                  className="h-[42px] w-full rounded-lg text-sm"
                  onClick={() => setAssignDialogOpen(true)}
                >
                  <UserPlus className="size-4" />
                  {ticket.agent ? 'Reassign Agent' : 'Assign to Agent'}
                </Button>
              )}
            </div>
          )}

          {/* Status Actions */}
          {onChangeStatus && (
            <StatusActions
              ticket={ticket}
              currentUser={currentUser}
              onChangeStatus={async (newStatus) => {
                try {
                  await onChangeStatus(newStatus);
                  toast.success(`Status updated to ${newStatus}`);
                } catch {
                  toast.error('Failed to change status');
                }
              }}
            />
          )}

          {/* Ticket Information Card */}
          <div className="rounded-xl border border-border bg-card-bg p-5 space-y-3">
            <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
              Ticket Details
            </h3>
            <div className="divide-y divide-border text-xs">
              <div className="flex justify-between py-2">
                <span className="text-foreground-secondary">Status</span>
                <StatusBadge status={ticket.status.value} />
              </div>
              <div className="flex justify-between py-2">
                <span className="text-foreground-secondary">Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div className="flex justify-between py-2">
                <span className="text-foreground-secondary">Assigned Agent</span>
                <span className="font-medium text-foreground">
                  {ticket.agent ? ticket.agent.name : <em className="text-foreground-muted">Unassigned</em>}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-foreground-secondary">Requester</span>
                <span className="font-medium text-foreground">{ticket.customer.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-foreground-secondary">Last Activity</span>
                <span className="text-foreground-muted">
                  {ticket.last_activity_at ? formatDateTime(ticket.last_activity_at) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Assignment History (Admin only) */}
          {showAssignmentHistory && (
            <div className="rounded-xl border border-border bg-card-bg p-5 space-y-3">
              <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Assignment History
              </h3>
              <AssignmentHistoryList assignments={ticket.assignments} />
            </div>
          )}

          {/* Status Transitions Timeline */}
          <div className="rounded-xl border border-border bg-card-bg p-5 space-y-3">
            <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
              Status History
            </h3>
            <StatusHistoryList history={ticket.status_history} />
          </div>
        </div>
      </div>

      {/* Assign Dialog Modal */}
      {showAssign && onAssign && (
        <AssignDialog
          isOpen={assignDialogOpen}
          onClose={() => setAssignDialogOpen(false)}
          ticket={ticket}
          activeAgents={activeAgents}
          onAssign={async (agent) => {
            await onAssign(agent);
            toast.success(`Ticket assigned to ${agent.name}`);
          }}
        />
      )}
    </div>
  );
}
