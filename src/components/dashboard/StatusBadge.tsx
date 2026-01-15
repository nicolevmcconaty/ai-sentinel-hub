import { cn } from "@/lib/utils";
import { JobStatus } from "@/lib/api";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  running: {
    label: "Running",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  done: {
    label: "Done",
    className: "bg-success/10 text-success border-success/20",
  },
  error: {
    label: "Error",
    className: "bg-critical/10 text-critical border-critical/20",
  },
  skipped: {
    label: "Skipped",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        config.className,
        className
      )}
    >
      {status === "running" && (
        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 animate-pulse-glow" />
      )}
      {config.label}
    </span>
  );
}
