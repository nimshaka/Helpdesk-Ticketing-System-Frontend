import { UserCheck } from 'lucide-react';
import type { Assignment } from '@/types';
import { formatDateTime } from '@/features/tickets/utils';

export default function AssignmentHistoryList({ assignments }: { assignments?: Assignment[] }) {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="py-4 text-center text-xs text-foreground-muted">
        No assignment records.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {assignments.map((record, index) => (
        <div key={index} className="rounded-lg bg-background p-2.5 text-xs border border-border">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <UserCheck className="size-3.5 text-primary" />
            <span>Assigned to {record.agent.name}</span>
          </div>
          <p className="mt-1 text-[11px] text-foreground-muted">
            From: {record.assigned_at ? formatDateTime(record.assigned_at) : 'N/A'}
          </p>
          {record.unassigned_at && (
            <p className="text-[11px] text-foreground-muted">
              Until: {formatDateTime(record.unassigned_at)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
