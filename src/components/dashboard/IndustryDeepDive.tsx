import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, Briefcase, Heart, TrendingUp, TrendingDown, Minus, 
  AlertTriangle, Shield, FileText, Target, BarChart3, Calendar,
  ChevronRight, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface IndustryDeepDiveProps {
  isOpen: boolean;
  onClose: () => void;
  industry: string;
  sector: "public" | "private" | "nonprofit";
}

// Sample data for deep dive - would come from API in real implementation
const generateIndustryData = (industry: string) => ({
  overview: {
    totalArticles: Math.floor(Math.random() * 400) + 100,
    ranking: Math.floor(Math.random() * 15) + 1,
    riskScore: Math.floor(Math.random() * 30) + 60,
    riskLevel: "Medium-High",
    changePercent: (Math.random() * 20 - 10).toFixed(1),
  },
  severityProfile: [
    { name: "Low", value: Math.floor(Math.random() * 100) + 50, color: "hsl(160, 84%, 39%)" },
    { name: "Medium", value: Math.floor(Math.random() * 80) + 40, color: "hsl(38, 92%, 50%)" },
    { name: "High", value: Math.floor(Math.random() * 40) + 20, color: "hsl(25, 95%, 53%)" },
    { name: "Critical", value: Math.floor(Math.random() * 20) + 5, color: "hsl(0, 72%, 51%)" },
  ],
  crossIndustryAvg: {
    low: 45,
    medium: 35,
    high: 15,
    critical: 5,
  },
  topRisks: [
    { name: "Security Risk", count: Math.floor(Math.random() * 80) + 30, trend: "up" as const },
    { name: "Compliance/Regulatory Risk", count: Math.floor(Math.random() * 60) + 20, trend: "up" as const },
    { name: "Privacy Risk", count: Math.floor(Math.random() * 50) + 15, trend: "down" as const },
    { name: "Data Risk", count: Math.floor(Math.random() * 40) + 10, trend: "stable" as const },
    { name: "Operational Risk", count: Math.floor(Math.random() * 30) + 5, trend: "up" as const },
  ],
  timeline: Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    articles: Math.floor(Math.random() * 50) + 20,
  })),
  domains: [
    { name: "Data & Privacy", percentage: 28 },
    { name: "Security & Adversarial", percentage: 24 },
    { name: "Governance & Compliance", percentage: 18 },
    { name: "Operational & Performance", percentage: 15 },
    { name: "Model Development", percentage: 10 },
    { name: "Societal & Ethical", percentage: 5 },
  ],
  insights: [
    `${industry} shows elevated security risks compared to industry average, primarily driven by increased cyber threat activity.`,
    `Compliance and regulatory risks are trending upward, likely due to new AI governance regulations affecting this sector.`,
    `Privacy concerns remain a significant factor, with data protection incidents accounting for 18% of identified risks.`,
  ],
});

const sectorConfig = {
  private: { label: "Private Sector", icon: Briefcase, color: "text-primary", bgColor: "bg-primary/10" },
  public: { label: "Public Sector", icon: Building2, color: "text-warning", bgColor: "bg-warning/10" },
  nonprofit: { label: "Non-Profit", icon: Heart, color: "text-success", bgColor: "bg-success/10" },
};

export function IndustryDeepDive({ isOpen, onClose, industry, sector }: IndustryDeepDiveProps) {
  const config = sectorConfig[sector];
  const SectorIcon = config.icon;
  const data = generateIndustryData(industry);

  const totalSeverity = data.severityProfile.reduce((a, b) => a + b.value, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 bg-background border-border">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("gap-1", config.color, config.bgColor)}>
                  <SectorIcon className="w-3 h-3" />
                  {config.label}
                </Badge>
              </div>
              <SheetTitle className="text-2xl font-bold text-foreground">{industry}</SheetTitle>
              <SheetDescription>
                Comprehensive risk profile and analysis for this industry
              </SheetDescription>
            </SheetHeader>

            {/* Overview Card */}
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm uppercase tracking-wider">Industry Overview</h4>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Articles</p>
                  <p className="text-xl font-bold font-mono text-foreground">{data.overview.totalArticles}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Industry Ranking</p>
                  <p className="text-xl font-bold font-mono text-foreground">#{data.overview.ranking}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <p className={cn(
                    "text-xl font-bold font-mono",
                    data.overview.riskScore >= 70 ? "text-critical" : data.overview.riskScore >= 50 ? "text-warning" : "text-success"
                  )}>
                    {data.overview.riskScore}/100
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Period Change</p>
                  <div className="flex items-center gap-1">
                    {parseFloat(data.overview.changePercent) > 0 ? (
                      <TrendingUp className="w-4 h-4 text-critical" />
                    ) : parseFloat(data.overview.changePercent) < 0 ? (
                      <TrendingDown className="w-4 h-4 text-success" />
                    ) : (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={cn(
                      "text-xl font-bold font-mono",
                      parseFloat(data.overview.changePercent) > 0 ? "text-critical" : "text-success"
                    )}>
                      {data.overview.changePercent}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Severity Profile */}
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <h4 className="font-semibold text-sm uppercase tracking-wider">Severity Profile</h4>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-32 w-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.severityProfile}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {data.severityProfile.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {data.severityProfile.map((item) => {
                    const percentage = totalSeverity > 0 ? ((item.value / totalSeverity) * 100).toFixed(0) : "0";
                    return (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-foreground">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{percentage}%</span>
                          <span className="text-sm font-mono text-foreground w-8 text-right">{item.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Top Risk Categories */}
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm uppercase tracking-wider">Top Risk Categories</h4>
              </div>
              <div className="space-y-3">
                {data.topRisks.map((risk, index) => {
                  const TrendIcon = risk.trend === "up" ? TrendingUp : risk.trend === "down" ? TrendingDown : Minus;
                  const trendColor = risk.trend === "up" ? "text-critical" : risk.trend === "down" ? "text-success" : "text-muted-foreground";
                  const maxCount = data.topRisks[0].count;
                  
                  return (
                    <div key={risk.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-foreground">{risk.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-semibold text-foreground">{risk.count}</span>
                            <TrendIcon className={cn("w-3 h-3", trendColor)} />
                          </div>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(risk.count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm uppercase tracking-wider">12-Month Timeline</h4>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.timeline}>
                    <defs>
                      <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="articles" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorArticles)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Domain Distribution */}
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm uppercase tracking-wider">Domain Distribution</h4>
              </div>
              <div className="space-y-2">
                {data.domains.map((domain) => (
                  <div key={domain.name} className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-40 truncate">{domain.name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${domain.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{domain.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm uppercase tracking-wider">Industry Insights</h4>
              </div>
              <div className="space-y-3">
                {data.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}