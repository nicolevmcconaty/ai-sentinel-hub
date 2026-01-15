import { cn } from "@/lib/utils";

interface SeverityIndicatorProps {
  level: 1 | 2 | 3 | 4 | 5;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const severityConfig = {
  1: { label: "Very Low", className: "bg-success text-success-foreground", dotClass: "bg-success" },
  2: { label: "Low", className: "bg-primary text-primary-foreground", dotClass: "bg-primary" },
  3: { label: "Medium", className: "bg-warning text-warning-foreground", dotClass: "bg-warning" },
  4: { label: "High", className: "bg-orange-500 text-white", dotClass: "bg-orange-500" },
  5: { label: "Critical", className: "bg-critical text-critical-foreground", dotClass: "bg-critical" },
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

export function SeverityIndicator({ level, showLabel = true, size = "sm" }: SeverityIndicatorProps) {
  const config = severityConfig[level];

  if (!showLabel) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full",
              i <= level ? config.dotClass : "bg-muted"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium",
        config.className,
        sizeStyles[size]
      )}
    >
      {config.label}
    </span>
  );
}
