import type { DashboardData } from "@/types";

export const mockDashboard: DashboardData = {
  role: "admin",
  total: 8,
  counts: [
    { status: "open", label: "Open", count: 4 },
    { status: "in_progress", label: "In Progress", count: 2 },
    { status: "resolved", label: "Resolved", count: 1 },
    { status: "waiting_for_customer", label: "Waiting for Customer", count: 1 },
  ],
  unassigned: 3,
  assigned_to_me: 2,
  recent_activity: [
    {
      type: "reply",
      summary: "Alice Johnson replied",
      preview: "I am using Chrome version 118. The error message just says Invalid credentials...",
      actor: { id: 10, name: "Alice Johnson" },
      ticket: { id: 1, subject: "Cannot log into my account" },
      occurred_at: "2026-10-21T10:00:00Z",
    },
    {
      type: "status_change",
      summary: "Bob Smith changed the status from Open to In Progress",
      actor: { id: 3, name: "Bob Smith" },
      ticket: { id: 2, subject: "Billing discrepancy on invoice #1042" },
      occurred_at: "2026-10-21T09:45:00Z",
    },
    {
      type: "reply",
      summary: "Diana Lee replied",
      preview: "We have reviewed your billing and found the discrepancy. A refund of $40 will be processed...",
      actor: { id: 4, name: "Diana Lee" },
      ticket: { id: 2, subject: "Billing discrepancy on invoice #1042" },
      occurred_at: "2026-10-21T09:30:00Z",
    },
    {
      type: "status_change",
      summary: "James Brown created the ticket",
      actor: { id: 17, name: "James Brown" },
      ticket: { id: 8, subject: "Dashboard widgets not loading" },
      occurred_at: "2026-10-21T09:00:00Z",
    },
    {
      type: "reply",
      summary: "Bob Smith replied",
      preview: "We have escalated this to our authentication team. We will get back to you within 2 hours...",
      actor: { id: 3, name: "Bob Smith" },
      ticket: { id: 1, subject: "Cannot log into my account" },
      occurred_at: "2026-10-20T15:30:00Z",
    },
    {
      type: "status_change",
      summary: "Diana Lee changed the status from Open to Resolved",
      actor: { id: 4, name: "Diana Lee" },
      ticket: { id: 5, subject: "Need help exporting data to CSV" },
      occurred_at: "2026-10-20T14:00:00Z",
    },
  ],
};