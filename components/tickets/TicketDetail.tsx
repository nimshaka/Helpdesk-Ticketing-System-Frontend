"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, History, Send, UserCircle, Clock, Hash } from "lucide-react";
import type { Ticket, TicketStatusValue } from "@/types";
import { PriorityBadge, StatusBadge } from "@/components/tickets/TicketBadges";
import { formatDateTime, formatRelative, getStatusConfig } from "@/features/tickets/utils";
import { TICKET_STATUSES } from "@/features/tickets/constants";
import { cn } from "@/lib/utils";
import Button from "@/components/shared/Button";
import Dropdown from "@/components/shared/Dropdown";
import type { DropdownItem } from "@/components/shared/Dropdown";

const STATUS_ITEMS: DropdownItem[] = TICKET_STATUSES.map((s) => ({
  label: getStatusConfig(s).label,
  value: s,
}));

const AGENT_ITEMS: DropdownItem[] = [
  { label: "Unassigned", value: "" },
  { label: "Bob Smith", value: "3" },
  { label: "Diana Lee", value: "4" },
  { label: "Sarah Park", value: "5" },
];

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const router = useRouter();
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState<"replies" | "history">("replies");
  const [selectedStatus, setSelectedStatus] = useState<string>(ticket.status.value);
  const [selectedAgent, setSelectedAgent] = useState<string>(ticket.agent?.id.toString() ?? "");

  return (
    <div className="space-y-6">
      {/* Back + title header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-1 flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <div className="flex items-center gap-1 text-xs text-foreground-muted">
              <Hash className="size-3" />
              {ticket.id}
            </div>
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status.value} />
          </div>
          <h2 className="text-lg font-bold text-foreground leading-snug">{ticket.subject}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ── Main column ── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Description */}
          <section className="rounded-xl border border-border bg-card-bg p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Description</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground-secondary">
              {ticket.description}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-foreground-muted">
              <Clock className="size-3" />
              Created {formatDateTime(ticket.created_at)}
            </div>
          </section>

          {/* Replies / History tabs */}
          <section className="overflow-hidden rounded-xl border border-border bg-card-bg">
            <div className="flex border-b border-border">
              {(["replies", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors",
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-foreground-secondary hover:text-foreground"
                  )}
                >
                  {tab === "replies" ? <MessageSquare className="size-4" /> : <History className="size-4" />}
                  {tab === "replies" ? "Replies" : "History"}
                  <span className="rounded-full bg-background px-1.5 py-0.5 text-xs font-semibold">
                    {tab === "replies" ? (ticket.replies?.length ?? 0) : (ticket.status_history?.length ?? 0)}
                  </span>
                </button>
              ))}
            </div>

            {/* Replies */}
            {activeTab === "replies" && (
              <>
                <div className="divide-y divide-border">
                  {(ticket.replies ?? []).length === 0 ? (
                    <div className="py-12 text-center text-sm text-foreground-muted">No replies yet.</div>
                  ) : (
                    (ticket.replies ?? []).map((reply) => {
                      const isStaff = reply.author.role !== "customer";
                      return (
                        <div key={reply.id} className={cn("p-5", isStaff && "bg-primary-light/20")}>
                          <div className="mb-3 flex items-center gap-2.5">
                            <div className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                              isStaff ? "bg-primary text-white" : "bg-background-secondary text-foreground"
                            )}>
                              {reply.author.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{reply.author.name}</span>
                                <span className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                                  isStaff ? "bg-primary-light text-primary" : "bg-background-secondary text-foreground-secondary"
                                )}>
                                  {reply.author.role}
                                </span>
                              </div>
                            </div>
                            <span className="shrink-0 text-xs text-foreground-muted">{formatRelative(reply.created_at)}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground-secondary">{reply.body}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reply composer */}
                <div className="border-t border-border p-5">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    rows={4}
                    className="w-full resize-none rounded-[10px] border border-border bg-input-bg px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-ring hover:border-border-hover transition-smooth"
                  />
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="primary"
                      size="free-sm"
                      className="h-[40px] min-w-0 w-auto px-5 rounded-[10px]"
                      disabled={!replyText.trim()}
                    >
                      <Send className="size-4" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Status history */}
            {activeTab === "history" && (
              <div className="divide-y divide-border">
                {(ticket.status_history ?? []).length === 0 ? (
                  <div className="py-12 text-center text-sm text-foreground-muted">No history yet.</div>
                ) : (
                  (ticket.status_history ?? []).map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 p-4">
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-background-secondary">
                        <History className="size-3.5 text-foreground-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="flex flex-wrap items-center gap-1.5 text-sm text-foreground">
                          <span className="font-semibold">{entry.changed_by.name}</span>
                          {entry.from === null ? (
                            <span className="text-foreground-secondary">created the ticket</span>
                          ) : (
                            <>
                              <span className="text-foreground-secondary">changed status from</span>
                              <StatusBadge status={entry.from.value} />
                              <span className="text-foreground-secondary">to</span>
                              <StatusBadge status={entry.to.value} />
                            </>
                          )}
                        </p>
                        <p className="mt-1 text-xs text-foreground-muted">{formatDateTime(entry.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </div>

        {/* ── Sidebar column ── */}
        <div className="space-y-4">

          {/* Details */}
          <aside className="rounded-xl border border-border bg-card-bg p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Details</h3>
            <div className="space-y-3">
              <InfoRow label="Status"><StatusBadge status={ticket.status.value} /></InfoRow>
              <InfoRow label="Priority"><PriorityBadge priority={ticket.priority} /></InfoRow>
              <InfoRow label="Customer">
                <div className="flex items-center gap-1.5">
                  <UserCircle className="size-3.5 text-foreground-muted" />
                  <span className="text-sm">{ticket.customer.name}</span>
                </div>
              </InfoRow>
              <InfoRow label="Agent">
                <span className="text-sm">{ticket.agent ? ticket.agent.name : <span className="text-foreground-muted italic">Unassigned</span>}</span>
              </InfoRow>
              <InfoRow label="Created">
                <span className="text-xs text-foreground-muted">{formatDateTime(ticket.created_at)}</span>
              </InfoRow>
              <InfoRow label="Updated">
                <span className="text-xs text-foreground-muted">{formatDateTime(ticket.updated_at)}</span>
              </InfoRow>
            </div>
          </aside>

          {/* Update Status */}
          <aside className="rounded-xl border border-border bg-card-bg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Update Status</h3>
            <Dropdown
              items={STATUS_ITEMS}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Select status"
            />
            <Button variant="primary" size="free-sm" className="h-[40px] rounded-[10px]">
              Update Status
            </Button>
          </aside>

          {/* Assign Agent */}
          <aside className="rounded-xl border border-border bg-card-bg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Assign Agent</h3>
            <Dropdown
              items={AGENT_ITEMS}
              value={selectedAgent}
              onChange={setSelectedAgent}
              placeholder="Select agent..."
            />
            <Button variant="secondary" size="free-sm" className="h-[40px] rounded-[10px]">
              Assign
            </Button>
          </aside>

          {/* Assignment history */}
          {(ticket.assignments ?? []).length > 0 && (
            <aside className="rounded-xl border border-border bg-card-bg p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Assignment History</h3>
              <div className="space-y-2">
                {(ticket.assignments ?? []).map((a, idx) => (
                  <div key={idx} className="rounded-lg bg-background p-3">
                    <div className="flex items-center gap-1.5">
                      <UserCircle className="size-4 text-foreground-muted" />
                      <p className="text-sm font-medium text-foreground">{a.agent.name}</p>
                    </div>
                    <p className="mt-1 text-xs text-foreground-muted">
                      Assigned {a.assigned_at ? formatDateTime(a.assigned_at) : "—"}
                    </p>
                    {a.unassigned_at && (
                      <p className="text-xs text-foreground-muted">
                        Unassigned {formatDateTime(a.unassigned_at)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2 last:border-0 last:pb-0">
      <span className="shrink-0 text-xs font-medium text-foreground-secondary">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}