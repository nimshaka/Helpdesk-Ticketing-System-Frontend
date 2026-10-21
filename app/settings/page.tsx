"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Checkbox from "@/components/shared/Checkbox";
import Dropdown from "@/components/shared/Dropdown";
import type { DropdownItem } from "@/components/shared/Dropdown";
import { Shield, Bell, Building2, Save } from "lucide-react";

const SLA_OPTIONS: DropdownItem[] = [
  { label: "Standard SLA (24h response, 72h resolution)", value: "standard" },
  { label: "High Priority SLA (4h response, 24h resolution)", value: "high" },
  { label: "Critical SLA (1h response, 8h resolution)", value: "critical" },
];

const TIMEZONE_OPTIONS: DropdownItem[] = [
  { label: "UTC (Coordinated Universal Time)", value: "UTC" },
  { label: "America/New_York (EST)", value: "America/New_York" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "Asia/Colombo (IST)", value: "Asia/Colombo" },
];

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("Enterprise Helpdesk Corp");
  const [supportEmail, setSupportEmail] = useState("support@helpdesk.io");
  const [slaPolicy, setSlaPolicy] = useState("standard");
  const [timezone, setTimezone] = useState("America/New_York");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout currentRole="admin">
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">System Settings</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Configure system preferences, SLAs, notification rules, and company branding.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Settings */}
          <div className="rounded-xl border border-border bg-card-bg p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <Building2 className="size-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Organization Profile</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground-secondary">
                  Helpdesk Name
                </label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground-secondary">
                  Default Support Inbound Email
                </label>
                <Input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@company.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground-secondary">
                  Default SLA Tier
                </label>
                <Dropdown
                  items={SLA_OPTIONS}
                  value={slaPolicy}
                  onChange={setSlaPolicy}
                  placeholder="Select default SLA"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground-secondary">
                  System Timezone
                </label>
                <Dropdown
                  items={TIMEZONE_OPTIONS}
                  value={timezone}
                  onChange={setTimezone}
                  placeholder="Select timezone"
                />
              </div>
            </div>
          </div>

          {/* Automation & Notifications */}
          <div className="rounded-xl border border-border bg-card-bg p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <Bell className="size-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Notification & Routing</h2>
            </div>

            <div className="space-y-4">
              <Checkbox
                checked={emailNotifications}
                onCheckedChange={(val) => setEmailNotifications(val)}
              >
                Send email updates on ticket status changes and comments
              </Checkbox>
              <Checkbox
                checked={autoAssign}
                onCheckedChange={(val) => setAutoAssign(val)}
              >
                Enable round-robin auto assignment for unassigned tickets
              </Checkbox>
            </div>
          </div>

          {/* Security & Access */}
          <div className="rounded-xl border border-border bg-card-bg p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <Shield className="size-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Security & Policies</h2>
            </div>
            <p className="text-sm text-foreground-muted">
              Role-based access controls and authentication policies are enforced via mock security rules.
            </p>
          </div>

          {/* Save button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="text-sm font-medium text-success">
                Settings saved successfully!
              </span>
            )}
            <Button
              variant="primary"
              size="free-sm"
              type="submit"
              className="h-[44px] min-w-0 w-auto px-6 rounded-lg"
            >
              <Save className="size-4" />
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
