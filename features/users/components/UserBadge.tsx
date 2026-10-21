import { cn } from "@/lib/utils";
import { getRoleConfig } from "@/features/users/utils";
import type { UserRole } from "@/types";

export function RoleBadge({ role }: { role: UserRole }) {
  const config = getRoleConfig(role);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", config.color, config.bg)}>
      {config.label}
    </span>
  );
}

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
      isActive ? "bg-success-light text-success" : "bg-error-light text-error"
    )}>
      <span className={cn("size-1.5 rounded-full", isActive ? "bg-success" : "bg-error")} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
