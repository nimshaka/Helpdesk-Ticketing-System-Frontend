"use client";

import { Bell, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface NavbarProps {
  title?: string;
  currentRole?: UserRole;
  onMobileMenuToggle?: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tickets": "Tickets",
  "/users": "Users",
  "/settings": "Settings",
};

export default function Navbar({ currentRole = "admin", onMobileMenuToggle }: NavbarProps) {
  const pathname = usePathname();
  const [hasNotifications] = useState(true);

  const title = Object.entries(ROUTE_TITLES).find(([route]) => pathname === route || pathname.startsWith(route + "/"))?.[1] ?? "Helpdesk";

  return (
    <header data-navbar className="flex h-[60px] shrink-0 items-center gap-4 bg-navbar-bg px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMobileMenuToggle}
        className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white/10 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Title */}
      <h1 className="text-base font-semibold text-foreground lg:text-lg">{title}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notifications */}
      <button
        type="button"
        className="relative flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        {hasNotifications && (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-error" />
        )}
      </button>

      {/* Role badge */}
      <span className="hidden rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold text-foreground capitalize lg:block">
        {currentRole}
      </span>
    </header>
  );
}