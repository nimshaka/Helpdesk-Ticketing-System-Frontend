'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Headset,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/shared/Logo';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useSessionStore } from '@/stores/session-store';
import { logoutApi } from '@/features/auth/api';
import { toast } from '@/lib/toast/toastService';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function getRoleNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'customer':
      return [
        { label: 'Dashboard', href: '/customer/dashboard', icon: <LayoutDashboard className="size-5" /> },
        { label: 'My Tickets', href: '/customer/tickets', icon: <Ticket className="size-5" /> },
        { label: 'New Ticket', href: '/customer/tickets/new', icon: <PlusCircle className="size-5" /> },
      ];
    case 'agent':
      return [
        { label: 'Dashboard', href: '/agent/dashboard', icon: <LayoutDashboard className="size-5" /> },
        { label: 'Tickets Queue', href: '/agent/tickets', icon: <Ticket className="size-5" /> },
      ];
    case 'admin':
      return [
        { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="size-5" /> },
        { label: 'All Tickets', href: '/admin/tickets', icon: <Ticket className="size-5" /> },
        { label: 'Users & Staff', href: '/admin/users', icon: <Users className="size-5" /> },
      ];
    default:
      return [];
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = useSessionStore((state) => state.user);

  if (!user) return null;

  const navItems = getRoleNavItems(user.role);

  const handleLogout = async () => {
    await logoutApi();
    toast.info('Logged out successfully');
    setShowLogoutConfirm(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-sidebar-bg border-r border-border transition-all duration-300 ease-in-out shrink-0',
          collapsed ? 'w-[72px]' : 'w-[240px]'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center px-4 py-5 shrink-0', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && <Logo variant="sidebar" clickable />}
          {collapsed && <Logo variant="mobile" clickable />}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-background hover:text-foreground cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        <div className="mx-4 h-px bg-border" />

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${user.role}/dashboard` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-foreground font-semibold shadow-sm'
                    : 'text-foreground-secondary hover:bg-background hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 h-px bg-border" />

        {/* User profile footer */}
        <div className={cn('flex items-center gap-3 px-4 py-4', collapsed && 'justify-center px-2')}>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            {user.role === 'admin' ? (
              <Shield className="size-4" />
            ) : user.role === 'agent' ? (
              <Headset className="size-4" />
            ) : (
              <UserIcon className="size-4" />
            )}
          </div>
          {!collapsed && (
            <div className="flex flex-1 flex-col min-w-0">
              <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
              <span className="truncate text-xs text-foreground-muted capitalize">{user.role}</span>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="text-foreground-muted transition-colors hover:text-error cursor-pointer p-1 rounded-md"
              title="Logout"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message={`Are you sure you want to log out, ${user.name}? You will need to enter your credentials to access your helpdesk dashboard again.`}
        confirmLabel="Log Out"
        cancelLabel="Stay Logged In"
        variant="danger"
      />
    </>
  );
}
