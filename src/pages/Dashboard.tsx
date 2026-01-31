import { useState } from "react";
import { FileText, Shield, CheckCircle, Clock, Zap, Activity, Building2, Briefcase, Heart, TrendingUp, Target, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RiskTrendsChart } from "@/components/dashboard/RiskTrendsChart";
import { CategoryTrendCard } from "@/components/dashboard/CategoryTrendCard";
import { useDashboardData, useTimePeriodComparison } from "@/hooks/use-dashboard-data";
import { secondaryTagLabels, SecondaryRiskTag, RiskCategoryTrend } from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const [trendPeriod, setTrendPeriod] = useState<"week" | "month">("week");
  
  const { 
    dashboardSummary, 
    jobsSummary, 
    riskCategories, 
    industries, 
    confidence,
    isLoading,
    isError,
    isUsingMockData,
    refetch 
  } = useDashboardData();
  
  const { 
    data: trendData, 
  } = useTimePeriodComparison(trendPeriod);

  // Prepare severity data for pie chart
  const severityData = jobsSummary ? [
    { name: "Low", value: (jobsSummary.severity_distribution["1"] || 0) + (jobsSummary.severity_distribution["2"] || 0), color: "hsl(var(--success))" },
    { name: "Medium", value: jobsSummary.severity_distribution["3"] || 0, color: "hsl(var(--warning))" },
    { name: "High", value: jobsSummary.severity_distribution["4"] || 0, color: "hsl(25, 95%, 53%)" },
    { name: "Critical", value: jobsSummary.severity_distribution["5"] || 0, color: "hsl(var(--critical))" },
  ] : [];

  const totalSeverity = severityData.reduce((acc, item) => acc + item.value, 0);

  // Prepare primary category data (sorted high to low)
  const primaryCategoryData = riskCategories ? [
    { name: "Technical Risks", value: riskCategories.primary.technical, color: "hsl(var(--primary))", description: "Infrastructure, systems, technology reliability" },
    { name: "Operational Risks", value: riskCategories.primary.operational, color: "hsl(var(--warning))", description: "Day-to-day operations, processes, workflows" },
    { name: "Business Risks", value: riskCategories.primary.business, color: "hsl(280, 70%, 50%)", description: "Strategic decisions, financial impact, positioning" },
  ].sort((a, b) => b.value - a.value) : [];

  // Prepare secondary tags for each category (sorted by value)
  const technicalTags: SecondaryRiskTag[] = ["security_risk", "privacy_risk", "technical_performance_risk", "data_risk"];
  const operationalTags: SecondaryRiskTag[] = ["compliance_regulatory_risk", "legal_liability_risk", "third_party_vendor_risk"];
  const businessTags: SecondaryRiskTag[] = ["business_financial_risk", "reputational_risk", "ethical_risk", "strategic_risk"];

  const getTrendCategories = (tags: SecondaryRiskTag[]): RiskCategoryTrend[] => {
    if (!trendData?.categories) {
      // Fallback to current data only
      return tags.map(tag => ({
        category: tag,
        label: secondaryTagLabels[tag],
        current: riskCategories?.secondary[tag] || 0,
        previous: 0,
        change: 0,
        changePercent: 0,
        trend: "stable" as const,
      })).sort((a, b) => b.current - a.current);
    }
    return trendData.categories
      .filter(cat => tags.includes(cat.category))
      .sort((a, b) => b.current - a.current);
  };

  // Top industries
  const topIndustries = industries ? [
    ...Object.entries(industries.private).slice(0, 3).map(([name, count]) => ({ name, count: count as number, sector: "Private" })),
    ...Object.entries(industries.public).slice(0, 2).map(([name, count]) => ({ name, count: count as number, sector: "Public" })),
  ].sort((a, b) => b.count - a.count).slice(0, 5) : [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mock Data Banner */}
      {isUsingMockData && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-warning" />
            <span className="text-sm text-warning">Preview Mode: Showing sample data. Connect to your FastAPI backend to see live data.</span>
          </div>
          <Button onClick={() => refetch()} variant="ghost" size="sm" className="text-warning hover:text-warning gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </Button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">AI Risk Intelligence Platform Overview</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Platform Metrics Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Platform Metrics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Articles Ingested"
            value={dashboardSummary?.totals.articles.toLocaleString() || "0"}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Risks Mapped"
            value={dashboardSummary?.totals.risks.toLocaleString() || "0"}
            icon={<Shield className="w-5 h-5" />}
            variant="warning"
          />
          <StatCard
            title="Success Rate"
            value={`${jobsSummary?.success_rate || 0}%`}
            icon={<CheckCircle className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="24h Activity"
            value={jobsSummary?.recent_activity.last_24h || 0}
            icon={<Activity className="w-5 h-5" />}
          />
          <StatCard
            title="Avg Processing"
            value={`${jobsSummary?.avg_processing_time_seconds || 0}s`}
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            title="Pending Queue"
            value={jobsSummary?.totals.pending || 0}
            icon={<Zap className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Time-based Trend Analysis */}
      <RiskTrendsChart 
        data={trendData}
        isLoading={false}
        period={trendPeriod}
        onPeriodChange={setTrendPeriod}
      />

      {/* Risk Distribution & Categories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Severity Distribution */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
          <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Risk Severity Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`${value} (${totalSeverity > 0 ? ((value / totalSeverity) * 100).toFixed(1) : 0}%)`, "Count"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{totalSeverity > 0 ? ((item.value / totalSeverity) * 100).toFixed(0) : 0}%</span>
                    <span className="text-sm font-mono font-semibold text-foreground w-12 text-right">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 border-t border-border pt-4">
            Severity is determined by potential impact magnitude, exploitability, and affected scope
          </p>
        </Card>

        {/* Primary Risk Categories */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
          <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Top Risk Categories (High to Low)</h3>
          <div className="space-y-4">
            {primaryCategoryData.map((category) => {
              const total = primaryCategoryData.reduce((acc, c) => acc + c.value, 0);
              const percentage = total > 0 ? ((category.value / total) * 100).toFixed(0) : "0";
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground">{category.name}</span>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                    <span className="text-sm font-mono font-semibold text-foreground">{category.value}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%`, backgroundColor: category.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Secondary Tags Breakdown with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategoryTrendCard
          title="Technical Risks"
          color="hsl(var(--primary))"
          categories={getTrendCategories(technicalTags)}
          isLoading={false}
        />
        <CategoryTrendCard
          title="Operational Risks"
          color="hsl(var(--warning))"
          categories={getTrendCategories(operationalTags)}
          isLoading={false}
        />
        <CategoryTrendCard
          title="Business Risks"
          color="hsl(280, 70%, 50%)"
          categories={getTrendCategories(businessTags)}
          isLoading={false}
        />
      </div>

      {/* Industry & Confidence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Affected Industries */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Most Affected Industries</h3>
          </div>
          <div className="space-y-3">
            {topIndustries.map((industry, index) => (
              <div key={industry.name} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">{industry.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        industry.sector === "Private" 
                          ? "bg-primary/20 text-primary" 
                          : "bg-warning/20 text-warning"
                      }`}>
                        {industry.sector}
                      </span>
                    </div>
                    <span className="text-sm font-mono font-semibold text-foreground">{industry.count} articles</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      style={{ width: `${topIndustries[0]?.count ? (industry.count / topIndustries[0].count) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Industry Sector Summary */}
          <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Private Sector</p>
                <p className="text-sm font-semibold text-foreground">
                  {industries ? Object.values(industries.private).reduce((a, b) => (a as number) + (b as number), 0) as number : 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">Public Sector</p>
                <p className="text-sm font-semibold text-foreground">
                  {industries ? Object.values(industries.public).reduce((a, b) => (a as number) + (b as number), 0) as number : 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Non-Profit</p>
                <p className="text-sm font-semibold text-foreground">
                  {industries ? Object.values(industries.nonprofit).reduce((a, b) => (a as number) + (b as number), 0) as number : 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Confidence Score */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Analysis Confidence</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${((confidence?.average || 0) / 100) * 352} 352`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{confidence?.average?.toFixed(1) || 0}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Average confidence in risk classification and mapping accuracy
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">High Confidence (&gt;90%)</span>
              <span className="font-mono text-success">{confidence?.high?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Medium (70-90%)</span>
              <span className="font-mono text-warning">{confidence?.medium?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Low (&lt;70%)</span>
              <span className="font-mono text-critical">{confidence?.low?.toLocaleString() || 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
