"use client";

import {
  CheckCircle,
  History,
  Inbox,
  MessageSquare,
  SearchX,
  Ticket,
  UserX,
  Users,
} from "lucide-react";
import Link from "next/link";

const illustrations = {
  "no-tickets": {
    icon: <Ticket className="size-12 text-primary" />,
    tone: "bg-primary-light",
  },
  "no-results": {
    icon: <SearchX className="size-12 text-foreground-muted" />,
    tone: "bg-background-secondary",
  },
  "all-resolved": {
    icon: <CheckCircle className="size-12 text-success" />,
    tone: "bg-success-light",
  },
  "no-replies": {
    icon: <MessageSquare className="size-12 text-primary" />,
    tone: "bg-primary-light",
  },
  unassigned: {
    icon: <Inbox className="size-12 text-warning" />,
    tone: "bg-warning-light",
  },
  "no-agents": {
    icon: <UserX className="size-12 text-foreground-muted" />,
    tone: "bg-background-secondary",
  },
  "no-customers": {
    icon: <Users className="size-12 text-foreground-muted" />,
    tone: "bg-background-secondary",
  },
  "no-history": {
    icon: <History className="size-12 text-foreground-muted" />,
    tone: "bg-background-secondary",
  },
} as const;

export type EmptyStateIllustration = keyof typeof illustrations;

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  illustration?: EmptyStateIllustration;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  illustration = "no-tickets",
}: EmptyStateProps) {
  const preset = illustrations[illustration];

  return (
    <div className="animate-fade-in-up flex flex-col items-center justify-center rounded-xl bg-card-bg px-6 py-12 text-center">
      <div
        className={`mb-4 flex size-20 items-center justify-center rounded-full ${preset.tone}`}
      >
        {icon ?? preset.icon}
      </div>

      <p className="text-lg font-semibold text-foreground">{title}</p>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-foreground-secondary">
          {description}
        </p>
      )}

      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary-hover"
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-4 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary-hover"
          >
            {action.label}
          </button>
        ))}
    </div>
  );
}