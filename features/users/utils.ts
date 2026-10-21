import type { UserRole } from "@/types";
import { ROLE_CONFIG } from "./constants";

export function getRoleConfig(role: UserRole) {
  return ROLE_CONFIG[role];
}