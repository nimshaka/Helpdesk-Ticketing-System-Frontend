"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Ticket, Users, Settings, ChevronLeft, ChevronRight,
  Bell, LogOut, UserCircle, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/shared/Logo";
import type { UserRole } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="size-5" />, roles: ["admin", "agent", "customer"] },
  { label: "Tickets", href: "/tickets", icon: <Ticket className="size-5" />, roles: ["admin", "agent", "customer"] },
  { label: "Users", href: "/users", icon: <Users className="size-5" />, roles: ["admin"] },
  { label: "Settings", href: "/settings", icon: <Settings className="size-5" />, roles: ["admin"] },
];

interface SidebarProps {
  currentRole?: UserRole;
}

export default function Sidebar({ currentRole = "admin" }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        data-sidebar
        className={cn(
          "hidden lg:flex flex-col bg-sidebar-bg border-r border-border transition-all duration-300 ease-in-out shrink-0",
          collapsed ? "w-[72px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center px-4 py-5 shrink-0", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && <Logo variant="sidebar" clickable />}
          {collapsed && <Logo variant="mobile" clickable />}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-background hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px" style={{ background: "var(--gradient-sidebar-divider)" }} />

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1 px-2 py-4">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-foreground-secondary hover:bg-background hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                style={isActive ? { background: "var(--gradient-active-nav)" } : undefined}
                title={collapsed ? item.label : undefined}
              >
                <span className={cn("shrink-0", isActive && "text-primary")}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px" style={{ background: "var(--gradient-sidebar-divider)" }} />

        {/* User section */}
        <div className={cn("flex items-center gap-3 px-4 py-4", collapsed && "justify-center px-2")}>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-light">
            <UserCircle className="size-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-1 flex-col min-w-0">
              <span className="truncate text-sm font-semibold text-foreground">Admin User</span>
              <span className="truncate text-xs text-foreground-muted capitalize">{currentRole}</span>
            </div>
          )}
          {!collapsed && (
            <button type="button" className="text-foreground-muted transition-colors hover:text-error" aria-label="Logout">
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}