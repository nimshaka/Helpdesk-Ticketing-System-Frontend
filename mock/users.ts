import type { User, PaginatedResponse } from "@/types";

export const mockUsers: User[] = [
  { id: 1, name: "Admin User", email: "admin@helpdesk.com", role: "admin", is_active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: 2, name: "Sarah Park", email: "sarah@helpdesk.com", role: "admin", is_active: true, created_at: "2026-01-05T00:00:00Z" },
  { id: 3, name: "Bob Smith", email: "bob@helpdesk.com", role: "agent", is_active: true, created_at: "2026-02-01T00:00:00Z" },
  { id: 4, name: "Diana Lee", email: "diana@helpdesk.com", role: "agent", is_active: true, created_at: "2026-02-10T00:00:00Z" },
  { id: 5, name: "Marcus Jones", email: "marcus@helpdesk.com", role: "agent", is_active: false, created_at: "2026-03-01T00:00:00Z" },
  { id: 10, name: "Alice Johnson", email: "alice@example.com", role: "customer", is_active: true, created_at: "2026-03-15T00:00:00Z" },
  { id: 11, name: "Carlos Rivera", email: "carlos@example.com", role: "customer", is_active: true, created_at: "2026-03-20T00:00:00Z" },
  { id: 12, name: "Emily Chen", email: "emily@example.com", role: "customer", is_active: true, created_at: "2026-04-01T00:00:00Z" },
  { id: 13, name: "Frank Torres", email: "frank@example.com", role: "customer", is_active: false, created_at: "2026-04-05T00:00:00Z" },
  { id: 14, name: "Grace Kim", email: "grace@example.com", role: "customer", is_active: true, created_at: "2026-04-10T00:00:00Z" },
  { id: 15, name: "Henry Walsh", email: "henry@example.com", role: "customer", is_active: true, created_at: "2026-04-15T00:00:00Z" },
  { id: 16, name: "Isabella Moore", email: "isabella@example.com", role: "customer", is_active: true, created_at: "2026-05-01T00:00:00Z" },
];

export const mockUsersPaginated: PaginatedResponse<User> = {
  success: true,
  data: mockUsers,
  message: "Users retrieved.",
  meta: { current_page: 1, per_page: 15, total: 12, last_page: 1 },
};

export const mockCurrentUser: User = mockUsers[0];