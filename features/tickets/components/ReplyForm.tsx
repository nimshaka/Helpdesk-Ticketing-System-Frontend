'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import { Send, Lock, AlertTriangle } from 'lucide-react';
import type { Ticket, User } from '@/types';
import { canReply } from '@/features/auth/permissions';
import { toast } from '@/lib/toast/toastService';

interface ReplyFormProps {
  ticket: Ticket;
  currentUser: User | null;
  onReply: (body: string) => Promise<void>;
  onClaim?: () => void;
}

export default function ReplyForm({ ticket, currentUser, onReply, onClaim }: ReplyFormProps) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 1. Resolved ticket: closed
  if (ticket.status.value === 'resolved') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success-light/40 p-4 text-success">
        <Lock className="size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">This ticket is marked as Resolved</p>
          <p className="text-xs text-foreground-muted">
            The conversation is closed and no further replies or assignments can be made.
          </p>
        </div>
      </div>
    );
  }

  // 2. Agent viewing unassigned ticket or ticket held by another agent
  if (currentUser?.role === 'agent' && ticket.agent?.id !== currentUser.id) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-warning/40 bg-warning-light/40 p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-warning shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {ticket.agent === null
                ? 'Claim this ticket to reply'
                : `Currently assigned to ${ticket.agent.name}`}
            </p>
            <p className="text-xs text-foreground-muted">
              {ticket.agent === null
                ? 'Only the assigned agent or an administrator may respond to this customer.'
                : 'You may only reply to tickets assigned to your queue.'}
            </p>
          </div>
        </div>
        {ticket.agent === null && onClaim && (
          <Button
            variant="primary"
            size="free-sm"
            className="h-[40px] min-w-0 w-auto px-5 rounded-lg text-sm shrink-0"
            onClick={onClaim}
          >
            Claim Ticket
          </Button>
        )}
      </div>
    );
  }

  // 3. Customer cannot reply if not their ticket
  const allowed = canReply(currentUser, ticket);
  if (!allowed) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    try {
      setSubmitting(true);
      await onReply(body.trim());
      setBody('');
      toast.success('Reply posted successfully');
    } catch {
      toast.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm font-semibold text-foreground">
        Post a Reply
      </label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type your response here..."
        rows={4}
        className="w-full resize-none rounded-xl border border-border bg-input-bg p-3.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:border-border-hover transition-smooth"
      />
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="free-sm"
          type="submit"
          className="h-[42px] min-w-0 w-auto px-5 rounded-lg text-sm"
          disabled={!body.trim() || submitting}
          isLoading={submitting}
        >
          <Send className="size-4" />
          Send Reply
        </Button>
      </div>
    </form>
  );
}
