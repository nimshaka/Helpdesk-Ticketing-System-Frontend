import { History } from 'lucide-react';
import type { StatusHistory } from '@/types';
import { StatusBadge } from './TicketBadges';
import { formatDateTime } from '@/features/tickets/utils';

export default function StatusHistoryList({ history }: { history?: StatusHistory[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-foreground-muted">
        No status history recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => (
        <div key={entry.id} className="flex items-start gap-2.5 text-xs text-foreground-secondary">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background-secondary text-foreground-muted">
            <History className="size-3" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-foreground">{entry.changed_by.name}</span>
              {entry.from === null ? (
                <span>created the ticket with status</span>
              ) : (
                <>
                  <span>changed status from</span>
                  <StatusBadge status={entry.from.value} />
                  <span>to</span>
                </>
              )}
              <StatusBadge status={entry.to.value} />
            </p>
            <p className="mt-0.5 text-[11px] text-foreground-muted">
              {formatDateTime(entry.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
