import { Card } from "@/components/ui/card";
import { RiskDomain, riskDomainLabels } from "@/lib/api";
import { Network, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainData {
  domain: RiskDomain;
  label: string;
  count: number;
  previousCount: number;
  percentage: number;
}

interface RiskDomainTaxonomyCardProps {
  domains: Record<RiskDomain, number>;
  previousDomains?: Record<RiskDomain, number>;
  isLoading?: boolean;
  onDomainClick?: (domain: RiskDomain) => void;
}

// Updated domain labels matching the spec
const domainDescriptions: Record<RiskDomain, { title: string; description: string; icon: string }> = {
  safety_harm: { 
    title: "Model Development & Technical", 
    description: "Risks in AI model design, development, training",
    icon: "🔧"
  },
  security_threats: { 
    title: "Deployment & Integration", 
    description: "Risks in implementation and system integration",
    icon: "🚀"
  },
  privacy_data: { 
    title: "Data & Privacy", 
    description: "Risks related to data governance, privacy, protection",
    icon: "🔒"
  },
  fairness_bias: { 
    title: "Governance & Compliance", 
    description: "Risks in regulatory compliance and governance",
    icon: "⚖️"
  },
  transparency_accountability: { 
    title: "Operational & Performance", 
    description: "Risks in ongoing operations and performance",
    icon: "⚙️"
  },
  reliability_robustness: { 
    title: "Societal & Ethical", 
    description: "Risks of societal impact and ethical concerns",
    icon: "🌍"
  },
  societal_environmental: { 
    title: "Security & Adversarial", 
    description: "Risks from security threats and adversarial attacks",
    icon: "🛡️"
  },
};

const domainColors: Record<RiskDomain, string> = {
  safety_harm: "hsl(var(--critical))",
  security_threats: "hsl(var(--warning))",
  privacy_data: "hsl(var(--primary))",
  fairness_bias: "hsl(280, 70%, 50%)",
  transparency_accountability: "hsl(200, 70%, 50%)",
  reliability_robustness: "hsl(var(--success))",
  societal_environmental: "hsl(330, 70%, 50%)",
};

export function RiskDomainTaxonomyCard({ 
  domains, 
  previousDomains,
  isLoading,
  onDomainClick 
}: RiskDomainTaxonomyCardProps) {
  const total = Object.values(domains).reduce((a, b) => a + b, 0);
  
  // Prepare domain data sorted by count
  const domainData: DomainData[] = (Object.keys(domains) as RiskDomain[])
    .map(domain => ({
      domain,
      label: domainDescriptions[domain].title,
      count: domains[domain],
      previousCount: previousDomains?.[domain] || domains[domain],
      percentage: total > 0 ? (domains[domain] / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const getTrend = (current: number, previous: number) => {
    if (current === previous) return { icon: Minus, color: "text-muted-foreground", text: "—" };
    const change = current - previous;
    const percent = previous > 0 ? ((change / previous) * 100).toFixed(1) : "N/A";
    return {
      icon: change > 0 ? TrendingUp : TrendingDown,
      color: change > 0 ? "text-critical" : "text-success",
      text: `${change > 0 ? "+" : ""}${change} (${percent}%)`
    };
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Map to Risk Database Taxonomy (7 Domains)
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{total.toLocaleString()}</span>
        </span>
      </div>

      <div className="space-y-2">
        {domainData.map((item, index) => {
          const trend = getTrend(item.count, item.previousCount);
          const TrendIcon = trend.icon;
          
          return (
            <div 
              key={item.domain}
              className={cn(
                "group p-2.5 rounded-lg border border-border/50 hover:border-border transition-all",
                onDomainClick && "cursor-pointer hover:bg-muted/30"
              )}
              onClick={() => onDomainClick?.(item.domain)}
            >
              <div className="flex items-center gap-2">
                {/* Rank */}
                <span className="text-xs text-muted-foreground w-4 shrink-0">{index + 1}</span>
                
                {/* Color indicator */}
                <div 
                  className="w-2 h-8 rounded-full shrink-0" 
                  style={{ backgroundColor: domainColors[item.domain] }}
                />
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {item.percentage.toFixed(1)}%
                      </span>
                      <span className="text-sm font-mono font-semibold text-foreground w-14 text-right">
                        {item.count.toLocaleString()}
                      </span>
                      {previousDomains && (
                        <div className={cn("flex items-center gap-1 w-20 justify-end", trend.color)}>
                          <TrendIcon className="w-3 h-3" />
                          <span className="text-[10px]">{trend.text}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-2 w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: domainColors[item.domain]
                      }}
                    />
                  </div>
                  
                  {/* Description on hover */}
                  <p className="text-[10px] text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {domainDescriptions[item.domain].description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-reference hint */}
      <p className="text-[10px] text-muted-foreground mt-4 pt-4 border-t border-border">
        Click any domain to filter articles by taxonomy classification
      </p>
    </Card>
  );
}