import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendBadge } from "./TrendIndicator";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimePeriodComparison, secondaryTagLabels, SecondaryRiskTag } from "@/lib/api";

interface RiskTrendsChartProps {
  data?: TimePeriodComparison;
  isLoading?: boolean;
  period: "week" | "month";
  onPeriodChange: (period: "week" | "month") => void;
}

export function RiskTrendsChart({ data, isLoading, period, onPeriodChange }: RiskTrendsChartProps) {
  if (isLoading || !data) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  const severityItems = [
    { key: "critical", label: "Critical", data: data.severity.critical, color: "hsl(var(--critical))" },
    { key: "high", label: "High", data: data.severity.high, color: "hsl(25, 95%, 53%)" },
    { key: "medium", label: "Medium", data: data.severity.medium, color: "hsl(var(--warning))" },
    { key: "low", label: "Low", data: data.severity.low, color: "hsl(var(--success))" },
  ];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Risk Trends vs {period === "week" ? "Last Week" : "Last Month"}
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          <button
            onClick={() => onPeriodChange("week")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-all",
              period === "week" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Week
          </button>
          <button
            onClick={() => onPeriodChange("month")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-all",
              period === "month" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Month
          </button>
        </div>
      </div>

      {/* Overall Trend */}
      <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Overall Risk Activity</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{data.overall.current}</span>
              <span className="text-sm text-muted-foreground">vs {data.overall.previous}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <TrendBadge 
              trend={data.overall.trend} 
              changePercent={data.overall.changePercent}
              inverted={true}
              size="md"
            />
            <span className="text-[10px] text-muted-foreground">
              {data.overall.change > 0 ? "+" : ""}{data.overall.change} risks
            </span>
          </div>
        </div>
      </div>

      {/* Severity Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">By Severity</h4>
        {severityItems.map((item) => {
          const maxValue = Math.max(item.data.current, item.data.previous, 1);
          const currentWidth = (item.data.current / maxValue) * 100;
          const previousWidth = (item.data.previous / maxValue) * 100;
          
          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {item.data.current} 
                    <span className="text-[10px] ml-1">
                      (was {item.data.previous})
                    </span>
                  </span>
                  <TrendBadge 
                    trend={item.data.trend} 
                    changePercent={item.data.changePercent}
                    inverted={true}
                  />
                </div>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                {/* Previous period bar (faded) */}
                <div 
                  className="absolute h-full rounded-full opacity-30 transition-all duration-500"
                  style={{ 
                    width: `${previousWidth}%`, 
                    backgroundColor: item.color 
                  }}
                />
                {/* Current period bar */}
                <div 
                  className="absolute h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${currentWidth}%`, 
                    backgroundColor: item.color 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Categories Trend */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">By Primary Category</h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "technical", label: "Technical", data: data.primaryCategories.technical, color: "hsl(var(--primary))" },
            { key: "operational", label: "Operational", data: data.primaryCategories.operational, color: "hsl(var(--warning))" },
            { key: "business", label: "Business", data: data.primaryCategories.business, color: "hsl(280, 70%, 50%)" },
          ].map((cat) => (
            <div key={cat.key} className="text-center p-3 rounded-lg bg-muted/30">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: cat.color }} />
              <p className="text-xs text-muted-foreground">{cat.label}</p>
              <p className="text-lg font-bold text-foreground">{cat.data.current}</p>
              <TrendBadge 
                trend={cat.data.trend} 
                changePercent={cat.data.changePercent}
                inverted={true}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
