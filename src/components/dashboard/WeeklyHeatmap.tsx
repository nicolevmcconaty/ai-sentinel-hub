import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyHeatmapProps {
  isLoading?: boolean;
}

// Sample heatmap data for 8 weeks (rows) x 7 days (columns)
const generateHeatmapData = () => {
  const weeks: number[][] = [];
  for (let w = 0; w < 8; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      // Generate varied risk counts with some patterns
      const baseValue = 15 + Math.floor(Math.random() * 35);
      // Weekends tend to have lower activity
      const dayModifier = (d === 0 || d === 6) ? 0.6 : 1;
      // Recent weeks have slightly higher activity
      const weekModifier = 0.7 + (w * 0.05);
      week.push(Math.floor(baseValue * dayModifier * weekModifier));
    }
    weeks.push(week);
  }
  return weeks;
};

const heatmapData = generateHeatmapData();
const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

// Get intensity level (0-4) based on value
const getIntensity = (value: number): number => {
  if (value < 15) return 0;
  if (value < 25) return 1;
  if (value < 35) return 2;
  if (value < 45) return 3;
  return 4;
};

const intensityColors = [
  "bg-muted",
  "bg-success/30",
  "bg-warning/40",
  "bg-orange-500/50",
  "bg-critical/60",
];

export function WeeklyHeatmap({ isLoading }: WeeklyHeatmapProps) {
  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <Skeleton className="h-5 w-48 mb-4" />
        <Skeleton className="h-48 w-full" />
      </Card>
    );
  }

  // Calculate totals
  const weekTotals = heatmapData.map(week => week.reduce((a, b) => a + b, 0));
  const maxWeekTotal = Math.max(...weekTotals);
  const totalRisks = weekTotals.reduce((a, b) => a + b, 0);
  const avgPerWeek = Math.round(totalRisks / heatmapData.length);

  // Get week labels (most recent first)
  const getWeekLabel = (index: number): string => {
    if (index === 0) return "This Week";
    if (index === 1) return "Last Week";
    return `${index + 1} weeks ago`;
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Weekly Risk Activity
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Avg: <span className="font-semibold text-foreground">{avgPerWeek}/week</span></span>
          <span>Total: <span className="font-semibold text-foreground">{totalRisks}</span></span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-2">
        {/* Day headers */}
        <div className="flex items-center gap-1 pl-24">
          {dayLabels.map((day, i) => (
            <div key={i} className="w-8 text-center text-[10px] text-muted-foreground font-medium">
              {day}
            </div>
          ))}
          <div className="w-16 text-right text-[10px] text-muted-foreground font-medium ml-2">
            Total
          </div>
        </div>

        {/* Heatmap rows (most recent at top) */}
        {heatmapData.slice().reverse().map((week, weekIndex) => {
          const actualIndex = heatmapData.length - 1 - weekIndex;
          const weekTotal = weekTotals[actualIndex];
          
          return (
            <div key={weekIndex} className="flex items-center gap-1">
              <div className="w-24 text-xs text-muted-foreground truncate pr-2">
                {getWeekLabel(weekIndex)}
              </div>
              {week.map((value, dayIndex) => {
                const intensity = getIntensity(value);
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "w-8 h-8 rounded-sm flex items-center justify-center text-[10px] font-medium transition-all hover:scale-110 cursor-default",
                      intensityColors[intensity],
                      intensity >= 3 ? "text-white" : "text-foreground/70"
                    )}
                    title={`${value} risks`}
                  >
                    {value}
                  </div>
                );
              })}
              <div className={cn(
                "w-16 text-right text-xs font-mono font-semibold ml-2",
                weekTotal === maxWeekTotal ? "text-critical" : "text-foreground"
              )}>
                {weekTotal}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Less</span>
          {intensityColors.map((color, i) => (
            <div key={i} className={cn("w-4 h-4 rounded-sm", color)} />
          ))}
          <span className="text-[10px] text-muted-foreground">More</span>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Risk activity by day over the past 8 weeks
        </p>
      </div>
    </Card>
  );
}
