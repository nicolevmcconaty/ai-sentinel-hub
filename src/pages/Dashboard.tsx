import { useState } from "react";
import { FileText, Shield, CheckCircle, Clock, Zap, Activity, Building2, Briefcase, Heart, TrendingUp, Target, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { WeeklyHeatmap } from "@/components/dashboard/WeeklyHeatmap";
import { RiskCategoriesCard } from "@/components/dashboard/RiskCategoriesCard";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { SeverityDistributionCard } from "@/components/dashboard/SeverityDistributionCard";
import { useDashboardData, useTimePeriodComparison } from "@/hooks/use-dashboard-data";
import { secondaryTagLabels, SecondaryRiskTag, RiskCategoryTrend } from "@/lib/api";

export default function Dashboard() {
  const [trendPeriod, setTrendPeriod] = useState<"week" | "month">("week");
  
  const { 
    dashboardSummary, 
    jobsSummary, 
    riskCategories, 
    industries, 
    confidence,
    platformMetrics,
    severityComparison,
    isLoading,
    isError,
    isUsingMockData,
    refetch 
  } = useDashboardData();
  
  const { 
    data: trendData, 
  } = useTimePeriodComparison(trendPeriod);

  // Prepare secondary tags for each category
  const technicalTags: SecondaryRiskTag[] = ["security_risk", "privacy_risk", "technical_performance_risk", "data_risk"];
  const operationalTags: SecondaryRiskTag[] = ["compliance_regulatory_risk", "legal_liability_risk", "third_party_vendor_risk"];
  const businessTags: SecondaryRiskTag[] = ["business_financial_risk", "reputational_risk", "ethical_risk", "strategic_risk"];

  // Prepare primary category data with tags
  const primaryCategoryData = riskCategories ? [
    { name: "Technical", value: riskCategories.primary.technical, color: "hsl(var(--primary))", tags: technicalTags },
    { name: "Operational", value: riskCategories.primary.operational, color: "hsl(var(--warning))", tags: operationalTags },
    { name: "Business", value: riskCategories.primary.business, color: "hsl(280, 70%, 50%)", tags: businessTags },
  ] : [];

  // Get all trend categories
  const allTrendCategories: RiskCategoryTrend[] = trendData?.categories || 
    [...technicalTags, ...operationalTags, ...businessTags].map(tag => ({
      category: tag,
      label: secondaryTagLabels[tag],
      current: riskCategories?.secondary[tag] || 0,
      previous: 0,
      change: 0,
      changePercent: 0,
      trend: "stable" as const,
    }));

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

      {/* Platform Metrics Section - Enhanced with sparklines */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Platform Metrics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <EnhancedStatCard
            title="Total Articles"
            value={platformMetrics?.totalArticles.current.toLocaleString() || "0"}
            previousValue={platformMetrics?.totalArticles.previous}
            change={platformMetrics?.totalArticles.change}
            changePercent={platformMetrics?.totalArticles.changePercent}
            trend={platformMetrics?.totalArticles.trend}
            sparklineData={platformMetrics?.totalArticles.sparkline}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
          />
          <EnhancedStatCard
            title="Risks Mapped"
            value={platformMetrics?.risksMapped.current.toLocaleString() || "0"}
            previousValue={platformMetrics?.risksMapped.previous}
            change={platformMetrics?.risksMapped.change}
            changePercent={platformMetrics?.risksMapped.changePercent}
            trend={platformMetrics?.risksMapped.trend}
            sparklineData={platformMetrics?.risksMapped.sparkline}
            icon={<Shield className="w-5 h-5" />}
            variant="warning"
          />
          <EnhancedStatCard
            title="Success Rate"
            value={`${platformMetrics?.successRate.current || 0}%`}
            change={platformMetrics?.successRate.change}
            changePercent={platformMetrics?.successRate.changePercent}
            trend={platformMetrics?.successRate.trend}
            sparklineData={platformMetrics?.successRate.sparkline}
            icon={<CheckCircle className="w-5 h-5" />}
            variant="success"
          />
          <EnhancedStatCard
            title="24h Activity"
            value={platformMetrics?.activity24h.current || 0}
            change={platformMetrics?.activity24h.change}
            changePercent={platformMetrics?.activity24h.changePercent}
            trend={platformMetrics?.activity24h.trend}
            sparklineData={platformMetrics?.activity24h.sparkline}
            subtitle={platformMetrics?.activity24h.subtitle}
            icon={<Activity className="w-5 h-5" />}
          />
          <EnhancedStatCard
            title="Avg Processing"
            value={`${platformMetrics?.avgProcessingTime.current || 0}s`}
            change={platformMetrics?.avgProcessingTime.change}
            changePercent={platformMetrics?.avgProcessingTime.changePercent}
            trend={platformMetrics?.avgProcessingTime.trend}
            sparklineData={platformMetrics?.avgProcessingTime.sparkline}
            subtitle={platformMetrics?.avgProcessingTime.subtitle}
            icon={<Clock className="w-5 h-5" />}
          />
          <EnhancedStatCard
            title="Pending Queue"
            value={platformMetrics?.pendingQueue.current || 0}
            change={platformMetrics?.pendingQueue.change}
            changePercent={platformMetrics?.pendingQueue.changePercent}
            trend={platformMetrics?.pendingQueue.trend}
            sparklineData={platformMetrics?.pendingQueue.sparkline}
            subtitle={platformMetrics?.pendingQueue.subtitle}
            icon={<Zap className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Weekly Risk Activity Heatmap */}
      <WeeklyHeatmap isLoading={false} />

      {/* Risk Distribution & Categories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Severity Distribution - Enhanced with comparison */}
        <SeverityDistributionCard 
          data={severityComparison || []}
          overallConfidence={confidence?.average}
          showComparison={true}
        />

        {/* Risk Categories (Primary + Secondary combined) */}
        <RiskCategoriesCard
          primaryCategories={primaryCategoryData}
          trendCategories={allTrendCategories}
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