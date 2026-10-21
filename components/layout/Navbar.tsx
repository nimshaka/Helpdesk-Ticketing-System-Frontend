'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, RotateCcw, Shield, Headset, User as UserIcon, LogOut } from 'lucide-react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useSessionStore } from '@/stores/session-store';
import { useMockDbStore } from '@/stores/mock-db-store';
import { logoutApi } from '@/features/auth/api';
import { toast } from '@/lib/toast/toastService';

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = useSessionStore((state) => state.user);
  const resetDemoData = useMockDbStore((state) => state.resetDemoData);

  const handleResetDemoData = () => {
    resetDemoData();
    toast.success('Demo data reset to initial seed state');
    window.location.reload();
  };

  const handleLogout = async () => {
    await logoutApi();
    toast.success('Logged out successfully');
    setShowLogoutConfirm(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border bg-card-bg px-4 lg:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground-secondary hover:bg-background lg:hidden cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted hidden sm:inline">
            Role-Based Helpdesk Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Reset Demo Data button (Dev only) */}
          {process.env.NODE_ENV === 'development' && (
            <button
              type="button"
              onClick={handleResetDemoData}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground-secondary hover:border-warning hover:text-warning transition-colors cursor-pointer"
              title="Reset all mock tickets and users to default seeds"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>
          )}

          {user && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-1.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                  {user.role === 'admin' ? (
                    <Shield className="size-3.5" />
                  ) : user.role === 'agent' ? (
                    <Headset className="size-3.5" />
                  ) : (
                    <UserIcon className="size-3.5" />
                  )}
                </div>
                <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                  {user.name}
                </span>
                <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-bold capitalize">
                  {user.role}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground-muted hover:border-error hover:text-error transition-colors cursor-pointer"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      {user && (
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
      )}
    </>
  );
}
