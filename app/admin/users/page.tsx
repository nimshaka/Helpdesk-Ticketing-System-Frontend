'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/shared/DataTable';
import DataCard from '@/components/shared/DataCard';
import SearchInput from '@/components/shared/SearchInput';
import Dropdown from '@/components/shared/Dropdown';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import CustomModal from '@/components/shared/Modal';
import Input from '@/components/shared/Input';
import Checkbox from '@/components/shared/Checkbox';
import { RoleBadge, StatusBadge } from '@/features/users/components/UserBadge';
import { useSessionStore } from '@/stores/session-store';
import { useMockDbStore } from '@/stores/mock-db-store';
import { createUserApi, updateUserApi } from '@/features/users/api';
import { formatDateTime } from '@/features/tickets/utils';
import { toast } from '@/lib/toast/toastService';
import type { TableColumn } from '@/components/shared/DataTable';
import type { User, UserRole } from '@/types';
import { Plus, Pencil, UserCheck, UserX } from 'lucide-react';

const ROLE_FILTER_ITEMS = [
  { label: 'All Roles', value: '' },
  { label: 'Admin', value: 'admin' },
  { label: 'Agent', value: 'agent' },
  { label: 'Customer', value: 'customer' },
];

const STATUS_FILTER_ITEMS = [
  { label: 'All Statuses', value: '' },
  { label: 'Active Only', value: 'active' },
  { label: 'Inactive Only', value: 'inactive' },
];

const ROLE_OPTIONS = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Support Agent', value: 'agent' },
  { label: 'Customer', value: 'customer' },
];

export default function AdminUsersPage() {
  const currentUser = useSessionStore((state) => state.user);
  const users = useMockDbStore((state) => state.users);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Dialog states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('agent');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  const [confirmToggleUser, setConfirmToggleUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (search) {
        const query = search.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(query);
        const matchesEmail = u.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }
      if (roleFilter && u.role !== roleFilter) return false;
      if (statusFilter === 'active' && !u.is_active) return false;
      if (statusFilter === 'inactive' && u.is_active) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('agent');
    setFormIsActive(true);
    setFormError('');
    setUserModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormIsActive(u.is_active);
    setFormError('');
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim() || !formEmail.trim()) {
      setFormError('Name and email are required.');
      return;
    }

    if (editingUser) {
      // Protection: admin cannot change role of their own account
      if (editingUser.id === currentUser?.id && formRole !== 'admin') {
        setFormError('You cannot remove your own admin privileges.');
        return;
      }

      const res = await updateUserApi(
        editingUser.id,
        { name: formName.trim(), email: formEmail.trim(), role: formRole, is_active: formIsActive },
        currentUser?.id || 0
      );

      if (!res.success) {
        setFormError(res.message || 'Failed to update user.');
        return;
      }

      toast.success(`User ${formName} updated successfully.`);
    } else {
      await createUserApi({
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        is_active: formIsActive,
      });
      toast.success(`New user ${formName} created.`);
    }

    setUserModalOpen(false);
  };

  const handleToggleActive = async () => {
    if (!confirmToggleUser || !currentUser) return;

    if (confirmToggleUser.id === currentUser.id) {
      toast.error('You cannot deactivate your own admin account.');
      setConfirmToggleUser(null);
      return;
    }

    const nextState = !confirmToggleUser.is_active;
    const res = await updateUserApi(
      confirmToggleUser.id,
      { is_active: nextState },
      currentUser.id
    );

    if (res.success) {
      toast.success(`User ${confirmToggleUser.name} is now ${nextState ? 'Active' : 'Deactivated'}.`);
    } else {
      toast.error(res.message || 'Operation failed.');
    }

    setConfirmToggleUser(null);
  };

  const isSelf = (rowUser: User) => rowUser.id === currentUser?.id;

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (_, row) => (
        <div>
          <div className="font-medium text-foreground flex items-center gap-1.5">
            <span>{row.name}</span>
            {isSelf(row) && (
              <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 text-[10px] font-bold">
                You
              </span>
            )}
          </div>
          <div className="text-xs text-foreground-muted">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (_, row) => <RoleBadge role={row.role} />,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (_, row) => <StatusBadge isActive={row.is_active} />,
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (_, row) => (
        <span className="text-xs text-foreground-muted">
          {formatDateTime(row.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      alignment: 'right',
      render: (_, row) => {
        const self = isSelf(row);
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => openEditModal(row)}
              className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground-secondary hover:border-primary hover:text-primary transition-colors cursor-pointer"
              title="Edit User"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              disabled={self}
              onClick={() => setConfirmToggleUser(row)}
              className={`flex size-8 items-center justify-center rounded-lg border transition-colors ${
                self
                  ? 'cursor-not-allowed opacity-30 border-border text-foreground-muted'
                  : row.is_active
                  ? 'cursor-pointer border-border text-foreground-secondary hover:border-error hover:text-error'
                  : 'cursor-pointer border-border text-foreground-secondary hover:border-success hover:text-success'
              }`}
              title={self ? 'You cannot deactivate your own account' : row.is_active ? 'Deactivate user' : 'Activate user'}
            >
              {row.is_active ? <UserX className="size-3.5" /> : <UserCheck className="size-3.5" />}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
            <p className="mt-1 text-sm text-foreground-secondary">
              Manage permissions, roles, and account access across staff agents and customer accounts.
            </p>
          </div>
          <Button
            variant="primary"
            size="free-sm"
            className="h-[44px] min-w-0 w-auto px-5 rounded-xl"
            onClick={openCreateModal}
          >
            <Plus className="size-4" />
            Add New User
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder="Search by name or email..."
            className="flex-1 min-w-[220px]"
          />
          <div className="w-40">
            <Dropdown
              items={ROLE_FILTER_ITEMS}
              value={roleFilter}
              onChange={(val) => { setRoleFilter(val); setPage(1); }}
              placeholder="All Roles"
            />
          </div>
          <div className="w-40">
            <Dropdown
              items={STATUS_FILTER_ITEMS}
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
              placeholder="All Statuses"
            />
          </div>
        </div>

        {/* Responsive: DataCard on mobile (< lg), DataTable on desktop (>= lg) */}
        {filtered.length === 0 ? (
          <EmptyState
            illustration="no-results"
            title="No users match your filters"
            description="Try clearing your search query or role/status filters."
          />
        ) : (
          <>
            <div className="block lg:hidden">
              <DataCard<User>
                data={paginatedData}
                columns={columns}
                rowKey={(row) => row.id}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                showPagination={totalPages > 1}
                count={filtered.length}
              />
            </div>
            <div className="hidden lg:block">
              <DataTable<User>
                data={paginatedData}
                columns={columns}
                rowKey={(row) => row.id}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                count={filtered.length}
              />
            </div>
          </>
        )}
      </div>

      {/* User Create / Edit Modal */}
      <CustomModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        loading={false}
        width={520}
        headerContent={
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {editingUser ? 'Edit User Profile' : 'Add New User'}
            </h2>
            <p className="mt-0.5 text-xs text-foreground-muted">
              {editingUser
                ? `Update account details for ${editingUser.name}`
                : 'Create an administrator, support agent, or customer account'}
            </p>
          </div>
        }
        bodyContent={
          <form onSubmit={handleSaveUser} className="space-y-4 px-6 py-5">
            {formError && (
              <div className="rounded-xl border border-error/30 bg-error-light/50 p-3 text-xs text-error font-medium">
                {formError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground-secondary">
                Full Name <span className="text-error">*</span>
              </label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground-secondary">
                Email Address <span className="text-error">*</span>
              </label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="e.g. alex@helpdesk.test"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground-secondary">
                System Role <span className="text-error">*</span>
              </label>
              <Dropdown
                items={ROLE_OPTIONS}
                value={formRole}
                onChange={(v) => setFormRole(v as UserRole)}
                disabled={Boolean(editingUser && isSelf(editingUser))}
              />
              {editingUser && isSelf(editingUser) && (
                <p className="text-[11px] text-foreground-muted">
                  You cannot change your own administrator role.
                </p>
              )}
            </div>

            <div className="pt-2">
              <Checkbox
                checked={formIsActive}
                onCheckedChange={setFormIsActive}
                disabled={Boolean(editingUser && isSelf(editingUser))}
              >
                Active Account (can log in and be assigned tickets)
              </Checkbox>
              {editingUser && isSelf(editingUser) && (
                <p className="text-[11px] text-foreground-muted mt-1 ml-6">
                  You cannot deactivate your own account.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="secondary"
                size="free-sm"
                type="button"
                className="h-[40px] min-w-0 w-auto px-4 rounded-lg text-sm"
                onClick={() => setUserModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="free-sm"
                type="submit"
                className="h-[40px] min-w-0 w-auto px-5 rounded-lg text-sm"
              >
                {editingUser ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </form>
        }
      />

      {/* Confirmation Dialog for Activate/Deactivate */}
      {confirmToggleUser && (
        <ConfirmDialog
          isOpen={Boolean(confirmToggleUser)}
          onClose={() => setConfirmToggleUser(null)}
          onConfirm={handleToggleActive}
          title={confirmToggleUser.is_active ? 'Deactivate User Account' : 'Activate User Account'}
          message={`Are you sure you want to ${
            confirmToggleUser.is_active ? 'deactivate' : 'activate'
          } ${confirmToggleUser.name} (${confirmToggleUser.email})?`}
          confirmLabel={confirmToggleUser.is_active ? 'Deactivate' : 'Activate'}
          variant={confirmToggleUser.is_active ? 'danger' : 'default'}
        />
      )}
    </DashboardLayout>
  );
}
