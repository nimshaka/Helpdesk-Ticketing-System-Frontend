"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserList from "@/components/users/UserList";
import { mockUsers } from "@/mock/users";
import type { UserRole } from "@/types";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [role] = useState<UserRole>("admin");

  return (
    <DashboardLayout currentRole={role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Manage agents, administrators, and customer accounts with role permissions.
          </p>
        </div>

        <UserList
          users={mockUsers}
          total={mockUsers.length}
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  );
}
