import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RiskCategoryTrend, SecondaryRiskTag, secondaryTagLabels } from "@/lib/api";
import { Layers, ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrimaryCategoryData {
  name: string;
  value: number;
  previousValue?: number;
  color: string;
  tags: SecondaryRiskTag[];
}

interface ExpandableRiskCategoriesCardProps {
  primaryCategories: PrimaryCategoryData[];
  trendCategories: RiskCategoryTrend[];
  isLoading?: boolean;
  onCategoryClick?: (category: SecondaryRiskTag) => void;
}

export function ExpandableRiskCategoriesCard({ 
  primaryCategories, 
  trendCategories, 
  isLoading,
  onCategoryClick 
}: ExpandableRiskCategoriesCardProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Technical"]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 bg-muted rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </div>
      </Card>
    );
  }

  // Sort primary categories by value (high to low)
  const sortedPrimary = [...primaryCategories].sort((a, b) => b.value - a.value);
  const total = sortedPrimary.reduce((acc, c) => acc + c.value, 0);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const getCategoryTrends = (tags: SecondaryRiskTag[]): RiskCategoryTrend[] => {
    return trendCategories
      .filter(cat => tags.includes(cat.category))
      .sort((a, b) => b.current - a.current);
  };

  const getTrendIndicator = (trend: "up" | "down" | "stable", changePercent: number) => {
    if (trend === "stable") {
      return { Icon: Minus, color: "text-muted-foreground", text: "—" };
    }
    return {
      Icon: trend === "up" ? TrendingUp : TrendingDown,
      color: trend === "up" ? "text-critical" : "text-success",
      text: `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`
    };
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Top Risk Categories
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Sorted High → Low
        </span>
      </div>

      <div className="space-y-3">
        {sortedPrimary.map((category) => {
          const percentage = total > 0 ? ((category.value / total) * 100) : 0;
          const subcategories = getCategoryTrends(category.tags);
          const isExpanded = expandedCategories.includes(category.name);

          return (
            <div key={category.name} className="border border-border/50 rounded-lg overflow-hidden">
              {/* Primary category header - clickable to expand */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleCategory(category.name)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                  <div>
                    <span className="text-sm font-semibold text-foreground">{category.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {subcategories.length} subcategories
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
                  <span className="text-sm font-mono font-bold text-foreground w-14 text-right">
                    {category.value.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-4 pb-2">
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%`, backgroundColor: category.color }}
                  />
                </div>
              </div>

              {/* Subcategories - expandable */}
              {isExpanded && (
                <div className="border-t border-border/50 bg-muted/10">
                  {subcategories.map((sub) => {
                    const trendInfo = getTrendIndicator(sub.trend, sub.changePercent);
                    const subPercentage = category.value > 0 
                      ? ((sub.current / category.value) * 100).toFixed(0) 
                      : "0";

                    return (
                      <div 
                        key={sub.category}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 border-b border-border/30 last:border-b-0",
                          "hover:bg-muted/20 transition-colors",
                          onCategoryClick && "cursor-pointer"
                        )}
                        onClick={() => onCategoryClick?.(sub.category)}
                      >
                        <div className="flex items-center gap-3 pl-7">
                          <div 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ backgroundColor: category.color, opacity: 0.6 }}
                          />
                          <span className="text-sm text-muted-foreground">{sub.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground">{subPercentage}%</span>
                          <span className="text-sm font-mono text-foreground w-12 text-right">
                            {sub.current.toLocaleString()}
                          </span>
                          <div className={cn("flex items-center gap-1 w-16 justify-end", trendInfo.color)}>
                            <trendInfo.Icon className="w-3 h-3" />
                            <span className="text-[10px]">{trendInfo.text}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <p className="text-[10px] text-muted-foreground mt-4 pt-4 border-t border-border">
        Click to expand/collapse categories. Click subcategories to filter.
      </p>
    </Card>
  );
}