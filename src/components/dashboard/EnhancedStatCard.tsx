import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MiniSparkline } from "./MiniSparkline";

interface EnhancedStatCardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  icon: ReactNode;
  trend?: "up" | "down" | "stable";
  sparklineData?: number[];
  variant?: "default" | "success" | "warning" | "critical" | "primary";
  subtitle?: string;
  onClick?: () => void;
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

const sparklineColors = {
  default: "hsl(var(--muted-foreground))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  critical: "hsl(var(--critical))",
  primary: "hsl(var(--primary))",
};

export function EnhancedStatCard({ 
  title, 
  value, 
  previousValue,
  change, 
  changePercent,
  icon, 
  trend, 
  sparklineData,
  variant = "default",
  subtitle,
  onClick 
}: EnhancedStatCardProps) {
  const isClickable = !!onClick;
  
  // Determine trend color
  const getTrendColor = () => {
    if (!trend || trend === "stable") return "text-muted-foreground";
    // For most metrics, up is good (green), down is bad (red)
    // Exception: pending queue - down is good
    return trend === "up" ? "text-success" : "text-critical";
  };

  return (
    <Card 
      className={cn(
        "p-5 bg-card/50 backdrop-blur-sm border transition-all duration-300 hover:bg-card",
        variantStyles[variant],
        isClickable && "cursor-pointer hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[11px] truncate">
            {title}
          </p>
          <div className="flex items-end gap-2 mt-2">
            <p className="text-2xl font-bold text-foreground font-mono tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {sparklineData && sparklineData.length > 1 && (
              <MiniSparkline 
                data={sparklineData} 
                color={sparklineColors[variant]} 
                height={20}
                width={40}
              />
            )}
          </div>
          
          {/* Change indicator */}
          {(change !== undefined || changePercent !== undefined) && trend && (
            <div className={cn("flex items-center gap-1.5 mt-2", getTrendColor())}>
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              <span className="text-[10px] font-medium">
                {changePercent !== undefined && (
                  <>{changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%</>
                )}
                {change !== undefined && changePercent !== undefined && " · "}
                {change !== undefined && (
                  <>{change > 0 ? "+" : ""}{change}</>
                )}
              </span>
            </div>
          )}
          
          {/* Subtitle / previous value */}
          {subtitle && (
            <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>
          )}
          {previousValue !== undefined && !subtitle && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Previous: {previousValue.toLocaleString()}
            </p>
          )}
        </div>
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ml-3",
          iconVariantStyles[variant]
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
}