"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Users, Settings, X, UserCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import Logo from "@/components/shared/Logo";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole?: UserRole;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="size-5" />, roles: ["admin", "agent", "customer"] as UserRole[] },
  { label: "Tickets", href: "/tickets", icon: <Ticket className="size-5" />, roles: ["admin", "agent", "customer"] as UserRole[] },
  { label: "Users", href: "/users", icon: <Users className="size-5" />, roles: ["admin"] as UserRole[] },
  { label: "Settings", href: "/settings", icon: <Settings className="size-5" />, roles: ["admin"] as UserRole[] },
];

export default function MobileNav({ isOpen, onClose, currentRole = "admin" }: MobileNavProps) {
  const pathname = usePathname();
  const visible = navItems.filter((i) => i.roles.includes(currentRole));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-overlay lg:hidden" onClick={onClose} />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar-bg shadow-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <Logo variant="sidebar" clickable />
          <button type="button" onClick={onClose} className="text-foreground-muted hover:text-foreground" aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
          {visible.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                  isActive ? "text-primary font-semibold" : "text-foreground-secondary hover:bg-background"
                )}
                style={isActive ? { background: "var(--gradient-active-nav)" } : undefined}
              >
                <span className={isActive ? "text-primary" : ""}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-4 py-4 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary-light">
            <UserCircle className="size-5 text-primary" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="truncate text-sm font-semibold">Admin User</span>
            <span className="text-xs text-foreground-muted capitalize">{currentRole}</span>
          </div>
          <button type="button" className="text-foreground-muted hover:text-error" aria-label="Logout">
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>
    </>
  );
}