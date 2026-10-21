"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import type { UserRole } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentRole?: UserRole;
}

export default function DashboardLayout({ children, currentRole = "admin" }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar currentRole={currentRole} />
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} currentRole={currentRole} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar currentRole={currentRole} onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}