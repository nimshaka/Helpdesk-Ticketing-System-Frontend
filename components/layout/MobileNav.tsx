'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X, LayoutDashboard, Ticket, PlusCircle, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/shared/Logo';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useSessionStore } from '@/stores/session-store';
import { logoutApi } from '@/features/auth/api';
import { toast } from '@/lib/toast/toastService';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = useSessionStore((state) => state.user);

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    await logoutApi();
    toast.info('Logged out successfully');
    setShowLogoutConfirm(false);
    onClose();
    router.push('/login');
    router.refresh();
  };

  const navItems =
    user.role === 'customer'
      ? [
          { label: 'Dashboard', href: '/customer/dashboard', icon: <LayoutDashboard className="size-5" /> },
          { label: 'My Tickets', href: '/customer/tickets', icon: <Ticket className="size-5" /> },
          { label: 'New Ticket', href: '/customer/tickets/new', icon: <PlusCircle className="size-5" /> },
        ]
      : user.role === 'agent'
      ? [
          { label: 'Dashboard', href: '/agent/dashboard', icon: <LayoutDashboard className="size-5" /> },
          { label: 'Tickets Queue', href: '/agent/tickets', icon: <Ticket className="size-5" /> },
        ]
      : [
          { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="size-5" /> },
          { label: 'All Tickets', href: '/admin/tickets', icon: <Ticket className="size-5" /> },
          { label: 'Users & Staff', href: '/admin/users', icon: <Users className="size-5" /> },
        ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex lg:hidden">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <aside className="relative flex w-[280px] flex-col bg-sidebar-bg border-r border-border p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Logo variant="mobile" clickable />
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-background cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-foreground font-semibold shadow-sm'
                      : 'text-foreground-secondary hover:bg-background hover:text-foreground'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border mt-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-foreground-muted capitalize">{user.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="text-foreground-muted hover:text-error p-1.5 cursor-pointer rounded-md"
                title="Logout"
              >
                <LogOut className="size-5" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message={`Are you sure you want to log out, ${user.name}?`}
        confirmLabel="Log Out"
        cancelLabel="Stay Logged In"
        variant="danger"
      />
    </>
  );
}
