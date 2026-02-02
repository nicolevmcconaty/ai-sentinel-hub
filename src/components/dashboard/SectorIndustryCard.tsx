import { Card } from "@/components/ui/card";
import { Building2, Briefcase, Heart, TrendingUp, TrendingDown, Minus, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { IndustryDistribution } from "@/lib/api";

interface IndustryData {
  name: string;
  count: number;
  previousCount: number;
  sector: "public" | "private" | "nonprofit";
}

interface SectorIndustryCardProps {
  industries: IndustryDistribution;
  previousIndustries?: IndustryDistribution;
  isLoading?: boolean;
  onIndustryClick?: (industry: string, sector: "public" | "private" | "nonprofit") => void;
}

const sectorConfig = {
  private: { 
    label: "Private Sector", 
    icon: Briefcase, 
    color: "text-primary", 
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30"
  },
  public: { 
    label: "Public Sector", 
    icon: Building2, 
    color: "text-warning", 
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30"
  },
  nonprofit: { 
    label: "Non-Profit Sector", 
    icon: Heart, 
    color: "text-success", 
    bgColor: "bg-success/10",
    borderColor: "border-success/30"
  },
};

export function SectorIndustryCard({ 
  industries, 
  previousIndustries,
  isLoading,
  onIndustryClick 
}: SectorIndustryCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Calculate sector totals
  const sectorTotals = {
    private: Object.values(industries.private).reduce((a, b) => a + b, 0),
    public: Object.values(industries.public).reduce((a, b) => a + b, 0),
    nonprofit: Object.values(industries.nonprofit).reduce((a, b) => a + b, 0),
  };

  const previousSectorTotals = previousIndustries ? {
    private: Object.values(previousIndustries.private).reduce((a, b) => a + b, 0),
    public: Object.values(previousIndustries.public).reduce((a, b) => a + b, 0),
    nonprofit: Object.values(previousIndustries.nonprofit).reduce((a, b) => a + b, 0),
  } : sectorTotals;

  const grandTotal = sectorTotals.private + sectorTotals.public + sectorTotals.nonprofit;

  // Get top industries per sector
  const getTopIndustries = (sector: "public" | "private" | "nonprofit", limit = 5): IndustryData[] => {
    const sectorData = industries[sector];
    const previousSectorData = previousIndustries?.[sector] || sectorData;
    
    return Object.entries(sectorData)
      .map(([name, count]) => ({
        name,
        count: count as number,
        previousCount: (previousSectorData[name] as number) || count as number,
        sector,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  const getTrend = (current: number, previous: number) => {
    if (current === previous) return { Icon: Minus, color: "text-muted-foreground" };
    return {
      Icon: current > previous ? TrendingUp : TrendingDown,
      color: current > previous ? "text-critical" : "text-success"
    };
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Sector & Industry Analysis
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{grandTotal.toLocaleString()}</span> articles
        </span>
      </div>

      {/* Sector Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["private", "public", "nonprofit"] as const).map((sector) => {
          const config = sectorConfig[sector];
          const SectorIcon = config.icon;
          const total = sectorTotals[sector];
          const previousTotal = previousSectorTotals[sector];
          const trend = getTrend(total, previousTotal);
          const percentage = grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(0) : "0";

          return (
            <div 
              key={sector}
              className={cn(
                "p-4 rounded-lg border transition-all",
                config.borderColor,
                config.bgColor
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <SectorIcon className={cn("w-4 h-4", config.color)} />
                <span className={cn("text-xs font-medium", config.color)}>{config.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground font-mono">{total.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">{percentage}% of total</p>
                </div>
                <trend.Icon className={cn("w-4 h-4", trend.color)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Industries by Sector */}
      <div className="space-y-6">
        {(["private", "public", "nonprofit"] as const).map((sector) => {
          const config = sectorConfig[sector];
          const topIndustries = getTopIndustries(sector, 4);
          const maxCount = topIndustries[0]?.count || 1;

          return (
            <div key={sector}>
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-2 h-2 rounded-full", config.bgColor.replace('/10', ''))} 
                     style={{ backgroundColor: `hsl(var(--${sector === 'private' ? 'primary' : sector === 'public' ? 'warning' : 'success'}))` }} 
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Top {config.label.split(' ')[0]} Industries
                </span>
              </div>
              <div className="space-y-2">
                {topIndustries.map((industry) => {
                  const trend = getTrend(industry.count, industry.previousCount);
                  const widthPercent = (industry.count / maxCount) * 100;

                  return (
                    <div 
                      key={industry.name}
                      className={cn(
                        "group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-all",
                        onIndustryClick && "cursor-pointer"
                      )}
                      onClick={() => onIndustryClick?.(industry.name, sector)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-foreground truncate pr-2">{industry.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-mono font-semibold text-foreground">
                              {industry.count}
                            </span>
                            <trend.Icon className={cn("w-3 h-3", trend.color)} />
                            <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${widthPercent}%`,
                              backgroundColor: `hsl(var(--${sector === 'private' ? 'primary' : sector === 'public' ? 'warning' : 'success'}))`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-[10px] text-muted-foreground mt-6 pt-4 border-t border-border flex items-center gap-1">
        <ExternalLink className="w-3 h-3" />
        Click any industry for detailed deep dive analysis
      </p>
    </Card>
  );
}