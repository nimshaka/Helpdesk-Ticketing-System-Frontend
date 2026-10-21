import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  description?: string;
}

export default function StatCard({ label, value, icon: Icon, colorClass, bgClass, description }: StatCardProps) {
  return (
    <div className="card-hover rounded-xl border border-border bg-card-bg p-5 flex items-start gap-4">
      <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", bgClass)}>
        <Icon className={cn("size-6", colorClass)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground-secondary">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-foreground">{value}</p>
        {description && (
          <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>
        )}
      </div>
    </div>
  );
}