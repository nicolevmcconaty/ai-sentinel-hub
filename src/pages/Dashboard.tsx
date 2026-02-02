import { useState } from "react";
import { FileText, Shield, CheckCircle, Clock, Zap, Activity, TrendingUp, Target, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { WeeklyHeatmap } from "@/components/dashboard/WeeklyHeatmap";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { SeverityDistributionCard } from "@/components/dashboard/SeverityDistributionCard";
import { RiskDomainTableCard } from "@/components/dashboard/RiskDomainTableCard";
import { ExpandableRiskCategoriesCard } from "@/components/dashboard/ExpandableRiskCategoriesCard";
import { SectorIndustryCard } from "@/components/dashboard/SectorIndustryCard";
import { IndustryDeepDive } from "@/components/dashboard/IndustryDeepDive";
import { useDashboardData, useTimePeriodComparison } from "@/hooks/use-dashboard-data";
import { secondaryTagLabels, SecondaryRiskTag, RiskCategoryTrend, RiskDomain } from "@/lib/api";

export default function Dashboard() {
  // Filter state for domain/category clicks
  const [selectedDomain, setSelectedDomain] = useState<RiskDomain | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SecondaryRiskTag | null>(null);
  const [trendPeriod, setTrendPeriod] = useState<"week" | "month">("week");
  
  // Industry deep dive state
  const [deepDiveIndustry, setDeepDiveIndustry] = useState<{ name: string; sector: "public" | "private" | "nonprofit" } | null>(null);
  
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

  // Handle industry click for deep dive
  const handleIndustryClick = (name: string, sector: "public" | "private" | "nonprofit") => {
    setDeepDiveIndustry({ name, sector });
  };

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
    <div className="space-y-8 animate-fade-in">
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

      {/* SECTION 1: Platform Metrics */}
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

      {/* SECTION 2: Risk Distribution Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeverityDistributionCard 
          data={severityComparison || []}
          overallConfidence={confidence?.average}
          showComparison={true}
        />
        
        {/* Confidence Score Card */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Analysis Confidence</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center py-4 flex-1">
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

          <div className="mt-auto pt-4 border-t border-border space-y-2">
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

      {/* SECTION 3: Risk Database Taxonomy - 7 Domains */}
      <RiskDomainTableCard
        domains={riskCategories?.domains || {
          safety_harm: 0,
          security_threats: 0,
          privacy_data: 0,
          fairness_bias: 0,
          transparency_accountability: 0,
          reliability_robustness: 0,
          societal_environmental: 0,
        }}
        onDomainClick={(domain) => setSelectedDomain(domain === selectedDomain ? null : domain)}
      />

      {/* SECTION 4: Top Risk Categories (Primary + Secondary) */}
      <ExpandableRiskCategoriesCard
        primaryCategories={primaryCategoryData}
        trendCategories={allTrendCategories}
        isLoading={false}
        onCategoryClick={(category) => setSelectedCategory(category === selectedCategory ? null : category)}
      />

      {/* SECTION 5: Industry Tagging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          {industries && (
            <SectorIndustryCard
              industries={industries}
              onIndustryClick={handleIndustryClick}
            />
          )}
        </div>
      </div>

      {/* SECTION 6: Time Based Analysis (at the bottom) */}
      <WeeklyHeatmap isLoading={false} />

      {/* Industry Deep Dive Panel */}
      {deepDiveIndustry && (
        <IndustryDeepDive
          isOpen={!!deepDiveIndustry}
          onClose={() => setDeepDiveIndustry(null)}
          industry={deepDiveIndustry.name}
          sector={deepDiveIndustry.sector}
        />
      )}
    </div>
  );
}