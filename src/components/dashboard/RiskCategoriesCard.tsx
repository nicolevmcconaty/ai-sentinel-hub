import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendBadge } from "./TrendIndicator";
import { RiskCategoryTrend, SecondaryRiskTag, secondaryTagLabels } from "@/lib/api";
import { Layers } from "lucide-react";

interface PrimaryCategoryData {
  name: string;
  value: number;
  color: string;
  tags: SecondaryRiskTag[];
}

interface RiskCategoriesCardProps {
  primaryCategories: PrimaryCategoryData[];
  trendCategories: RiskCategoryTrend[];
  isLoading?: boolean;
}

export function RiskCategoriesCard({ primaryCategories, trendCategories, isLoading }: RiskCategoriesCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  // Sort primary categories by value (high to low)
  const sortedPrimary = [...primaryCategories].sort((a, b) => b.value - a.value);

  const getCategoryTrends = (tags: SecondaryRiskTag[]): RiskCategoryTrend[] => {
    return trendCategories
      .filter(cat => tags.includes(cat.category))
      .sort((a, b) => b.current - a.current);
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
          Risk Categories
        </h3>
      </div>

      <div className="space-y-6">
        {sortedPrimary.map((category) => {
          const total = sortedPrimary.reduce((acc, c) => acc + c.value, 0);
          const percentage = total > 0 ? ((category.value / total) * 100).toFixed(0) : "0";
          const subcategories = getCategoryTrends(category.tags);

          return (
            <div key={category.name} className="space-y-3">
              {/* Primary category header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-sm font-semibold text-foreground">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{percentage}%</span>
                  <span className="text-sm font-mono font-bold text-foreground">{category.value}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${percentage}%`, backgroundColor: category.color }}
                />
              </div>

              {/* Subcategories */}
              <div className="pl-5 space-y-2">
                {subcategories.map((sub) => (
                  <div key={sub.category} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{sub.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-foreground">{sub.current}</span>
                      <TrendBadge 
                        trend={sub.trend} 
                        changePercent={sub.changePercent}
                        inverted={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
