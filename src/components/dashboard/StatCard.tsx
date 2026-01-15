import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  trend?: "up" | "down";
  variant?: "default" | "success" | "warning" | "critical" | "primary";
}

const variantStyles = {
  default: "border-border hover:border-muted-foreground/30",
  success: "border-success/30 glow-success",
  warning: "border-warning/30 glow-warning",
  critical: "border-critical/30 glow-critical",
  primary: "border-primary/30 glow-primary",
};

const iconVariantStyles = {
  default: "text-muted-foreground bg-muted/50",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  critical: "text-critical bg-critical/10",
  primary: "text-primary bg-primary/10",
};

export function StatCard({ title, value, change, icon, trend, variant = "default" }: StatCardProps) {
  return (
    <Card className={cn(
      "p-5 bg-card/50 backdrop-blur-sm border transition-all duration-300 hover:bg-card",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[11px]">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground mt-2 font-mono tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-sm mt-2",
              trend === "up" ? "text-success" : "text-critical"
            )}>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">{change > 0 ? "+" : ""}{change}%</span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center",
          iconVariantStyles[variant]
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
