import { cn } from "@/lib/utils";
import type { IncidentStatus } from "@/types/incident";

type BadgeProps = {
  children: React.ReactNode;
  status: IncidentStatus;
};

const badgeVariants: Record<IncidentStatus, string> = {
  open: "bg-[var(--badge-open-bg)] text-[var(--badge-open-text)]",
  in_progress:
    "bg-[var(--badge-progress-bg)] text-[var(--badge-progress-text)]",
  resolved: "bg-[var(--badge-resolved-bg)] text-[var(--badge-resolved-text)]",
};

export function Badge({ children, status }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        badgeVariants[status],
      )}
    >
      {children}
    </span>
  );
}
