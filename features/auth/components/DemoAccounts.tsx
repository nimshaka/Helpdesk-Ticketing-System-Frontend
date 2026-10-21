'use client';

import { Shield, Headset, User } from 'lucide-react';

interface DemoAccountsProps {
  onSelectAccount: (email: string) => void;
}

export default function DemoAccounts({ onSelectAccount }: DemoAccountsProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-primary uppercase tracking-wider text-[11px]">
          Demo Quick-Login (Dev Only)
        </span>
        <span className="text-foreground-muted">Password: <strong>password</strong></span>
      </div>
      <p className="text-[11px] text-foreground-secondary mb-3">
        Click an account to instantly populate credentials:
      </p>

      <div className="space-y-2">
        {/* Admin */}
        <div>
          <span className="font-medium text-foreground block mb-1">Administrator:</span>
          <button
            type="button"
            onClick={() => onSelectAccount('admin@helpdesk.test')}
            className="flex items-center gap-1.5 w-full rounded-lg bg-card-bg border border-border px-2.5 py-1.5 text-left text-xs hover:border-primary hover:text-primary transition-colors"
          >
            <Shield className="size-3.5 text-primary" />
            <span className="font-medium">Sarah Jenkins</span>
            <span className="text-foreground-muted ml-auto font-mono text-[10px]">admin@helpdesk.test</span>
          </button>
        </div>

        {/* Agents */}
        <div>
          <span className="font-medium text-foreground block mb-1">Support Agents:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => onSelectAccount('agent1@helpdesk.test')}
              className="flex items-center gap-1 rounded-lg bg-card-bg border border-border px-2 py-1.5 text-left text-xs hover:border-info hover:text-info transition-colors truncate"
            >
              <Headset className="size-3 text-info shrink-0" />
              <span className="truncate">Alex (Agent 1)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectAccount('agent2@helpdesk.test')}
              className="flex items-center gap-1 rounded-lg bg-card-bg border border-border px-2 py-1.5 text-left text-xs hover:border-info hover:text-info transition-colors truncate"
            >
              <Headset className="size-3 text-info shrink-0" />
              <span className="truncate">Bob (Agent 2)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectAccount('agent3@helpdesk.test')}
              className="flex items-center gap-1 rounded-lg bg-card-bg border border-border px-2 py-1.5 text-left text-xs hover:border-info hover:text-info transition-colors truncate"
            >
              <Headset className="size-3 text-info shrink-0" />
              <span className="truncate">Diana (Agent 3)</span>
            </button>
          </div>
        </div>

        {/* Customers */}
        <div>
          <span className="font-medium text-foreground block mb-1">Customers:</span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onSelectAccount('customer1@helpdesk.test')}
              className="flex items-center gap-1 rounded-lg bg-card-bg border border-border px-2 py-1.5 text-left text-xs hover:border-primary hover:text-primary transition-colors truncate"
            >
              <User className="size-3 text-foreground-muted shrink-0" />
              <span className="truncate">Alice (customer1)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectAccount('customer2@helpdesk.test')}
              className="flex items-center gap-1 rounded-lg bg-card-bg border border-border px-2 py-1.5 text-left text-xs hover:border-primary hover:text-primary transition-colors truncate"
            >
              <User className="size-3 text-foreground-muted shrink-0" />
              <span className="truncate">Michael (customer2)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
