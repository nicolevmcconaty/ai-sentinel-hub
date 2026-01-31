import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  current: number;
  previous: number;
  showValue?: boolean;
  inverted?: boolean; // For metrics where down is good (like errors)
}

export function TrendIndicator({ current, previous, showValue = true, inverted = false }: TrendIndicatorProps) {
  const change = current - previous;
  const changePercent = previous > 0 ? ((change / previous) * 100) : 0;
  
  const isUp = change > 0;
  const isDown = change < 0;
  const isStable = change === 0;
  
  // Determine if the trend is "good" or "bad"
  const isPositive = inverted ? isDown : isUp;
  const isNegative = inverted ? isUp : isDown;

  return (
    <div className={cn(
      "flex items-center gap-1 text-xs",
      isPositive && "text-success",
      isNegative && "text-critical",
      isStable && "text-muted-foreground"
    )}>
      {isUp && <TrendingUp className="w-3 h-3" />}
      {isDown && <TrendingDown className="w-3 h-3" />}
      {isStable && <Minus className="w-3 h-3" />}
      {showValue && (
        <span className="font-medium">
          {changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%
        </span>
      )}
    </div>
  );
}

interface TrendBadgeProps {
  trend: "up" | "down" | "stable";
  changePercent: number;
  inverted?: boolean;
  size?: "sm" | "md";
}

export function TrendBadge({ trend, changePercent, inverted = false, size = "sm" }: TrendBadgeProps) {
  const isPositive = inverted ? trend === "down" : trend === "up";
  const isNegative = inverted ? trend === "up" : trend === "down";

  return (
    <div className={cn(
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
      size === "sm" ? "text-[10px]" : "text-xs",
      isPositive && "bg-success/15 text-success",
      isNegative && "bg-critical/15 text-critical",
      trend === "stable" && "bg-muted text-muted-foreground"
    )}>
      {trend === "up" && <TrendingUp className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />}
      {trend === "down" && <TrendingDown className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />}
      {trend === "stable" && <Minus className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />}
      <span>{changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%</span>
    </div>
  );
}
