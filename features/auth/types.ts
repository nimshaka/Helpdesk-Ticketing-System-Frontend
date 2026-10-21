export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatusValue = 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved';
export type UserRole = 'admin' | 'agent' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface TicketStatus {
  value: TicketStatusValue;
  label: string;
}

export interface TicketUserRef {
  id: number;
  name: string;
}

export type TicketUser = TicketUserRef;

export interface ReplyAuthor {
  id: number;
  name: string;
  role: UserRole;
}

export interface Reply {
  id: number;
  body: string;
  author: ReplyAuthor;
  created_at: string;
}

export type TicketReply = Reply;

export interface StatusHistory {
  id: number;
  from: TicketStatus | null;
  to: TicketStatus;
  changed_by: TicketUserRef;
  created_at: string;
}

export type TicketStatusHistoryEntry = StatusHistory;

export interface Assignment {
  agent: TicketUserRef;
  assigned_by: number | null;
  assigned_at: string | null;
  unassigned_at: string | null;
}

export type TicketAssignment = Assignment;

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  customer: TicketUserRef;
  agent: TicketUserRef | null;
  replies?: Reply[];
  status_history?: StatusHistory[];
  assignments?: Assignment[];
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityItem {
  id: string;
  type: 'reply' | 'status_change' | 'assigned' | 'created';
  summary: string;
  preview?: string;
  actor: TicketUserRef;
  ticket: { id: number; subject: string };
  occurred_at: string;
}

export type DashboardActivity = ActivityItem;

export interface DashboardStatusCount {
  status: TicketStatusValue;
  label: string;
  count: number;
}

export interface DashboardData {
  role: UserRole;
  total: number;
  counts: DashboardStatusCount[];
  unassigned?: number;
  assigned_to_me?: number;
  recent_activity: ActivityItem[];
}

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
