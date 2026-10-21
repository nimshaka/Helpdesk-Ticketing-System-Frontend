import { UserCircle, Shield, Headset, User } from 'lucide-react';
import type { Reply } from '@/types';
import { cn } from '@/lib/utils';
import { formatRelative } from '@/features/tickets/utils';

export default function ReplyList({ replies }: { replies: Reply[] }) {
  if (!replies || replies.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-foreground-muted">
        No replies in this conversation yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => {
        const isAdmin = reply.author.role === 'admin';
        const isAgent = reply.author.role === 'agent';
        const isStaff = isAdmin || isAgent;

        return (
          <div
            key={reply.id}
            className={cn(
              'rounded-xl border p-4 transition-all',
              isStaff ? 'border-primary/20 bg-primary/5' : 'border-border bg-card-bg'
            )}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    isAdmin
                      ? 'bg-primary-light text-primary'
                      : isAgent
                      ? 'bg-info-light text-info'
                      : 'bg-background-secondary text-foreground-secondary'
                  )}
                >
                  {isAdmin ? (
                    <Shield className="size-4" />
                  ) : isAgent ? (
                    <Headset className="size-4" />
                  ) : (
                    <User className="size-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {reply.author.name}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize',
                        isAdmin
                          ? 'bg-primary-light text-primary'
                          : isAgent
                          ? 'bg-info-light text-info'
                          : 'bg-background-secondary text-foreground-secondary'
                      )}
                    >
                      {reply.author.role}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-foreground-muted whitespace-nowrap">
                {formatRelative(reply.created_at)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground-secondary pl-10">
              {reply.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}
