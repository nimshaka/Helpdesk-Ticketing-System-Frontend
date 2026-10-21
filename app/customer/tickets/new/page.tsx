'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Input from '@/components/shared/Input';
import Dropdown from '@/components/shared/Dropdown';
import Button from '@/components/shared/Button';
import type { DropdownItem } from '@/components/shared/Dropdown';
import { createTicketSchema } from '@/features/tickets/schemas';
import { createTicketApi } from '@/features/tickets/api';
import { useSessionStore } from '@/stores/session-store';
import { toast } from '@/lib/toast/toastService';
import type { TicketPriority } from '@/types';
import { ArrowLeft, Send } from 'lucide-react';

const PRIORITY_OPTIONS: DropdownItem[] = [
  { label: 'Low — General inquiry, minor UI question', value: 'low' },
  { label: 'Medium — Normal operational or account issue', value: 'medium' },
  { label: 'High — Critical disruption or billing error', value: 'high' },
];

export default function CustomerNewTicketPage() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!user) {
      toast.error('You must be signed in to open a ticket.');
      return;
    }

    const validation = createTicketSchema.safeParse({ subject, description, priority });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const err of validation.error.issues) {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setSubmitting(true);
      const ticket = await createTicketApi(validation.data, { id: user.id, name: user.name });
      toast.success(`Ticket #${ticket.id} opened successfully!`);
      router.push(`/customer/tickets/${ticket.id}`);
    } catch {
      toast.error('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <Link
            href="/customer/tickets"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to my tickets
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Open a New Support Ticket</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Provide details about the issue you are experiencing so our support team can assist you quickly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card-bg p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Subject <span className="text-error">*</span>
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the problem"
              errorMessage={errors.subject}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Priority Level <span className="text-error">*</span>
            </label>
            <Dropdown
              items={PRIORITY_OPTIONS}
              value={priority}
              onChange={(v) => setPriority(v as TicketPriority)}
              placeholder="Select priority"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Detailed Description <span className="text-error">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the issue in detail. Include steps to reproduce, error messages, or affected account details..."
              rows={6}
              className="w-full resize-none rounded-xl border border-border bg-input-bg p-3.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:border-border-hover transition-smooth"
            />
            {errors.description && (
              <p className="text-xs text-error font-medium">{errors.description}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link href="/customer/tickets">
              <Button
                variant="secondary"
                size="free-sm"
                type="button"
                className="h-[42px] min-w-0 w-auto px-5 rounded-lg text-sm"
              >
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              size="free-sm"
              type="submit"
              className="h-[42px] min-w-0 w-auto px-6 rounded-lg text-sm"
              isLoading={submitting}
              disabled={submitting}
            >
              <Send className="size-4" />
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
