import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendBadge } from "./TrendIndicator";
import { RiskCategoryTrend, secondaryTagLabels, SecondaryRiskTag } from "@/lib/api";

interface CategoryTrendCardProps {
  categories: RiskCategoryTrend[];
  isLoading?: boolean;
  title: string;
  color: string;
}

export function CategoryTrendCard({ categories, isLoading, title, color }: CategoryTrendCardProps) {
  if (isLoading) {
    return (
      <Card className="p-5 bg-card/50 backdrop-blur-sm border-border">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  // Sort categories by current value (high to low)
  const sortedCategories = [...categories].sort((a, b) => b.current - a.current);

  return (
    <Card className="p-5 bg-card/50 backdrop-blur-sm border-border">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h4>
      </div>
      <div className="space-y-3">
        {sortedCategories.map((cat) => (
          <div key={cat.category} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{cat.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-semibold text-foreground">{cat.current}</span>
              <TrendBadge 
                trend={cat.trend} 
                changePercent={cat.changePercent}
                inverted={true}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
