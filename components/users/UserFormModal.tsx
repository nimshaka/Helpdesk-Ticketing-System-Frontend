"use client";

import { useState, useEffect } from "react";
import CustomModal from "@/components/shared/Modal";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Dropdown from "@/components/shared/Dropdown";
import type { DropdownItem } from "@/components/shared/Dropdown";
import Checkbox from "@/components/shared/Checkbox";
import { USER_ROLES } from "@/features/users/constants";
import { getRoleConfig } from "@/features/users/utils";
import type { User, UserRole } from "@/types";

const ROLE_ITEMS: DropdownItem[] = USER_ROLES.map((role) => ({
  label: getRoleConfig(role).label,
  value: role,
}));

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export default function UserFormModal({ isOpen, onClose, user }: UserFormModalProps) {
  const isEditing = Boolean(user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setIsActive(user.is_active);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setRole("customer");
      setIsActive(true);
      setPassword("");
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      loading={false}
      width={560}
      headerContent={
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {isEditing ? "Edit User" : "Create New User"}
          </h2>
          <p className="mt-0.5 text-sm text-foreground-muted">
            {isEditing
              ? "Update account details and role permissions."
              : "Add a new team member or customer to the helpdesk."}
          </p>
        </div>
      }
      bodyContent={
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Full Name <span className="text-error">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Email Address <span className="text-error">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah@example.com"
              required
            />
          </div>

          {!isEditing && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground-secondary">
                Temporary Password <span className="text-error">*</span>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Role <span className="text-error">*</span>
            </label>
            <Dropdown
              items={ROLE_ITEMS}
              value={role}
              onChange={(v) => setRole(v as UserRole)}
              placeholder="Select role"
            />
          </div>

          <div className="pt-1">
            <Checkbox
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked)}
            >
              Active Account (can log in and receive tickets)
            </Checkbox>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              variant="secondary"
              size="free-sm"
              type="button"
              className="h-[42px] min-w-0 w-auto px-5 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="free-sm"
              type="submit"
              className="h-[42px] min-w-0 w-auto px-5 rounded-lg"
            >
              {isEditing ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </form>
      }
    />
  );
}
