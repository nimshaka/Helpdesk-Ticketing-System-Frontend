import type { UserRole } from "@/types";

export const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string }> = {
  admin: { label: "Admin", color: "text-purple", bg: "bg-purple-light" },
  agent: { label: "Agent", color: "text-info", bg: "bg-info-light" },
  customer: { label: "Customer", color: "text-success", bg: "bg-success-light" },
};

export const USER_ROLES: UserRole[] = ["admin", "agent", "customer"];