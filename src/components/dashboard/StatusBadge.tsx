import { cn } from "@/lib/utils";
import { JobStatus } from "@/lib/api";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-warning/15 text-warning border-warning/30",
  },
  running: {
    label: "Running",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  done: {
    label: "Done",
    className: "bg-success/15 text-success border-success/30",
  },
  error: {
    label: "Error",
    className: "bg-critical/15 text-critical border-critical/30",
  },
  skipped: {
    label: "Skipped",
    className: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {status === "running" && (
        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 animate-pulse" />
      )}
      {config.label}
    </span>
  );
}
