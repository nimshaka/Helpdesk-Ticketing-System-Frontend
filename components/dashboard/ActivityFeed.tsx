import { MessageSquare, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { DashboardActivity } from "@/types";
import { formatRelative } from "@/features/tickets/utils";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  items: DashboardActivity[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-foreground-muted">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item, idx) => {
        const isReply = item.type === "reply";
        return (
          <div key={idx} className="flex items-start gap-3 p-4 hover:bg-background transition-colors">
            <div className={cn(
              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
              isReply ? "bg-primary-light" : "bg-warning-light"
            )}>
              {isReply
                ? <MessageSquare className="size-3.5 text-primary" />
                : <RefreshCw className="size-3.5 text-warning" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{item.summary}</p>
              {item.preview && (
                <p className="mt-0.5 truncate text-xs text-foreground-muted">{item.preview}</p>
              )}
              <div className="mt-1 flex items-center gap-2">
                <Link
                  href={`/tickets/${item.ticket.id}`}
                  className="truncate text-xs font-medium text-primary hover:underline"
                >
                  {item.ticket.subject}
                </Link>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-xs text-foreground-muted whitespace-nowrap">
                {formatRelative(item.occurred_at)}
              </span>
              <Link
                href={`/tickets/${item.ticket.id}`}
                className="flex items-center gap-0.5 text-xs text-foreground-muted hover:text-primary transition-colors"
              >
                View <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}