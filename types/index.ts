// ─── Enums ────────────────────────────────────────────────────────────────────

export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatusValue = 'open' | 'in_progress' | 'resolved' | 'waiting_for_customer';
export type UserRole = 'admin' | 'agent' | 'customer';

// ─── Sub-shapes ───────────────────────────────────────────────────────────────

export interface TicketStatus {
  value: TicketStatusValue;
  label: string;
}

export interface TicketUser {
  id: number;
  name: string;
}

export interface TicketAssignment {
  agent: TicketUser;
  assigned_by: number | null;
  assigned_at: string | null;
  unassigned_at: string | null;
}

export interface ReplyAuthor {
  id: number;
  name: string;
  role: UserRole;
}

export interface StatusHistoryStatus {
  value: TicketStatusValue;
  label: string;
}

// ─── API Resources ────────────────────────────────────────────────────────────

export interface TicketReply {
  id: number;
  body: string;
  author: ReplyAuthor;
  created_at: string;
}

export interface TicketStatusHistoryEntry {
  id: number;
  from: StatusHistoryStatus | null;
  to: StatusHistoryStatus;
  changed_by: TicketUser;
  created_at: string;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  customer: TicketUser;
  agent: TicketUser | null;
  replies?: TicketReply[];
  status_history?: TicketStatusHistoryEntry[];
  assignments?: TicketAssignment[];
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStatusCount {
  status: TicketStatusValue;
  label: string;
  count: number;
}

export interface DashboardActivity {
  type: 'reply' | 'status_change';
  summary: string;
  preview?: string;
  actor: TicketUser;
  ticket: { id: number; subject: string };
  occurred_at: string;
}

export interface DashboardData {
  role: UserRole;
  total: number;
  counts: DashboardStatusCount[];
  unassigned?: number;
  assigned_to_me?: number;
  recent_activity: DashboardActivity[];
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
