"use client";

import { useState } from "react";
import type { TableColumn } from "@/components/shared/DataTable";
import DataTable from "@/components/shared/DataTable";
import DataCard from "@/components/shared/DataCard";
import SearchInput from "@/components/shared/SearchInput";
import Button from "@/components/shared/Button";
import Dropdown from "@/components/shared/Dropdown";
import type { DropdownItem } from "@/components/shared/Dropdown";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { RoleBadge, StatusBadge } from "@/components/users/UserBadge";
import type { User, UserRole } from "@/types";
import { formatDate } from "@/features/tickets/utils";
import { USER_ROLES } from "@/features/users/constants";
import { getRoleConfig } from "@/features/users/utils";
import { Plus, Pencil, UserCheck, UserX } from "lucide-react";
import UserFormModal from "@/components/users/UserFormModal";

const ROLE_FILTER_ITEMS: DropdownItem[] = [
  { label: "All Roles", value: "" },
  ...USER_ROLES.map((r) => ({ label: getRoleConfig(r).label, value: r })),
];

const STATUS_FILTER_ITEMS: DropdownItem[] = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

interface UserListProps {
  users: User[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function UserList({ users, total, currentPage, totalPages, onPageChange }: UserListProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmUser, setConfirmUser] = useState<{ user: User; action: "activate" | "deactivate" } | null>(null);

  const isFiltered = Boolean(search || roleFilter || statusFilter);

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (statusFilter === "active" && !u.is_active) return false;
    if (statusFilter === "inactive" && u.is_active) return false;
    return true;
  });

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-medium text-foreground">{row.name}</div>
          <div className="text-xs text-foreground-muted">{row.email}</div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (_, row) => <RoleBadge role={row.role} />,
    },
    {
      key: "is_active",
      label: "Status",
      render: (_, row) => <StatusBadge isActive={row.is_active} />,
    },
    {
      key: "created_at",
      label: "Joined",
      render: (_, row) => <span className="text-sm text-foreground-secondary">{formatDate(row.created_at)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      alignment: "right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setEditUser(row); }}
            className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground-secondary transition-colors hover:border-primary hover:text-primary"
            aria-label="Edit user"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setConfirmUser({ user: row, action: row.is_active ? "deactivate" : "activate" }); }}
            className={`flex size-8 items-center justify-center rounded-lg border transition-colors ${
              row.is_active
                ? "border-border text-foreground-secondary hover:border-error hover:text-error"
                : "border-border text-foreground-secondary hover:border-success hover:text-success"
            }`}
            aria-label={row.is_active ? "Deactivate user" : "Activate user"}
          >
            {row.is_active ? <UserX className="size-3.5" /> : <UserCheck className="size-3.5" />}
          </button>
        </div>
      ),
    },
  ];

  const pagination = {
    currentPage,
    totalPages,
    onPageChange,
    showPagination: totalPages > 1,
  };

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search users..."
          className="flex-1 min-w-[200px]"
        />
        <div className="w-40">
          <Dropdown
            items={ROLE_FILTER_ITEMS}
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="All Roles"
          />
        </div>
        <div className="w-36">
          <Dropdown
            items={STATUS_FILTER_ITEMS}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
          />
        </div>
        <Button
          variant="primary"
          size="free-sm"
          className="h-[44px] min-w-0 w-auto px-4 rounded-lg"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="size-4" />
          Add User
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          illustration={isFiltered ? "no-results" : "no-customers"}
          title={isFiltered ? "No users match your search" : "No users yet"}
          description={isFiltered ? "Try different filters." : "Add users to get started."}
          action={!isFiltered ? { label: "Add User", onClick: () => setCreateOpen(true) } : undefined}
        />
      ) : (
        <>
          {/* Mobile: DataCard */}
          <div className="block lg:hidden">
            <DataCard<User>
              data={filtered}
              columns={columns}
              rowKey={(row) => row.id}
              {...pagination}
              count={filtered.length}
              isFiltered={isFiltered}
            />
          </div>

          {/* Desktop: DataTable */}
          <div className="hidden lg:block">
            <DataTable<User>
              data={filtered}
              columns={columns}
              rowKey={(row) => row.id}
              {...pagination}
              count={filtered.length}
              isFiltered={isFiltered}
            />
          </div>
        </>
      )}

      {/* Modals */}
      <UserFormModal
        isOpen={createOpen || !!editUser}
        onClose={() => { setCreateOpen(false); setEditUser(null); }}
        user={editUser}
      />

      {confirmUser && (
        <ConfirmDialog
          isOpen
          onClose={() => setConfirmUser(null)}
          onConfirm={() => setConfirmUser(null)}
          title={confirmUser.action === "deactivate" ? "Deactivate User" : "Activate User"}
          message={`Are you sure you want to ${confirmUser.action} ${confirmUser.user.name}?`}
          confirmLabel={confirmUser.action === "deactivate" ? "Deactivate" : "Activate"}
          variant={confirmUser.action === "deactivate" ? "danger" : "default"}
        />
      )}
    </>
  );
}